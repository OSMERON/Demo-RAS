export type VerifiedVehicle = {
  registrationNumber: string;
  make: string;
  model: string;
  colour: string;
  fuelType: string;
  yearOfManufacture?: number;
  motStatus: string;
  motExpiryDate?: string;
  source: "demo" | "dvsa";
  verifiedAt: string;
};

export function formatRegistrationNumber(value: string) {
  return value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 8);
}

export async function verifyVehicleRegistration(registrationNumber: string) {
  const response = await fetch("/api/vehicle-lookup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      registrationNumber: formatRegistrationNumber(registrationNumber),
    }),
  });

  const responseText = await response.text();
  if (!responseText.trim()) {
    throw new Error(
      "The local vehicle verification endpoint is not running. Replace vite.config.ts, stop the server, then run npm install and npm run dev again.",
    );
  }

  let result: VerifiedVehicle | { message?: string };
  try {
    result = JSON.parse(responseText) as VerifiedVehicle | { message?: string };
  } catch {
    throw new Error(
      "The vehicle verification endpoint returned an invalid response. Restart the local development server.",
    );
  }

  if (!response.ok) {
    throw new Error(
      "message" in result && result.message
        ? result.message
        : "Vehicle verification failed.",
    );
  }

  return result as VerifiedVehicle;
}
