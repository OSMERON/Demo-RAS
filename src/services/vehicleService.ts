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

type DemoVehicle = Omit<
  VerifiedVehicle,
  "registrationNumber" | "source" | "verifiedAt"
>;

// These demonstration records are stored in the front-end so they also work
// after the site is deployed to static hosting such as GitHub Pages.
// Add the two extra demonstration registrations here when their details are known.
const DEMO_VEHICLES: Record<string, DemoVehicle> = {
  AA19AAA: {
    make: "FORD",
    model: "FOCUS",
    colour: "RED",
    fuelType: "PETROL",
    yearOfManufacture: 2019,
    motStatus: "Valid",
    motExpiryDate: "2027-09-06",
  },
};

export const DEMO_REGISTRATIONS = Object.keys(DEMO_VEHICLES);

export function formatRegistrationNumber(value: string) {
  return value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 8);
}

function getDemoVehicle(registrationNumber: string): VerifiedVehicle | null {
  const demo = DEMO_VEHICLES[registrationNumber];
  if (!demo) return null;

  return {
    registrationNumber,
    ...demo,
    source: "demo",
    verifiedAt: new Date().toISOString(),
  };
}

export async function verifyVehicleRegistration(registrationNumber: string) {
  const normalisedRegistration = formatRegistrationNumber(registrationNumber);

  // IMPORTANT: check demo data before calling /api/vehicle-lookup.
  // GitHub Pages only serves static files, so Vite middleware does not exist there.
  const demoVehicle = getDemoVehicle(normalisedRegistration);
  if (demoVehicle) return demoVehicle;

  // On GitHub Pages there is no secure server endpoint for live DVSA credentials.
  // Keep the manual-entry journey available and explain which demo registrations work.
  if (window.location.hostname.endsWith("github.io")) {
    throw new Error(
      `Live DVSA verification is not connected in this static demo. Use ${DEMO_REGISTRATIONS.join(
        ", ",
      )} to preview vehicle and MOT verification, or continue with manual vehicle details.`,
    );
  }

  const response = await fetch("/api/vehicle-lookup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      registrationNumber: normalisedRegistration,
    }),
  });

  const responseText = await response.text();
  if (!responseText.trim()) {
    throw new Error(
      "The local vehicle verification endpoint is not running. Restart the development server and try again.",
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
