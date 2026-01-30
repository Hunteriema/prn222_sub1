import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/products/:id – Get a single product
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json(product);
  } catch (error) {
    console.error("GET /api/products/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

// PUT /api/products/:id – Update a product
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, description, price, image } = body;

    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const updates: { name?: string; description?: string; price?: number; image?: string | null } = {};
    if (name !== undefined) {
      if (typeof name !== "string" || name.trim() === "") {
        return NextResponse.json(
          { error: "name must be a non-empty string" },
          { status: 400 }
        );
      }
      updates.name = name.trim();
    }
    if (description !== undefined) {
      if (typeof description !== "string" || description.trim() === "") {
        return NextResponse.json(
          { error: "description must be a non-empty string" },
          { status: 400 }
        );
      }
      updates.description = description.trim();
    }
    if (price !== undefined) {
      const priceNum = typeof price === "string" ? parseFloat(price) : Number(price);
      if (Number.isNaN(priceNum) || priceNum < 0) {
        return NextResponse.json(
          { error: "price must be a non-negative number" },
          { status: 400 }
        );
      }
      updates.price = priceNum;
    }
    if (image !== undefined) {
      updates.image = image && typeof image === "string" ? image.trim() || null : null;
    }

    const product = await prisma.product.update({
      where: { id },
      data: updates,
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("PUT /api/products/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

// DELETE /api/products/:id – Delete a product
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/products/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
