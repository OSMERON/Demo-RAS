const postcodePattern = /^(GIR ?0AA|[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2})$/i;

type Coordinates = {
  latitude: number;
  longitude: number;
};

type PostcodesIoResponse = {
  status: number;
  result?: {
    postcode: string;
    latitude: number | null;
    longitude: number | null;
  };
};

type OsrmResponse = {
  code?: string;
  routes?: Array<{ distance: number }>;
};

const coordinateCache = new Map<string, Coordinates>();

export function formatUkPostcode(value: string) {
  const compact = value.trim().toUpperCase().replace(/\s+/g, "");
  if (compact.length <= 3) return compact;
  return `${compact.slice(0, -3)} ${compact.slice(-3)}`;
}

export function isValidUkPostcode(value: string) {
  return postcodePattern.test(formatUkPostcode(value));
}

async function geocodePostcode(postcode: string): Promise<Coordinates> {
  const formattedPostcode = formatUkPostcode(postcode);
  const cached = coordinateCache.get(formattedPostcode);
  if (cached) return cached;

  const compactPostcode = formattedPostcode.replace(/\s/g, "");
  const response = await fetch(
    `https://api.postcodes.io/postcodes/${encodeURIComponent(compactPostcode)}`,
  );
  if (response.status === 404) {
    throw new Error(`${formattedPostcode} is not recognised as a current UK postcode.`);
  }
  if (!response.ok) {
    throw new Error("The UK postcode service is unavailable. Please try again shortly.");
  }

  const postcodeResult = (await response.json()) as PostcodesIoResponse;
  const latitude = postcodeResult.result?.latitude;
  const longitude = postcodeResult.result?.longitude;
  if (
    postcodeResult.status !== 200
    || typeof latitude !== "number"
    || typeof longitude !== "number"
  ) {
    throw new Error(`Coordinates were not found for ${formattedPostcode}.`);
  }

  const coordinates = {
    latitude,
    longitude,
  };
  coordinateCache.set(formattedPostcode, coordinates);
  return coordinates;
}

export async function calculateRouteDistanceMiles(from: string, to: string) {
  if (!isValidUkPostcode(from) || !isValidUkPostcode(to)) {
    throw new Error("Enter two complete UK postcodes before calculating the route.");
  }

  const [collection, delivery] = await Promise.all([
    geocodePostcode(from),
    geocodePostcode(to),
  ]);
  const coordinatePair = `${collection.longitude},${collection.latitude};${delivery.longitude},${delivery.latitude}`;
  const response = await fetch(
    `https://router.project-osrm.org/route/v1/driving/${coordinatePair}?overview=false&alternatives=false&steps=false`,
  );
  if (!response.ok) throw new Error("The driving route service is unavailable at the moment.");

  const result = (await response.json()) as OsrmResponse;
  const distanceInMetres = result.routes?.[0]?.distance;
  if (result.code !== "Ok" || typeof distanceInMetres !== "number") {
    throw new Error("A driving route could not be calculated between these postcodes.");
  }

  return Number((distanceInMetres * 0.000621371).toFixed(1));
}
