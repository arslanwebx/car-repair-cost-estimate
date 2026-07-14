import { NextRequest, NextResponse } from "next/server";

const base = "https://vpic.nhtsa.dot.gov/api/vehicles";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export async function GET(request: NextRequest) {
  const action = request.nextUrl.searchParams.get("action") ?? "makes";
  try {
    let url: string;
    if (action === "models") {
      const make = request.nextUrl.searchParams.get("make")?.trim();
      const year = request.nextUrl.searchParams.get("year");
      if (!make || !/^\d{4}$/.test(year ?? "")) {
        return NextResponse.json({ error: "Make and model year are required." }, { status: 400 });
      }
      url = `${base}/GetModelsForMakeYear/make/${encodeURIComponent(make)}/modelyear/${year}?format=json`;
    } else if (action === "vin") {
      const vin = request.nextUrl.searchParams.get("vin")?.trim().toUpperCase();
      if (!vin || !/^[A-HJ-NPR-Z0-9]{17}$/.test(vin)) {
        return NextResponse.json({ error: "Enter a valid 17-character VIN." }, { status: 400 });
      }
      url = `${base}/DecodeVinValuesExtended/${vin}?format=json`;
    } else {
      url = `${base}/GetMakesForVehicleType/car?format=json`;
    }

    const response = await fetch(url, {
      signal: AbortSignal.any([request.signal, AbortSignal.timeout(8_000)]),
      next: { revalidate: action === "makes" ? 86400 : 3600 },
    });
    if (!response.ok) throw new Error("NHTSA request failed");

    const data: unknown = await response.json();
    if (!isRecord(data) || !Array.isArray(data.Results)) throw new Error("NHTSA returned invalid data");
    const results = data.Results;
    if (action === "vin") return NextResponse.json({ vehicle: results[0] ?? null });

    const field = action === "models" ? "Model_Name" : "MakeName";
    const values = results.flatMap(item => {
      if (!isRecord(item)) return [];
      const value = item[field];
      return typeof value === "string" && value.trim() ? [value] : [];
    });
    return NextResponse.json({ values: [...new Set(values)].sort() });
  } catch {
    return NextResponse.json({ error: "Vehicle lookup is unavailable. Continue with manual entry." }, { status: 503 });
  }
}
