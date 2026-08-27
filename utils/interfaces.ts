import { orders_order_status } from "@/generated/prisma/enums";
import { UUID } from "node:crypto";

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
