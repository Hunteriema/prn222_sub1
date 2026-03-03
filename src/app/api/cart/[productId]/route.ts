import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

// PATCH /api/cart/:productId - update quantity
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  const user = await getCurrentUser(request);
  if (!user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  const { productId } = await params;
  const { quantity } = await request.json();

  const qtyNum = Number(quantity);
  if (!Number.isInteger(qtyNum) || qtyNum < 0) {
    return NextResponse.json(
      { error: "quantity must be a non-negative integer" },
      { status: 400 }
    );
  }

  const existing = await prisma.cartItem.findUnique({
    where: { userId_productId: { userId: user.id, productId } },
  });
  if (!existing) {
    return NextResponse.json({ error: "Cart item not found" }, { status: 404 });
  }

  if (qtyNum === 0) {
    await prisma.cartItem.delete({
      where: { userId_productId: { userId: user.id, productId } },
    });
    return NextResponse.json({ success: true });
  }

  const updated = await prisma.cartItem.update({
    where: { userId_productId: { userId: user.id, productId } },
    data: { quantity: qtyNum },
  });

  return NextResponse.json(updated);
}

// DELETE /api/cart/:productId - remove item
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  const user = await getCurrentUser(request);
  if (!user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  const { productId } = await params;

  await prisma.cartItem.deleteMany({
    where: { userId: user.id, productId },
  });

  return NextResponse.json({ success: true });
}

