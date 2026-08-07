import React from "react";
import OrderManager from "@/app/components/OrderManager";
import {jwtVerify, JWTPayload} from "jose";
import {fetchOrder} from "@/utils/actions";
import {logger} from "@/utils/logger";
import OrderNotFound from "@/app/components/OrderNotFound";

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET_KEY);

interface PathParams {
    params: Promise<{ token: string }>;
}

interface OrderJWT extends JWTPayload{
    order_id: string
}

async function retrieveOrder(token: string){
    try {
        const {payload} = await jwtVerify<OrderJWT>(token, SECRET_KEY, {algorithms: ["HS256"]})
        return await fetchOrder(payload.order_id)
    }catch(error){
        logger.error(`Could not process order token: ${error}`)
        return false
    }
}

export default async function CheckoutPage({params}: PathParams) {
    const {token} = await params;
    const orderDetails = await retrieveOrder(token);

    if(!orderDetails){
        return (
            <OrderNotFound />
        )
    }

    return (
        <div className="min-h-screen bg-base-100">
            <div className="mx-auto w-full max-w-xl px-4 py-10 sm:py-16">
                <OrderManager orderDetails={orderDetails} />
            </div>
        </div>
    );
}