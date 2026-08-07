"use client"

import React, {useState} from "react";
import {CheckoutSteps, Step} from "@/app/components/CheckoutSteps";
import ConfirmOrderStep from "@/app/components/ConfirmOrder";
import PaymentStep from "@/app/components/Payment";
import SuccessStep from "@/app/components/PaymentSuccess";
import {useRouter} from "next/navigation";
import {OrderDetails} from "@/utils/interfaces";

interface OrderManagerProps{
    orderDetails: OrderDetails
}

const OrderManager = ({orderDetails} : OrderManagerProps) => {
    const [step, setStep] = useState<Step>("confirm");
    const router = useRouter();

    return (
        <>
            <CheckoutSteps step={step}/>

            <div className="mt-10">
                {step === "confirm" && (
                    <ConfirmOrderStep
                        order={orderDetails}
                        onEdit={() => router.push("/books")}
                        onConfirm={() => setStep("payment")}
                    />
                )}

                {step === "payment" && (
                    <PaymentStep onSuccess={() => setStep("success")}/>
                )}

                {step === "success" && <SuccessStep order={orderDetails}/>}
            </div>
        </>
    );
};

export default OrderManager;