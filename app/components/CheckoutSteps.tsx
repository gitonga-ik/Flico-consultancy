import React from "react";

export type Step = "confirm" | "payment" | "success";

export function CheckoutSteps({ step }: { step: Step }) {
    const order: Step[] = ["confirm", "payment", "success"];
    const currentIndex = order.indexOf(step);

    const labels: Record<Step, string> = {
        confirm: "Confirm order",
        payment: "Payment",
        success: "Success",
    };

    return (
        <ul className="steps w-full">
            {order.map((s, i) => (
                <li
                    key={s}
                    className={`step ${i <= currentIndex ? "step-primary" : ""}`}
                >
                    {labels[s]}
                </li>
            ))}
        </ul>
    );
}