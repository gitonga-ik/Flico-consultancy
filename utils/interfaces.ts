import { orders_order_status } from "@/generated/prisma/enums";
import { UUID } from "node:crypto";
import { DoesZapCodeSpaceFlag } from "node:v8";

export interface BookData {
  id?: number;
  title: string;
  price: string;
  description: string;
  slug?: string;
  cover_path?: string;
  previews?: string[];
}

export interface BookInfo {
  book: {
    id?: number;
    title: string;
    description: string;
    price: string;
    cover_path?: string;
  };
}

export interface OrderDetails {
  id: string;
  email: string;
  customer_doc?: string;
  status: orders_order_status | null;
  book: {
    title: string;
    price: number;
    slug: string;
    link: string;
  };
}

export interface DownloadDetails {
  link: string;
  slug: string;
}

export interface TransactionRequestInfo {
  BusinessShortCode: string;
  Password: string;
  Timestamp: string;
  TransactionType: string;
  Amount: number;
  PartyA: string;
  PartyB: string;
  PhoneNumber: string;
  CallBackURL: string | undefined;
  AccountReference: string;
  TransactionDesc: string;
}

export interface TransactionInitiationInfo {
  MerchantRequestID: string;
  CheckoutRequestID: string;
  ResponseCode: string;
  ResponseDescription: string;
  CustomerMessage: string;
}

export interface CallbackMetadataItem {
  Name:
    | "Amount"
    | "MpesaReceiptNumber"
    | "Balance"
    | "TransactionDate"
    | "PhoneNumber"
    | string;
  Value?: string | number;
}

export interface CallbackMetadata {
  Item: CallbackMetadataItem[];
}

export interface TransactionResponseInfo {
  MerchantRequestID: string;
  CheckoutRequestID: string;
  ResultCode: number;
  ResultDesc: string;
  CallbackMetadata?: CallbackMetadata;
}
