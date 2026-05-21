"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

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
  tone: string;
  icon: string;
  tags: TagQuery[];
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

type SearchResponse = {
  scope: "subdistrict" | "district" | "province";
  boundaryName: string;
  categoryLabel: string;
  count: number;
  places: Place[];
  error?: string;
};

type ProvincesResponse = {
  provinces?: string[];
  error?: string;
};

type DistrictsResponse = {
  districts?: string[];
  error?: string;
};

type SubdistrictsResponse = {
  subdistricts?: string[];
  error?: string;
};

const CATEGORIES: Category[] = [
  {
    key: "restaurant",
    label: "Restaurant",
    tone: "bg-rose-50 text-rose-700 ring-rose-200",
    icon: "M4 5h16M6 5v14M14 5v14M18 5v14M8 9h4",
    tags: [{ key: "amenity", value: "restaurant" }],
  },
  {
    key: "cafe",
    label: "Cafe",
    tone: "bg-amber-50 text-amber-800 ring-amber-200",
    icon: "M5 8h10v5a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4V8Zm10 2h2a2 2 0 0 1 0 4h-2",
    tags: [{ key: "amenity", value: "cafe" }],
  },
  {
    key: "bakery",
    label: "Bakery",
    tone: "bg-orange-50 text-orange-700 ring-orange-200",
    icon: "M5 12c2-5 12-5 14 0-1 5-13 5-14 0Zm3 1h8",
    tags: [{ key: "shop", value: "bakery" }],
  },
  {
    key: "fast_food",
    label: "Fast food",
    tone: "bg-red-50 text-red-700 ring-red-200",
    icon: "M5 9h14l-1 10H6L5 9Zm2-4h10l2 4H5l2-4Z",
    tags: [{ key: "amenity", value: "fast_food" }],
  },
  {
    key: "bar",
    label: "Bar",
    tone: "bg-fuchsia-50 text-fuchsia-700 ring-fuchsia-200",
    icon: "M6 5h12l-2 7a4 4 0 0 1-8 0L6 5Zm6 11v3m-3 0h6",
    tags: [
      { key: "amenity", value: "bar" },
      { key: "amenity", value: "pub" },
    ],
  },
  {
    key: "convenience_store",
    label: "Convenience store",
    tone: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    icon: "M5 9h14v10H5V9Zm2-4h10l2 4H5l2-4Zm3 8h4",
    tags: [{ key: "shop", value: "convenience" }],
  },
  {
    key: "supermarket",
    label: "Supermarket",
    tone: "bg-teal-50 text-teal-700 ring-teal-200",
    icon: "M4 6h2l2 10h9l2-7H7m2 11h.01M17 20h.01",
    tags: [{ key: "shop", value: "supermarket" }],
  },
  {
    key: "hotel",
    label: "Hotel",
    tone: "bg-sky-50 text-sky-700 ring-sky-200",
    icon: "M5 19V6h14v13M5 12h14M8 9h2m4 0h2m-8 6h8",
    tags: [{ key: "tourism", value: "hotel" }],
  },
  {
    key: "pharmacy",
    label: "Pharmacy",
    tone: "bg-lime-50 text-lime-700 ring-lime-200",
    icon: "M12 5v14M5 12h14",
    tags: [{ key: "amenity", value: "pharmacy" }],
  },
  {
    key: "clinic",
    label: "Clinic",
    tone: "bg-cyan-50 text-cyan-700 ring-cyan-200",
    icon: "M6 19V7h12v12M9 11h6M12 8v6",
    tags: [
      { key: "amenity", value: "clinic" },
      { key: "amenity", value: "doctors" },
    ],
  },
  {
    key: "hospital",
    label: "Hospital",
    tone: "bg-blue-50 text-blue-700 ring-blue-200",
    icon: "M5 19V5h14v14M9 12h6M12 9v6",
    tags: [{ key: "amenity", value: "hospital" }],
  },
  {
    key: "bank",
    label: "Bank",
    tone: "bg-indigo-50 text-indigo-700 ring-indigo-200",
    icon: "M4 9h16L12 4 4 9Zm2 2v7m4-7v7m4-7v7m4-7v7M4 20h16",
    tags: [{ key: "amenity", value: "bank" }],
  },
  {
    key: "atm",
    label: "ATM",
    tone: "bg-violet-50 text-violet-700 ring-violet-200",
    icon: "M6 5h12v14H6V5Zm3 4h6M9 13h2m2 0h2m-6 3h6",
    tags: [{ key: "amenity", value: "atm" }],
  },
  {
    key: "gas_station",
    label: "Gas station",
    tone: "bg-yellow-50 text-yellow-800 ring-yellow-200",
    icon: "M7 19V5h8v14M9 8h4m2 2h2l1 2v5a2 2 0 0 1-2 2h-1",
    tags: [{ key: "amenity", value: "fuel" }],
  },
  {
    key: "laundry",
    label: "Laundry",
    tone: "bg-purple-50 text-purple-700 ring-purple-200",
    icon: "M6 5h12v14H6V5Zm3 3h.01M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",
    tags: [{ key: "shop", value: "laundry" }],
  },
  {
    key: "school",
    label: "School",
    tone: "bg-stone-100 text-stone-700 ring-stone-300",
    icon: "M4 9l8-4 8 4-8 4-8-4Zm3 3v4c3 2 7 2 10 0v-4",
    tags: [{ key: "amenity", value: "school" }],
  },
  {
    key: "mall",
    label: "Mall",
    tone: "bg-pink-50 text-pink-700 ring-pink-200",
    icon: "M6 8h12l-1 11H7L6 8Zm3 0a3 3 0 0 1 6 0",
    tags: [{ key: "shop", value: "mall" }],
  },
  {
    key: "beauty",
    label: "Beauty",
    tone: "bg-rose-50 text-rose-700 ring-rose-200",
    icon: "M12 4c3 4 5 6 5 9a5 5 0 0 1-10 0c0-3 2-5 5-9Z",
    tags: [
      { key: "shop", value: "beauty" },
      { key: "shop", value: "hairdresser" },
    ],
  },
  {
    key: "pet_shop",
    label: "Pet shop",
    tone: "bg-green-50 text-green-700 ring-green-200",
    icon: "M8 10h.01M16 10h.01M10 14c1.2 1 2.8 1 4 0m-7 5c-2-2-2-6 0-9 3-4 7-4 10 0 2 3 2 7 0 9H7Z",
    tags: [{ key: "shop", value: "pet" }],
  },
];

const DEFAULT_CATEGORY = CATEGORIES[0].key;

const textInputClass =
  "h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-950 shadow-sm shadow-slate-200/50 outline-none transition placeholder:font-normal placeholder:text-slate-400 hover:border-slate-300 focus:border-teal-500 focus:ring-4 focus:ring-teal-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400";

const getCategory = (key: CategoryKey) =>
  CATEGORIES.find((category) => category.key === key) ?? CATEGORIES[0];

const fetchGeography = async <ResponseData,>(
  path: string,
  signal: AbortSignal,
): Promise<ResponseData> => {
  const response = await fetch(path, { signal });
  const data = (await response.json()) as ResponseData & { error?: string };

  if (!response.ok) {
    throw new Error(data.error || "Could not load geography options.");
  }

  return data;
};

const InfoIcon = ({ path }: { path: string }) => (
  <svg
    aria-hidden="true"
    className="h-5 w-5"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="1.8"
    viewBox="0 0 24 24"
  >
    <path d={path} />
  </svg>
);

const ExternalIcon = () => (
  <svg
    aria-hidden="true"
    className="h-4 w-4"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path d="M7 17 17 7M9 7h8v8" />
  </svg>
);

export default function Home() {
  const [provinces, setProvinces] = useState<string[]>([]);
  const [districts, setDistricts] = useState<string[]>([]);
  const [subdistricts, setSubdistricts] = useState<string[]>([]);
  const [province, setProvince] = useState<string>("");
  const [district, setDistrict] = useState<string>("");
  const [subdistrict, setSubdistrict] = useState<string>("");
  const [geographyLoading, setGeographyLoading] = useState(true);
  const [keyword, setKeyword] = useState<string>("");
  const [categoryKey, setCategoryKey] = useState<CategoryKey>(DEFAULT_CATEGORY);
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);
  const [scopeNote, setScopeNote] = useState("");
  const [boundaryName, setBoundaryName] = useState("");

  const selectedCategory = useMemo(() => getCategory(categoryKey), [categoryKey]);

  const handleProvinceChange = (nextProvince: string) => {
    setProvince(nextProvince);
    setDistricts([]);
    setDistrict("");
    setSubdistricts([]);
    setSubdistrict("");
  };

  const handleDistrictChange = (nextDistrict: string) => {
    setDistrict(nextDistrict);
    setSubdistricts([]);
    setSubdistrict("");
  };

  useEffect(() => {
    const controller = new AbortController();

    const loadProvinces = async () => {
      try {
        setGeographyLoading(true);
        setError("");
        const data = await fetchGeography<ProvincesResponse>(
          "/api/geography",
          controller.signal,
        );
        const nextProvinces = data.provinces ?? [];

        setProvinces(nextProvinces);
        setProvince((currentProvince) =>
          currentProvince && nextProvinces.includes(currentProvince)
            ? currentProvince
            : nextProvinces[0] ?? "",
        );
      } catch (geographyError) {
        if (!controller.signal.aborted) {
          setError(
            geographyError instanceof Error
              ? geographyError.message
              : "Could not load geography options.",
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setGeographyLoading(false);
        }
      }
    };

    loadProvinces();

    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!province) {
      return;
    }

    const controller = new AbortController();

    const loadDistricts = async () => {
      try {
        const params = new URLSearchParams({ province });
        const data = await fetchGeography<DistrictsResponse>(
          `/api/geography?${params.toString()}`,
          controller.signal,
        );
        const nextDistricts = data.districts ?? [];

        setDistricts(nextDistricts);
        setDistrict(nextDistricts[0] ?? "");
      } catch (geographyError) {
        if (!controller.signal.aborted) {
          setDistricts([]);
          setDistrict("");
          setError(
            geographyError instanceof Error
              ? geographyError.message
              : "Could not load district options.",
          );
        }
      }
    };

    loadDistricts();

    return () => controller.abort();
  }, [province]);

  useEffect(() => {
    if (!province || !district) {
      return;
    }

    const controller = new AbortController();

    const loadSubdistricts = async () => {
      try {
        const params = new URLSearchParams({ province, district });
        const data = await fetchGeography<SubdistrictsResponse>(
          `/api/geography?${params.toString()}`,
          controller.signal,
        );
        const nextSubdistricts = data.subdistricts ?? [];

        setSubdistricts(nextSubdistricts);
        setSubdistrict(nextSubdistricts[0] ?? "");
      } catch (geographyError) {
        if (!controller.signal.aborted) {
          setSubdistricts([]);
          setSubdistrict("");
          setError(
            geographyError instanceof Error
              ? geographyError.message
              : "Could not load subdistrict options.",
          );
        }
      }
    };

    loadSubdistricts();

    return () => controller.abort();
  }, [province, district]);

  const handleSearch = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!province || !district || !subdistrict) {
      setError("Choose a province, district, and subdistrict before searching.");
      return;
    }

    setLoading(true);
    setError("");
    setSearched(true);
    setPlaces([]);
    setScopeNote("");
    setBoundaryName("");

    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          province,
          district,
          subdistrict,
          keyword,
          category: categoryKey,
        }),
      });
      const searchData = (await response.json()) as SearchResponse;

      if (!response.ok) {
        throw new Error(searchData.error || "Search failed. Please try again.");
      }

      setPlaces(searchData.places);
      setBoundaryName(searchData.boundaryName);
      setScopeNote(
        searchData.scope === "subdistrict"
          ? `Searched within ${subdistrict}, ${district}, ${province}.`
          : searchData.scope === "district"
            ? `Subdistrict lookup for "${subdistrict}" did not return a boundary, so this searched ${district}, ${province}.`
            : `Local boundary lookup did not return a district or subdistrict boundary, so this searched all of ${province}.`,
      );
    } catch (searchError) {
      setError(
        searchError instanceof Error
          ? searchError.message
          : "Search failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,#ccfbf1_0,#f8fafc_34%,#ffffff_70%)]">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-teal-500 via-emerald-400 to-sky-500" />
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-7 px-4 pb-7 pt-10 sm:px-6 sm:pb-9 sm:pt-12 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-center">
            <div className="space-y-6">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-teal-200/70 bg-white/80 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-teal-800 shadow-sm shadow-teal-100/70">
                OpenStreetMap Business Finder
              </div>
              <div className="max-w-4xl space-y-4">
                <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                  Find Thai businesses with local precision.
                </h1>
                <p className="max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                  Search public map data by province, district, subdistrict, category,
                  and optional keyword in one focused workflow.
                </p>
              </div>
              <div className="flex flex-wrap gap-2.5 text-sm font-medium text-slate-700">
                {["Live OSM data", "Cascading Thai geography", "Category-aware results"].map(
                  (feature) => (
                    <span
                      key={feature}
                      className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/75 px-3 py-1.5 shadow-sm"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />
                      {feature}
                    </span>
                  ),
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 lg:grid-cols-1">
              {[
                ["77", "Thai provinces", "bg-slate-950 text-white"],
                [String(CATEGORIES.length), "Search categories", "bg-teal-600 text-white"],
                [String(places.length), "Results now", "bg-white text-slate-950 ring-1 ring-slate-200"],
              ].map(([value, label, className]) => (
                <div
                  key={label}
                  className={`rounded-2xl p-4 shadow-lg shadow-slate-200/70 ${className}`}
                >
                  <div className="text-2xl font-semibold tracking-tight">{value}</div>
                  <div className="mt-1 text-xs font-medium opacity-75">{label}</div>
                </div>
              ))}
            </div>
          </div>

          <form
            onSubmit={handleSearch}
            className="rounded-3xl border border-white/80 bg-white/90 p-4 shadow-2xl shadow-slate-200/70 backdrop-blur md:p-5"
          >
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-[1fr_1fr_1fr_1fr_auto] xl:items-end">
              <label className="space-y-2">
                <span className="px-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Province
                </span>
                <select
                  className={textInputClass}
                  disabled={geographyLoading || provinces.length === 0}
                  value={province}
                  onChange={(event) => handleProvinceChange(event.target.value)}
                >
                  {provinces.map((thaiProvince) => (
                    <option key={thaiProvince} value={thaiProvince}>
                      {thaiProvince}
                    </option>
                  ))}
                </select>
              </label>

              <label className="space-y-2">
                <span className="px-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                  District
                </span>
                <select
                  className={textInputClass}
                  disabled={geographyLoading || districts.length === 0}
                  value={district}
                  onChange={(event) => handleDistrictChange(event.target.value)}
                >
                  {districts.map((thaiDistrict) => (
                    <option key={thaiDistrict} value={thaiDistrict}>
                      {thaiDistrict}
                    </option>
                  ))}
                </select>
              </label>

              <label className="space-y-2">
                <span className="px-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Subdistrict
                </span>
                <select
                  className={textInputClass}
                  disabled={geographyLoading || subdistricts.length === 0}
                  value={subdistrict}
                  onChange={(event) => setSubdistrict(event.target.value)}
                >
                  {subdistricts.map((thaiSubdistrict) => (
                    <option key={thaiSubdistrict} value={thaiSubdistrict}>
                      {thaiSubdistrict}
                    </option>
                  ))}
                </select>
              </label>

              <label className="space-y-2">
                <span className="px-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Keyword
                </span>
                <input
                  className={textInputClass}
                  placeholder="Name or tag, optional"
                  type="text"
                  value={keyword}
                  onChange={(event) => setKeyword(event.target.value)}
                />
              </label>

              <button
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-slate-950 px-6 text-sm font-semibold text-white shadow-lg shadow-slate-300/80 transition hover:-translate-y-0.5 hover:bg-teal-700 hover:shadow-teal-200 focus:outline-none focus:ring-4 focus:ring-teal-100 disabled:translate-y-0 disabled:cursor-not-allowed disabled:bg-slate-400 disabled:shadow-none"
                disabled={loading || geographyLoading || !province || !district || !subdistrict}
                type="submit"
              >
                <svg
                  aria-hidden="true"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="m21 21-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z" />
                </svg>
                {loading ? "Searching" : geographyLoading ? "Loading" : "Search places"}
              </button>
            </div>
          </form>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-7 sm:px-6 lg:grid-cols-[340px_1fr] lg:px-8">
        <aside className="space-y-5">
          <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/70">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Category
                </h2>
                <p className="mt-1 text-sm text-slate-500">Choose one point-of-interest group.</p>
              </div>
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500">
                POI tags
              </span>
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-1">
              {CATEGORIES.map((category) => {
                const active = category.key === categoryKey;

                return (
                  <button
                    key={category.key}
                    className={`group flex min-h-14 items-center gap-3 rounded-2xl border px-3 py-2.5 text-left text-sm font-semibold transition ${
                      active
                        ? "border-slate-900 bg-slate-950 text-white shadow-md shadow-slate-200"
                        : "border-slate-200 bg-white text-slate-700 hover:border-teal-200 hover:bg-teal-50/70 hover:text-teal-900"
                    }`}
                    type="button"
                    onClick={() => setCategoryKey(category.key)}
                  >
                    <span
                      className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ring-1 transition ${
                        active
                          ? "bg-white/10 text-white ring-white/20"
                          : `${category.tone} group-hover:bg-white`
                      }`}
                    >
                      <InfoIcon path={category.icon} />
                    </span>
                    <span className="min-w-0">{category.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-3xl border border-teal-100 bg-gradient-to-br from-teal-50 to-emerald-50 p-5 text-sm leading-6 text-teal-950 shadow-sm">
            <div className="mb-2 font-semibold">Data note</div>
            OpenStreetMap is community maintained. Names, hours, phone numbers, and
            websites can be incomplete, outdated, or missing in some districts.
          </div>
        </aside>

        <section className="space-y-5">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/70">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <h2 className="text-2xl font-semibold tracking-tight">
                  {searched ? `${places.length} result${places.length === 1 ? "" : "s"}` : "Ready to search"}
                </h2>
                <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
                  {scopeNote || "Choose a province, district, subdistrict, and category to query live map data."}
                </p>
              </div>
              <div className={`inline-flex w-fit shrink-0 items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold ring-1 ${selectedCategory.tone}`}>
                <InfoIcon path={selectedCategory.icon} />
                {selectedCategory.label}
              </div>
            </div>

            {boundaryName ? (
              <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs leading-5 text-slate-600">
                <span className="font-semibold text-slate-700">Boundary:</span> {boundaryName}
              </div>
            ) : null}
          </div>

          {error ? (
            <div className="rounded-3xl border border-red-200 bg-red-50 p-5 text-sm leading-6 text-red-800 shadow-sm">
              <div className="font-semibold">Search error</div>
              {error}
            </div>
          ) : null}

          {loading ? (
            <div className="grid gap-4">
              {[0, 1, 2].map((item) => (
                <div
                  key={item}
                  className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/70"
                >
                  <div className="animate-pulse">
                    <div className="flex items-center justify-between gap-4">
                      <div className="h-5 w-40 rounded-full bg-slate-200" />
                      <div className="h-10 w-20 rounded-xl bg-slate-100" />
                    </div>
                    <div className="mt-5 h-6 w-2/3 rounded bg-slate-200" />
                    <div className="mt-4 h-4 w-full rounded bg-slate-100" />
                    <div className="mt-2 h-4 w-1/2 rounded bg-slate-100" />
                  </div>
                </div>
              ))}
            </div>
          ) : null}

          {!loading && searched && !error && places.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm shadow-slate-200/70">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 ring-1 ring-slate-200">
                <svg
                  aria-hidden="true"
                  className="h-8 w-8"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.8"
                  viewBox="0 0 24 24"
                >
                  <path d="M4 7h16M6 7v12h12V7M9 11h6M9 15h4" />
                </svg>
              </div>
              <h3 className="mt-5 text-lg font-semibold tracking-tight">No matching places found</h3>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                Try a broader keyword, a nearby subdistrict, or another category.
              </p>
            </div>
          ) : null}

          {!searched && !loading ? (
            <div className="grid gap-4 md:grid-cols-3">
              {[
                ["1", "Pick a province", "All 77 Thai provinces are available."],
                ["2", "Pick local area", "District and subdistrict options update automatically."],
                ["3", "Query OSM", "Results come directly from Nominatim and Overpass."],
              ].map(([number, title, body]) => (
                <div
                  key={number}
                  className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/70"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-sm font-semibold text-white shadow-md shadow-slate-200">
                    {number}
                  </div>
                  <div className="mt-4 font-semibold text-slate-950">{title}</div>
                  <p className="mt-2 text-sm leading-6 text-slate-500">{body}</p>
                </div>
              ))}
            </div>
          ) : null}

          {!loading && places.length > 0 ? (
            <div className="grid gap-4">
              {places.map((place) => {
                const mapUrl = `https://www.openstreetmap.org/?mlat=${place.lat}&mlon=${place.lon}#map=18/${place.lat}/${place.lon}`;
                const contactItems = [
                  ["Phone", place.tags.phone || place.tags["contact:phone"]],
                  ["Website", place.tags.website || place.tags["contact:website"]],
                  ["Hours", place.tags.opening_hours],
                ].filter((item): item is [string, string] => Boolean(item[1]));

                return (
                  <article
                    key={place.id}
                    className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/70 transition hover:-translate-y-0.5 hover:border-teal-200 hover:shadow-lg hover:shadow-teal-100/60"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${selectedCategory.tone}`}>
                            <InfoIcon path={selectedCategory.icon} />
                            {selectedCategory.label}
                          </span>
                          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500">
                            {place.category.replace(/_/g, " ")}
                          </span>
                        </div>
                        <h3 className="mt-3 text-xl font-semibold tracking-tight text-slate-950">
                          {place.name}
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-slate-600">{place.address}</p>
                      </div>

                      <a
                        className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-teal-600 px-3 text-sm font-semibold text-white shadow-sm shadow-teal-200 transition hover:bg-teal-700 focus:outline-none focus:ring-4 focus:ring-teal-100"
                        href={mapUrl}
                        rel="noreferrer"
                        target="_blank"
                      >
                        Map
                        <ExternalIcon />
                      </a>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-600">
                      <span className="rounded-full bg-slate-100 px-3 py-1.5 font-mono ring-1 ring-slate-200">
                        {place.lat.toFixed(5)}, {place.lon.toFixed(5)}
                      </span>
                      {contactItems.map(([label, value]) => {
                        const isWebsite = label === "Website";

                        return isWebsite ? (
                          <a
                            key={label}
                            className="rounded-full bg-slate-100 px-3 py-1.5 font-medium text-teal-700 ring-1 ring-slate-200 transition hover:bg-teal-50 hover:ring-teal-200"
                            href={value.startsWith("http") ? value : `https://${value}`}
                            rel="noreferrer"
                            target="_blank"
                          >
                            {label}
                          </a>
                        ) : (
                          <span key={label} className="rounded-full bg-slate-100 px-3 py-1.5 ring-1 ring-slate-200">
                            {label}: {value}
                          </span>
                        );
                      })}
                    </div>
                  </article>
                );
              })}
            </div>
          ) : null}
        </section>
      </section>
    </main>
  );
}
