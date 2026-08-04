import {UUID} from "node:crypto";

export interface BookData {
    id?: number;
    title: string;
    price: string;
    description: string;
    slug?: string;
}

export interface BookInfo {
    book: {
        id?: number;
        title: string;
        description: string;
        price: string;
    }
}

export interface OrderDetails {
    id: string,
    email: string,
    book: {
        title: string,
        price: number,
        slug: string
    }
}