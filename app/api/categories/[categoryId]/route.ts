import { CategoryRepository } from "@/app/respositories/CategoryRepository";
import { CategoryService } from "@/service/CategoryService";
import { NextRequest, NextResponse } from "next/server";
// import { z } from "zod";


const categoryRepository = new CategoryRepository();
const categoryService = new CategoryService(categoryRepository);

// Validation schema for category creation/update
// const categorySchema = z.object({
//   title: z.string().min(1, "Title is required"),
//   description: z.string().min(1, "Description is required"),
//   thumbnail: z.string().url().optional(),
//   status: z.boolean().optional(),
// });

export async function GET(
  request: NextRequest,
  { params }: { params: { categoryId: string } }
) {
  try {
   
    const category = await categoryService.getCategory(params.categoryId);
    if (!category) {
      return NextResponse.json({ message: "Category not found" }, { status: 404 });
    }
    return NextResponse.json(category);
  } catch (error: any) {
    console.error("[CATEGORY_GET_ERROR]", error);
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: error.message.includes("Unauthorized") ? 403 : 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // const validatedData = categorySchema.parse(body);
    const category = await categoryService.createCategory(body);
    return NextResponse.json(category, { status: 201 });
  } catch (error: any) {
    console.error("[CATEGORY_POST_ERROR]", error);
  
    return NextResponse.json(
      { message: error.message || "Failed to create category" },
      { status: error.message.includes("Unauthorized") ? 403 : 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { categoryId: string } }
) {
  try {
    const body = await req.json();
    console.log('body',body)
    // const validatedData = categorySchema.partial().parse(body); // Allow partial updates
    const updatedCategory = await categoryService.updateCategory(params.categoryId, body);
    if (!updatedCategory) {
      return NextResponse.json({ message: "Category not found" }, { status: 404 });
    }
    return NextResponse.json(updatedCategory);
  } catch (error: any) {
    console.error("[CATEGORY_PUT_ERROR]", error);
   
    return NextResponse.json(
      { message: error.message || "Failed to update category" },
      { status: error.message.includes("Unauthorized") ? 403 : 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { categoryId: string } }
) {
  try {
    await categoryService.deleteCategory(params.categoryId);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[CATEGORY_DELETE_ERROR]", error);
    return NextResponse.json(
      { message: error.message || "Failed to delete category" },
      { status: error.message.includes("Unauthorized") ? 403 : error.message.includes("not found") ? 404 : 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { categoryId: string } }
) {
  try {
    const newState = await categoryService.changeCategoryPublishState(params.categoryId);

    return NextResponse.json({ status: newState });
  } catch (error: any) {
    console.error("[CATEGORY_PATCH_ERROR]", error);
    return NextResponse.json(
      { message: error.message || "Failed to toggle category status" },
      { status: error.message.includes("Unauthorized") ? 403 : error.message.includes("not found") ? 404 : 500 }
    );
  }
}