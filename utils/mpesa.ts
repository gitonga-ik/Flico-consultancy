"use server";

import dotenv from "dotenv";
import rclient from "@/utils/redis";
import {
  TransactionInitiationInfo,
  TransactionRequestInfo,
  TransactionResponseInfo,
  CallbackMetadata,
} from "./interfaces";
import { prisma } from "@/prisma/prisma";
import { MpesaTransactionStatus } from "@/generated/prisma/client";

dotenv.config();

const consumerKey = process.env.DARAJA_CONSUMER_KEY;
const consumerSecret = process.env.DARAJA_CONSUMER_SECRET;
const baseUrl =
  process.env.DARAJA_BASE_URL || "https://sandbox.safaricom.co.ke";

export async function getAccessToken() {
  try {
    const token = await rclient.get("token");

    if (!token) {
      const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString(
        "base64",
      );
      const response = await fetch(
        `${baseUrl}/oauth/v1/generate?grant_type=client_credentials`,
        {
          method: "GET",
          headers: { Authorization: `Basic ${auth}` },
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Auth failed: ${errorText}`);
      }

      const data = await response.json();
      await rclient.set("token", data.access_token, { ex: 3540 });
      return data.access_token;
    }

    return token;
  } catch (error) {
    console.log(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        level: "error",
        message: `Could not get M-Pesa authorization token.`,
      }),
    );
    return false;
  }
}

export async function recordTransaction(
  transactionInfo: TransactionRequestInfo,
  id: string,
) {
  try {
    const transaction = await prisma.mpesaTransaction.create({
      data: {
        ORDER_ID: id,
        CONTACT: transactionInfo.PhoneNumber,
        AMOUNT: transactionInfo.Amount,
        TRANSACTION_DESCRIPTION: transactionInfo.TransactionDesc,
      },
    });
    return transaction.ID;
  } catch (error) {
    console.log(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        level: "error",
        message: `Could not create transaction record: ${error}`,
      }),
    );
    return false;
  }
}

export async function recordMerchant(
  transactionId: string,
  response: TransactionInitiationInfo,
) {
  try {
    await prisma.mpesaTransaction.update({
      where: {
        ID: transactionId,
      },
      data: {
        MERCHANT_REQUEST_ID: response.MerchantRequestID,
        CHECKOUT_REQUEST_ID: response.CheckoutRequestID,
      },
    });
    return true;
  } catch (error) {
    console.log(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        level: "error",
        message: `Could not update transaction record: ${error}`,
      }),
    );
    return false;
  }
}

const STATUS_MAP: Record<number, MpesaTransactionStatus> = {
  0: MpesaTransactionStatus.COMPLETED,
  1032: MpesaTransactionStatus.CANCELLED,
  1037: MpesaTransactionStatus.TIMEOUT,
};

export async function handleResponse(
  transactionId: string,
  response: TransactionResponseInfo,
) {
  try {
    const status = STATUS_MAP[response.ResultCode] ?? "FAILED";

    if (response.ResultCode !== 0) {
      await prisma.mpesaTransaction.update({
        where: {
          ID: transactionId,
        },
        data: {
          STATUS: status,
          RESULT_CODE: response.ResultCode,
          RESULT_DESCRIPTION: response.ResultDesc,
        },
      });

      return true;
    }
    const meta = parseCallbackMetadata(response.CallbackMetadata);

    const transaction = await prisma.mpesaTransaction.update({
      where: {
        ID: transactionId,
      },
      data: {
        STATUS: status,
        RESULT_CODE: response.ResultCode,
        RESULT_DESCRIPTION: response.ResultDesc,
        MPESA_RECEIPT_NUMBER: meta.mpesaReceiptNumber,
        TRANSACTION_DATE: parseMpesaDate(meta.transactionDate!),
        order: {
          update: {
            PAYMENT: true,
          },
        },
      },
    });
    console.log(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        level: "info",
        message: `Payment made for order with ID:${transaction.ORDER_ID}`,
      }),
    );
  } catch (error) {
    console.log(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        level: "error",
        message: `Could not update transaction record: ${error}`,
      }),
    );
    return false;
  }
}

export async function getTransactionStatus(transactionId: string) {
  try {
    const transaction = await prisma.mpesaTransaction.findUniqueOrThrow({
      where: {
        ID: transactionId,
      },
      select: {
        STATUS: true,
      },
    });

    return transaction.STATUS;
  } catch (error) {
    console.log(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        level: "error",
        message: `Could not update transaction record: ${error}`,
      }),
    );
    return false;
  }
}

function parseCallbackMetadata(metadata?: CallbackMetadata) {
  if (!metadata?.Item) return {};

  const items = metadata.Item;

  const getValue = (name: string): string | number | undefined => {
    return items.find((item) => item.Name === name)?.Value;
  };

  return {
    amount: getValue("Amount") as number | undefined,
    mpesaReceiptNumber: getValue("MpesaReceiptNumber") as string | undefined,
    transactionDate: getValue("TransactionDate") as string | undefined,
    phoneNumber: getValue("PhoneNumber") as number | undefined,
  };
}

function parseMpesaDate(dateVal: number | string): Date {
  const str = String(dateVal);

  const year = str.slice(0, 4);
  const month = str.slice(4, 6);
  const day = str.slice(6, 8);
  const hours = str.slice(8, 10);
  const minutes = str.slice(10, 12);
  const seconds = str.slice(12, 14);

  return new Date(
    `${year}-${month}-${day}T${hours}:${minutes}:${seconds}+03:00`,
  );
}
