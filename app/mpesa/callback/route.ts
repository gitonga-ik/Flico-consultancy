import { NextResponse, after } from "next/server";
import rclient from "@/utils/redis";
import { handleResponse } from "@/utils/mpesa";
import { TransactionResponseInfo } from "@/utils/interfaces";

interface RedisCallback {
  transactionId: string;
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    after(async () => {
      const callBackData: TransactionResponseInfo = data.Body?.stkCallback;
      if (!callBackData) throw new Error("No callback data received");

      if (callBackData.ResultCode === 0) {
        const transaction: RedisCallback | null = await rclient.get(
          callBackData.CheckoutRequestID,
        );

        if (!transaction?.transactionId) return;
        const marked = await handleResponse(
          transaction.transactionId,
          callBackData,
        );
        if (!marked) return;
      }
    });
    return NextResponse.json({ ResultCode: 0, ResultDesc: "Accepted" });
  } catch (error) {
    console.log(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        level: "error",
        message: `Error processing M-Pesa callback.`,
      }),
    );

    return NextResponse.json(
      { message: "Could not complete payment request." },
      { status: 500 },
    );
  }
}
