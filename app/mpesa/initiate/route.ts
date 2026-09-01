import { NextResponse } from "next/server";
import {
  getAccessToken,
  recordTransaction,
  recordMerchant,
} from "@/utils/mpesa";
import dotenv from "dotenv";
import rclient from "@/utils/redis";
import {
  TransactionRequestInfo,
  TransactionInitiationInfo,
} from "@/utils/interfaces";

dotenv.config();

const baseUrl =
  process.env.DARAJA_BASE_URL || "https://sandbox.safaricom.co.ke";
const callbackUrl = process.env.DARAJA_CALLBACK_URL;

const EXPIRATION_TIME = 600;

export async function POST(request: Request) {
  try {
    const { phone, id, amount } = await request.json();

    if (!phone) {
      return NextResponse.json(
        { message: "Phone number is required" },
        { status: 400 },
      );
    }

    const cleanPhone = phone.replace(/[^0-9]/g, "");
    const token = await getAccessToken();

    if (!token) {
      return NextResponse.json(
        { message: "Unable to intiate M-Pesa transcation. Please try again." },
        { status: 500 },
      );
    }

    const shortcode = "174379";
    const passkey =
      "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919";

    const date = new Date();
    const timestamp =
      date.getFullYear().toString() +
      String(date.getMonth() + 1).padStart(2, "0") +
      String(date.getDate()).padStart(2, "0") +
      String(date.getHours()).padStart(2, "0") +
      String(date.getMinutes()).padStart(2, "0") +
      String(date.getSeconds()).padStart(2, "0");

    const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString(
      "base64",
    );

    const payload: TransactionRequestInfo = {
      BusinessShortCode: shortcode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: 1,
      PartyA: cleanPhone,
      PartyB: shortcode,
      PhoneNumber: cleanPhone,
      CallBackURL: callbackUrl,
      // TODO: change transaction test details
      AccountReference: "SandboxTest",
      TransactionDesc: "Test payment",
    };

    const transactionId = await recordTransaction(payload, id);

    if (!transactionId) {
      return NextResponse.json(
        { message: "Unable to intiate M-Pesa transcation. Please try again." },
        { status: 500 },
      );
    }

    const response = await fetch(`${baseUrl}/mpesa/stkpush/v1/processrequest`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data: TransactionInitiationInfo = await response.json();
    console.log(data)

    if (data.ResponseCode === '0') {
      if (!(await recordMerchant(transactionId, data))) {
        return NextResponse.json(
          {
            message: "Unable to record M-Pesa transcation. Please try again.",
          },
          { status: 500 },
        );
      }
      rclient.set(data.CheckoutRequestID, transactionId, {
        EX: EXPIRATION_TIME,
      });

      return NextResponse.json(
        {
          message: "Payment initiated. Check your phone for a payment prompt.",
          transactionId: transactionId
        },
        { status: 200 },
      );
    }
    return NextResponse.json(
      {
        message:
          data.CustomerMessage ||
          "Failed to initiate payment. Please try again",
      },
      { status: 500 },
    );
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
