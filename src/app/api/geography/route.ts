import { GEOGRAPHY } from "@/data/geography";

const findProvince = (provinceName: string) =>
  GEOGRAPHY.find((province) => province.name === provinceName);

const findDistrict = (provinceName: string, districtName: string) =>
  findProvince(provinceName)?.districts.find((district) => district.name === districtName);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const provinceName = searchParams.get("province")?.trim() ?? "";
  const districtName = searchParams.get("district")?.trim() ?? "";

  if (!provinceName) {
    return Response.json({
      provinces: GEOGRAPHY.map((province) => province.name),
    });
  }

  const province = findProvince(provinceName);

  if (!province) {
    return Response.json({ error: "Province was not found." }, { status: 404 });
  }

  if (!districtName) {
    return Response.json({
      province: province.name,
      districts: province.districts.map((district) => district.name),
    });
  }

  const district = findDistrict(provinceName, districtName);

  if (!district) {
    return Response.json({ error: "District was not found." }, { status: 404 });
  }

  return Response.json({
    province: province.name,
    district: district.name,
    subdistricts: district.subdistricts,
  });
}
