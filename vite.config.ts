import react from "@vitejs/plugin-react";
import type { IncomingMessage, ServerResponse } from "node:http";
import { defineConfig, loadEnv, type Plugin } from "vite";

type MotTest = {
  completedDate?: string;
  expiryDate?: string;
  testResult?: string;
};

type MotVehicle = {
  registration?: string;
  make?: string;
  model?: string;
  primaryColour?: string;
  fuelType?: string;
  manufactureDate?: string;
  motTests?: MotTest[];
};

type Environment = Record<string, string>;

let accessToken = "";
let accessTokenExpiresAt = 0;

function sendJson(response: ServerResponse, status: number, payload: unknown) {
  response.statusCode = status;
  response.setHeader("Content-Type", "application/json");
  response.end(JSON.stringify(payload));
}

async function readRequestBody(request: IncomingMessage) {
  let body = "";
  for await (const chunk of request) body += chunk.toString();
  return JSON.parse(body) as { registrationNumber?: string };
}

function normaliseRegistration(value: string) {
  return value.toUpperCase().replace(/[^A-Z0-9]/g, "");
}

function getMotStatus(latestTest?: MotTest) {
  if (!latestTest) return "No MOT details";
  if (latestTest.testResult?.toUpperCase() !== "PASSED") return "Not valid";
  if (!latestTest.expiryDate) return "Passed";
  return new Date(`${latestTest.expiryDate}T23:59:59`) >= new Date() ? "Valid" : "Expired";
}

function createDemoVehicle(registrationNumber: string) {
  const expiryDate = new Date();
  expiryDate.setFullYear(expiryDate.getFullYear() + 1);

  return {
    registrationNumber,
    make: "FORD",
    model: "FOCUS",
    colour: "RED",
    fuelType: "PETROL",
    yearOfManufacture: 2019,
    motStatus: "Valid",
    motExpiryDate: expiryDate.toISOString().slice(0, 10),
    source: "demo",
    verifiedAt: new Date().toISOString(),
  };
}

async function getAccessToken(environment: Environment) {
  if (accessToken && Date.now() < accessTokenExpiresAt) return accessToken;

  const tokenResponse = await fetch(environment.DVSA_MOT_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: environment.DVSA_MOT_CLIENT_ID,
      client_secret: environment.DVSA_MOT_CLIENT_SECRET,
      scope: environment.DVSA_MOT_SCOPE,
    }),
  });
  if (!tokenResponse.ok) throw new Error("DVSA authentication failed.");

  const tokenData = (await tokenResponse.json()) as {
    access_token?: string;
    expires_in?: number;
  };
  if (!tokenData.access_token) throw new Error("DVSA did not return an access token.");

  accessToken = tokenData.access_token;
  accessTokenExpiresAt = Date.now() + Math.max(60, (tokenData.expires_in ?? 1200) - 60) * 1000;
  return accessToken;
}

async function lookupLiveVehicle(registrationNumber: string, environment: Environment) {
  const token = await getAccessToken(environment);
  const lookupResponse = await fetch(
    `https://history.mot.api.gov.uk/v1/trade/vehicles/registration/${encodeURIComponent(registrationNumber)}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "X-API-Key": environment.DVSA_MOT_API_KEY,
        Accept: "application/json",
      },
    },
  );

  if (lookupResponse.status === 404) {
    throw new Error("No vehicle was found for this registration number.");
  }
  if (!lookupResponse.ok) {
    throw new Error("The DVSA vehicle service is unavailable. Continue with manual details.");
  }

  const lookupData = (await lookupResponse.json()) as MotVehicle | MotVehicle[];
  const vehicle = Array.isArray(lookupData) ? lookupData[0] : lookupData;
  if (!vehicle) throw new Error("No vehicle details were returned.");

  const latestTest = [...(vehicle.motTests ?? [])].sort((first, second) =>
    (second.completedDate ?? "").localeCompare(first.completedDate ?? ""),
  )[0];

  return {
    registrationNumber: normaliseRegistration(vehicle.registration ?? registrationNumber),
    make: vehicle.make ?? "Not provided",
    model: vehicle.model ?? "Not provided",
    colour: vehicle.primaryColour ?? "Not provided",
    fuelType: vehicle.fuelType ?? "Not provided",
    yearOfManufacture: vehicle.manufactureDate
      ? Number(vehicle.manufactureDate.slice(0, 4))
      : undefined,
    motStatus: getMotStatus(latestTest),
    motExpiryDate: latestTest?.expiryDate,
    source: "dvsa",
    verifiedAt: new Date().toISOString(),
  };
}

function vehicleLookupPlugin(environment: Environment): Plugin {
  const requiredEnvironmentValues = [
    "DVSA_MOT_API_KEY",
    "DVSA_MOT_CLIENT_ID",
    "DVSA_MOT_CLIENT_SECRET",
    "DVSA_MOT_TOKEN_URL",
    "DVSA_MOT_SCOPE",
  ];

  async function vehicleLookupHandler(request: IncomingMessage, response: ServerResponse) {
    if (request.method !== "POST") {
      sendJson(response, 405, { message: "Use a POST request for vehicle verification." });
      return;
    }

    try {
      const body = await readRequestBody(request);
      const registrationNumber = normaliseRegistration(body.registrationNumber ?? "");
      if (!/^[A-Z0-9]{2,8}$/.test(registrationNumber)) {
        sendJson(response, 400, { message: "Enter a valid UK registration number." });
        return;
      }

      if (registrationNumber === "AA19AAA") {
        sendJson(response, 200, createDemoVehicle(registrationNumber));
        return;
      }

      const isConfigured = requiredEnvironmentValues.every((key) => environment[key]);
      if (!isConfigured) {
        sendJson(response, 503, {
          message: "Live DVSA verification is not connected yet. Continue manually or use AA19AAA to preview the verification journey.",
          code: "NOT_CONFIGURED",
        });
        return;
      }

      sendJson(response, 200, await lookupLiveVehicle(registrationNumber, environment));
    } catch (error) {
      sendJson(response, 502, {
        message: error instanceof Error ? error.message : "Vehicle verification failed.",
      });
    }
  }

  return {
    name: "response-able-vehicle-lookup",
    configureServer(server) {
      server.middlewares.use("/api/vehicle-lookup", vehicleLookupHandler);
    },
    configurePreviewServer(server) {
      server.middlewares.use("/api/vehicle-lookup", vehicleLookupHandler);
    },
  };
}

export default defineConfig(({ mode }) => {
  const environment = loadEnv(mode, ".", "");

  return { 
    base: "/Demo-RAS/",
    plugins: [react(), vehicleLookupPlugin(environment)],
  };
});
