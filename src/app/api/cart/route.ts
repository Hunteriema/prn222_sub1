import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

// GET /api/cart - current user's cart
export async function GET(request: NextRequest) {
  const user = await getCurrentUser(request);
  if (!user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  const items = await prisma.cartItem.findMany({
    where: { userId: user.id },
    include: { product: true },
    orderBy: { createdAt: "asc" },
  });

  const mapped = items.map((item) => ({
    id: item.id,
    quantity: item.quantity,
    product: item.product,
    lineTotal: item.quantity * item.product.price,
  }));

  const total = mapped.reduce((sum, item) => sum + item.lineTotal, 0);

  return NextResponse.json({ items: mapped, total });
}

// POST /api/cart - add/update item (increments quantity by default)
export async function POST(request: NextRequest) {
  const user = await getCurrentUser(request);
  if (!user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  const { productId, quantity } = await request.json();
  if (!productId || typeof productId !== "string") {
    return NextResponse.json({ error: "productId is required" }, { status: 400 });
  }
  const qtyNum =
    typeof quantity === "number" && Number.isInteger(quantity) && quantity > 0
      ? quantity
      : 1;

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const existing = await prisma.cartItem.findUnique({
    where: { userId_productId: { userId: user.id, productId } },
  });

  const item = existing
    ? await prisma.cartItem.update({
        where: { userId_productId: { userId: user.id, productId } },
        data: { quantity: existing.quantity + qtyNum },
      })
    : await prisma.cartItem.create({
        data: {
          userId: user.id,
          productId,
          quantity: qtyNum,
        },
      });

  return NextResponse.json(item, { status: 201 });
}

