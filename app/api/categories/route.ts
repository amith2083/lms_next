

import { CategoryRepository } from '@/app/respositories/CategoryRepository';
import { CategoryService } from '@/service/CategoryService';
import { NextRequest, NextResponse } from 'next/server';
const categoryRepository = new CategoryRepository();
const categoryService = new CategoryService(categoryRepository);

export async function GET() {
  try {
    const categories = await categoryService.getCategories();
    return NextResponse.json(categories);
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('catbosy',body)
    const category = await categoryService.createCategory (body);
    return NextResponse.json(category);
  } catch (e) {
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}
