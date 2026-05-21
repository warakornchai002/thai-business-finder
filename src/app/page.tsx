"use client";

import { FormEvent, useMemo, useState } from "react";

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
  scope: "district" | "province";
  boundaryName: string;
  categoryLabel: string;
  count: number;
  places: Place[];
  error?: string;
};

const THAI_PROVINCES = [
  "กรุงเทพมหานคร",
  "กระบี่",
  "กาญจนบุรี",
  "กาฬสินธุ์",
  "กำแพงเพชร",
  "ขอนแก่น",
  "จันทบุรี",
  "ฉะเชิงเทรา",
  "ชลบุรี",
  "ชัยนาท",
  "ชัยภูมิ",
  "ชุมพร",
  "เชียงราย",
  "เชียงใหม่",
  "ตรัง",
  "ตราด",
  "ตาก",
  "นครนายก",
  "นครปฐม",
  "นครพนม",
  "นครราชสีมา",
  "นครศรีธรรมราช",
  "นครสวรรค์",
  "นนทบุรี",
  "นราธิวาส",
  "น่าน",
  "บึงกาฬ",
  "บุรีรัมย์",
  "ปทุมธานี",
  "ประจวบคีรีขันธ์",
  "ปราจีนบุรี",
  "ปัตตานี",
  "พระนครศรีอยุธยา",
  "พะเยา",
  "พังงา",
  "พัทลุง",
  "พิจิตร",
  "พิษณุโลก",
  "เพชรบุรี",
  "เพชรบูรณ์",
  "แพร่",
  "ภูเก็ต",
  "มหาสารคาม",
  "มุกดาหาร",
  "แม่ฮ่องสอน",
  "ยโสธร",
  "ยะลา",
  "ร้อยเอ็ด",
  "ระนอง",
  "ระยอง",
  "ราชบุรี",
  "ลพบุรี",
  "ลำปาง",
  "ลำพูน",
  "เลย",
  "ศรีสะเกษ",
  "สกลนคร",
  "สงขลา",
  "สตูล",
  "สมุทรปราการ",
  "สมุทรสงคราม",
  "สมุทรสาคร",
  "สระแก้ว",
  "สระบุรี",
  "สิงห์บุรี",
  "สุโขทัย",
  "สุพรรณบุรี",
  "สุราษฎร์ธานี",
  "สุรินทร์",
  "หนองคาย",
  "หนองบัวลำภู",
  "อ่างทอง",
  "อำนาจเจริญ",
  "อุดรธานี",
  "อุตรดิตถ์",
  "อุทัยธานี",
  "อุบลราชธานี",
] as const;

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
  "h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-950 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-100";

const getCategory = (key: CategoryKey) =>
  CATEGORIES.find((category) => category.key === key) ?? CATEGORIES[0];

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
  const [province, setProvince] = useState<string>("เชียงใหม่");
  const [district, setDistrict] = useState<string>("เมืองเชียงใหม่");
  const [keyword, setKeyword] = useState<string>("");
  const [categoryKey, setCategoryKey] = useState<CategoryKey>(DEFAULT_CATEGORY);
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);
  const [scopeNote, setScopeNote] = useState("");
  const [boundaryName, setBoundaryName] = useState("");

  const selectedCategory = useMemo(() => getCategory(categoryKey), [categoryKey]);

  const handleSearch = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
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
          district: district.trim(),
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
        searchData.scope === "province" && district.trim()
          ? `District lookup for "${district.trim()}" did not return a boundary, so this searched all of ${province}.`
          : `Searched within ${searchData.scope === "district" ? district.trim() : province}.`,
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
    <main className="min-h-screen bg-[#f7fbf8] text-slate-950">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_400px] lg:items-end">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-teal-700 ring-1 ring-teal-100">
                OpenStreetMap Business Finder
              </div>
              <div className="max-w-3xl space-y-4">
                <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                  Find Thai places by province, district, and category.
                </h1>
                <p className="text-base leading-7 text-slate-600 sm:text-lg">
                  Search restaurants, services, lodging, health care, retail, and everyday
                  essentials using public OpenStreetMap data.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-2xl bg-slate-950 p-4 text-white shadow-lg shadow-slate-200">
                <div className="text-2xl font-semibold">77</div>
                <div className="mt-1 text-xs text-slate-300">Thai provinces</div>
              </div>
              <div className="rounded-2xl bg-teal-600 p-4 text-white shadow-lg shadow-teal-100">
                <div className="text-2xl font-semibold">{CATEGORIES.length}</div>
                <div className="mt-1 text-xs text-teal-50">Categories</div>
              </div>
              <div className="rounded-2xl bg-white p-4 text-slate-950 shadow-lg shadow-slate-200 ring-1 ring-slate-200">
                <div className="text-2xl font-semibold">{places.length}</div>
                <div className="mt-1 text-xs text-slate-500">Results now</div>
              </div>
            </div>
          </div>

          <form
            onSubmit={handleSearch}
            className="grid gap-3 rounded-[2rem] border border-slate-200 bg-slate-50 p-3 shadow-xl shadow-slate-200/70 md:grid-cols-2 lg:grid-cols-[1.1fr_1fr_1fr_auto]"
          >
            <label className="space-y-2">
              <span className="px-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                Province
              </span>
              <select
                className={textInputClass}
                value={province}
                onChange={(event) => setProvince(event.target.value)}
              >
                {THAI_PROVINCES.map((thaiProvince) => (
                  <option key={thaiProvince} value={thaiProvince}>
                    {thaiProvince}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2">
              <span className="px-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                District
              </span>
              <input
                className={textInputClass}
                placeholder="เช่น เมืองเชียงใหม่"
                type="text"
                value={district}
                onChange={(event) => setDistrict(event.target.value)}
              />
            </label>

            <label className="space-y-2">
              <span className="px-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                Keyword
              </span>
              <input
                className={textInputClass}
                placeholder="optional name or tag"
                type="text"
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
              />
            </label>

            <button
              className="mt-5 inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-6 text-sm font-semibold text-white shadow-lg shadow-slate-300 transition hover:bg-teal-700 focus:outline-none focus:ring-4 focus:ring-teal-100 disabled:cursor-not-allowed disabled:bg-slate-400 lg:mt-8"
              disabled={loading}
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
              {loading ? "Searching" : "Search"}
            </button>
          </form>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[320px_1fr] lg:px-8">
        <aside className="space-y-5">
          <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
                Category
              </h2>
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-500">
                POI tags
              </span>
            </div>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
              {CATEGORIES.map((category) => {
                const active = category.key === categoryKey;

                return (
                  <button
                    key={category.key}
                    className={`flex min-h-12 items-center gap-3 rounded-2xl px-3 py-2 text-left text-sm font-medium transition ${
                      active
                        ? "bg-slate-950 text-white shadow-md"
                        : "bg-slate-50 text-slate-700 hover:bg-teal-50 hover:text-teal-800"
                    }`}
                    type="button"
                    onClick={() => setCategoryKey(category.key)}
                  >
                    <span
                      className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ring-1 ${
                        active ? "bg-white/10 ring-white/20" : category.tone
                      }`}
                    >
                      <InfoIcon path={category.icon} />
                    </span>
                    <span>{category.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-3xl border border-teal-100 bg-teal-50 p-5 text-sm leading-6 text-teal-900">
            <div className="mb-2 font-semibold">Data note</div>
            OpenStreetMap is community maintained. Names, hours, phone numbers, and
            websites can be incomplete, outdated, or missing in some districts.
          </div>
        </aside>

        <section className="space-y-5">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight">
                  {searched ? `${places.length} result${places.length === 1 ? "" : "s"}` : "Ready to search"}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {scopeNote || "Choose a province, district, and category to query live map data."}
                </p>
              </div>
              <div className={`inline-flex w-fit items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold ring-1 ${selectedCategory.tone}`}>
                <InfoIcon path={selectedCategory.icon} />
                {selectedCategory.label}
              </div>
            </div>

            {boundaryName ? (
              <div className="mt-4 rounded-2xl bg-slate-50 p-3 text-xs leading-5 text-slate-500">
                Boundary: {boundaryName}
              </div>
            ) : null}
          </div>

          {error ? (
            <div className="rounded-3xl border border-red-200 bg-red-50 p-5 text-sm leading-6 text-red-800">
              <div className="font-semibold">Search error</div>
              {error}
            </div>
          ) : null}

          {loading ? (
            <div className="grid gap-4">
              {[0, 1, 2].map((item) => (
                <div
                  key={item}
                  className="animate-pulse rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="h-5 w-2/3 rounded bg-slate-200" />
                  <div className="mt-4 h-4 w-full rounded bg-slate-100" />
                  <div className="mt-2 h-4 w-1/2 rounded bg-slate-100" />
                </div>
              ))}
            </div>
          ) : null}

          {!loading && searched && !error && places.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                <svg
                  aria-hidden="true"
                  className="h-7 w-7"
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
              <h3 className="mt-4 text-lg font-semibold">No matching places found</h3>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                Try a broader keyword, another nearby district spelling, or search at the
                province level by leaving the district field empty.
              </p>
            </div>
          ) : null}

          {!searched && !loading ? (
            <div className="grid gap-4 md:grid-cols-3">
              {[
                ["1", "Pick a province", "All 77 Thai provinces are available."],
                ["2", "Add a district", "Thai or English district names can work."],
                ["3", "Query OSM", "Results come directly from Nominatim and Overpass."],
              ].map(([number, title, body]) => (
                <div
                  key={number}
                  className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-sm font-semibold text-white">
                    {number}
                  </div>
                  <div className="mt-4 font-semibold">{title}</div>
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
                    className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-teal-200 hover:shadow-md"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${selectedCategory.tone}`}>
                            {selectedCategory.label}
                          </span>
                          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-500">
                            {place.category.replace(/_/g, " ")}
                          </span>
                        </div>
                        <h3 className="mt-3 text-xl font-semibold tracking-tight text-slate-950">
                          {place.name}
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-slate-600">{place.address}</p>
                      </div>

                      <a
                        className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-teal-600 px-3 text-sm font-semibold text-white transition hover:bg-teal-700"
                        href={mapUrl}
                        rel="noreferrer"
                        target="_blank"
                      >
                        Map
                        <ExternalIcon />
                      </a>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-600">
                      <span className="rounded-full bg-slate-100 px-3 py-1.5 font-mono">
                        {place.lat.toFixed(5)}, {place.lon.toFixed(5)}
                      </span>
                      {contactItems.map(([label, value]) => {
                        const isWebsite = label === "Website";

                        return isWebsite ? (
                          <a
                            key={label}
                            className="rounded-full bg-slate-100 px-3 py-1.5 text-teal-700 hover:bg-teal-50"
                            href={value.startsWith("http") ? value : `https://${value}`}
                            rel="noreferrer"
                            target="_blank"
                          >
                            {label}
                          </a>
                        ) : (
                          <span key={label} className="rounded-full bg-slate-100 px-3 py-1.5">
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
