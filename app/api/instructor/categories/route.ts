
import { NextResponse } from "next/server";
import { GetAllCategories } from "@/queries/categories";

export async function GET() {
  try {
    const categories = await GetAllCategories();
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json({ message: "Failed to fetch categories" }, { status: 500 });
  }
}
