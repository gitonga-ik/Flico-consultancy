import { getDownloadLink } from "@/utils/actions";
import { NextRequest, NextResponse } from "next/server";

interface PathParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: PathParams) {
  try {
    const { id } = await params;

    const order = await getDownloadLink(id);
    if (!order) {
      console.log(
        JSON.stringify({
          timestamp: new Date().toISOString(),
          level: "error",
          message: `No order found matching id: ${id}`,
        }),
      );
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    const response = await fetch(order.link);

    if (!response.ok) {
      console.log(
        JSON.stringify({
          timestamp: new Date().toISOString(),
          level: "error",
          message: `Failed to fetch PDF for order ${id}`,
        }),
      );

      return NextResponse.json(
        { message: "Unable to retrieve the order document" },
        { status: 502 },
      );
    }

    const blob = await response.blob();
    const filename = `${order.slug}.pdf`;

    return new NextResponse(blob, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.log(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        level: "error",
        message: `Download error: ${error}`,
      }),
    );
    return NextResponse.json(
      { message: `Internal server error` },
      { status: 500 },
    );
  }
}
