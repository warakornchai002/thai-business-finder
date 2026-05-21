type CategoryKey =
  | "restaurant"
  | "cafe"
  | "bakery"
  | "fast_food"
  | "bar"
  | "convenience_store"
  | "supermarket"
  | "hotel"
  | "pharmacy"
  | "clinic"
  | "hospital"
  | "bank"
  | "atm"
  | "gas_station"
  | "laundry"
  | "school"
  | "mall"
  | "beauty"
  | "pet_shop";

type TagQuery = {
  key: string;
  value: string;
};

type Category = {
  key: CategoryKey;
  label: string;
  tags: TagQuery[];
};

type SearchBody = {
  province?: unknown;
  district?: unknown;
  keyword?: unknown;
  category?: unknown;
};

type NominatimResult = {
  display_name?: string;
  boundingbox?: [string, string, string, string];
  class?: string;
  type?: string;
  osm_type?: string;
};

type BoundaryResult = NominatimResult & {
  boundingbox: [string, string, string, string];
};

type OverpassElement = {
  type: "node" | "way" | "relation";
  id: number;
  lat?: number;
  lon?: number;
  center?: {
    lat?: number;
    lon?: number;
  };
  tags?: Record<string, string>;
};

type Place = {
  id: string;
  name: string;
  category: string;
  address: string;
  lat: number;
  lon: number;
  tags: Record<string, string>;
};

type OverpassResponse = {
  elements?: OverpassElement[];
};

const OVERPASS_ENDPOINTS = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
  "https://overpass.openstreetmap.fr/api/interpreter",
  "https://overpass.osm.ch/api/interpreter",
] as const;

const OVERPASS_FETCH_TIMEOUT_MS = 12_000;

const CATEGORIES: Category[] = [
  { key: "restaurant", label: "Restaurant", tags: [{ key: "amenity", value: "restaurant" }] },
  { key: "cafe", label: "Cafe", tags: [{ key: "amenity", value: "cafe" }] },
  { key: "bakery", label: "Bakery", tags: [{ key: "shop", value: "bakery" }] },
  { key: "fast_food", label: "Fast food", tags: [{ key: "amenity", value: "fast_food" }] },
  {
    key: "bar",
    label: "Bar",
    tags: [
      { key: "amenity", value: "bar" },
      { key: "amenity", value: "pub" },
    ],
  },
  {
    key: "convenience_store",
    label: "Convenience store",
    tags: [{ key: "shop", value: "convenience" }],
  },
  { key: "supermarket", label: "Supermarket", tags: [{ key: "shop", value: "supermarket" }] },
  { key: "hotel", label: "Hotel", tags: [{ key: "tourism", value: "hotel" }] },
  { key: "pharmacy", label: "Pharmacy", tags: [{ key: "amenity", value: "pharmacy" }] },
  {
    key: "clinic",
    label: "Clinic",
    tags: [
      { key: "amenity", value: "clinic" },
      { key: "amenity", value: "doctors" },
    ],
  },
  { key: "hospital", label: "Hospital", tags: [{ key: "amenity", value: "hospital" }] },
  { key: "bank", label: "Bank", tags: [{ key: "amenity", value: "bank" }] },
  { key: "atm", label: "ATM", tags: [{ key: "amenity", value: "atm" }] },
  { key: "gas_station", label: "Gas station", tags: [{ key: "amenity", value: "fuel" }] },
  { key: "laundry", label: "Laundry", tags: [{ key: "shop", value: "laundry" }] },
  { key: "school", label: "School", tags: [{ key: "amenity", value: "school" }] },
  { key: "mall", label: "Mall", tags: [{ key: "shop", value: "mall" }] },
  {
    key: "beauty",
    label: "Beauty",
    tags: [
      { key: "shop", value: "beauty" },
      { key: "shop", value: "hairdresser" },
    ],
  },
  { key: "pet_shop", label: "Pet shop", tags: [{ key: "shop", value: "pet" }] },
];

const getCategory = (key: unknown) =>
  CATEGORIES.find((category) => category.key === key) ?? CATEGORIES[0];

const normalize = (value: string) => value.trim().toLocaleLowerCase("th-TH");

const buildNominatimUrl = (query: string) => {
  const params = new URLSearchParams({
    q: `${query}, ประเทศไทย`,
    format: "jsonv2",
    addressdetails: "1",
    limit: "5",
    countrycodes: "th",
    "accept-language": "th,en",
  });

  return `https://nominatim.openstreetmap.org/search?${params.toString()}`;
};

const fetchNominatim = async (query: string) => {
  const response = await fetch(buildNominatimUrl(query), {
    cache: "no-store",
    headers: {
      "User-Agent": "thai-business-finder/0.1",
      Referer: "https://thai-business-finder.local",
    },
  });

  if (!response.ok) {
    throw new Error("Nominatim could not be reached.");
  }

  return (await response.json()) as NominatimResult[];
};

const hasBoundingBox = (result: NominatimResult): result is BoundaryResult =>
  Boolean(result.boundingbox);

const isLikelyBoundary = (result: NominatimResult): result is BoundaryResult =>
  hasBoundingBox(result) &&
  (result.class === "boundary" ||
    result.type === "administrative" ||
    result.osm_type === "relation");

const findLikelyBoundary = (results: NominatimResult[]): BoundaryResult | undefined =>
  results.find(isLikelyBoundary) ?? results.find(hasBoundingBox);

const findStrictBoundary = (results: NominatimResult[]): BoundaryResult | undefined =>
  results.find(isLikelyBoundary);

const geocode = async (
  province: string,
  district: string,
): Promise<{ result: BoundaryResult; scope: "district" | "province" }> => {
  if (district) {
    const districtBoundary = findStrictBoundary(await fetchNominatim(`${district}, ${province}`));

    if (districtBoundary?.boundingbox) {
      return { result: districtBoundary, scope: "district" };
    }
  }

  const provinceBoundary = findLikelyBoundary(await fetchNominatim(province));

  if (!provinceBoundary?.boundingbox) {
    throw new Error("No usable map boundary was found for this province.");
  }

  return { result: provinceBoundary, scope: "province" };
};

const escapeOverpassValue = (value: string) =>
  value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');

const buildOverpassQuery = (category: Category, bbox: [string, string, string, string]) => {
  const [south, north, west, east] = bbox;
  const bounds = `${south},${west},${north},${east}`;
  const clauses = category.tags
    .map((tag) => `nwr["${tag.key}"="${escapeOverpassValue(tag.value)}"](${bounds});`)
    .join("\n");

  return `[out:json][timeout:12];
(
${clauses}
);
out center;`;
};

const fetchOverpassEndpoint = async (
  endpoint: string,
  query: string,
): Promise<OverpassResponse> => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), OVERPASS_FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      cache: "no-store",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
      body: new URLSearchParams({ data: query }),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Overpass endpoint returned ${response.status}.`);
    }

    return (await response.json()) as OverpassResponse;
  } finally {
    clearTimeout(timeout);
  }
};

const queryOverpass = async (category: Category, bbox: [string, string, string, string]) => {
  const query = buildOverpassQuery(category, bbox);

  for (const endpoint of OVERPASS_ENDPOINTS) {
    try {
      return await fetchOverpassEndpoint(endpoint, query);
    } catch {
      continue;
    }
  }

  throw new Error("Map search is busy right now. Please try again in a moment.");
};

const formatAddress = (tags: Record<string, string>) => {
  const parts = [
    tags["addr:housenumber"],
    tags["addr:street"],
    tags["addr:subdistrict"],
    tags["addr:district"],
    tags["addr:city"],
    tags["addr:province"],
  ].filter(Boolean);

  return parts.length > 0
    ? parts.join(", ")
    : tags["addr:full"] || tags["addr:place"] || tags["is_in"] || "Area details not listed";
};

const elementToPlace = (element: OverpassElement, fallbackCategory: string): Place | null => {
  const lat = element.lat ?? element.center?.lat;
  const lon = element.lon ?? element.center?.lon;
  const tags = element.tags ?? {};

  if (typeof lat !== "number" || typeof lon !== "number") {
    return null;
  }

  return {
    id: `${element.type}-${element.id}`,
    name: tags.name || tags["name:th"] || tags["name:en"] || "Unnamed place",
    category: tags.amenity || tags.shop || tags.tourism || fallbackCategory,
    address: formatAddress(tags),
    lat,
    lon,
    tags,
  };
};

const hasKeyword = (place: Place, keyword: string) => {
  const needle = normalize(keyword);
  if (!needle) {
    return true;
  }

  const searchable = [
    place.name,
    place.address,
    ...Object.entries(place.tags).flatMap(([key, value]) => [key, value]),
  ]
    .join(" ")
    .toLocaleLowerCase("th-TH");

  return searchable.includes(needle);
};

const collectPlaces = (
  elements: OverpassElement[],
  category: Category,
  keyword: string,
) => {
  const seen = new Map<string, Place>();

  for (const element of elements) {
    const place = elementToPlace(element, category.label);
    if (!place || !hasKeyword(place, keyword)) {
      continue;
    }

    const fuzzyKey =
      place.name === "Unnamed place"
        ? place.id
        : `${normalize(place.name)}:${place.lat.toFixed(5)}:${place.lon.toFixed(5)}`;

    if (!seen.has(fuzzyKey)) {
      seen.set(fuzzyKey, place);
    }
  }

  return Array.from(seen.values()).sort((a, b) => a.name.localeCompare(b.name, "th"));
};

const getString = (value: unknown) => (typeof value === "string" ? value.trim() : "");

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as SearchBody;
    const province = getString(body.province);
    const district = getString(body.district);
    const keyword = getString(body.keyword);
    const category = getCategory(body.category);

    if (!province) {
      return Response.json({ error: "Province is required." }, { status: 400 });
    }

    const geocoded = await geocode(province, district);
    const overpassData = await queryOverpass(category, geocoded.result.boundingbox);
    const places = collectPlaces(overpassData.elements ?? [], category, keyword);

    return Response.json({
      scope: geocoded.scope,
      boundaryName: geocoded.result.display_name ?? province,
      categoryLabel: category.label,
      count: places.length,
      places,
    });
  } catch (error) {
    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Search failed. Please try again.",
      },
      { status: 500 },
    );
  }
}
