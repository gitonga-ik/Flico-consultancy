import React from "react";
import {OrderDetails} from "@/utils/interfaces";

interface ConfirmOrderStepProps {
    order: OrderDetails;
    onEdit: () => void;
    onConfirm: () => void;
}

export default function ConfirmOrderStep({order, onEdit, onConfirm,}: ConfirmOrderStepProps) {
    return (
        <div className="card bg-base-100 border border-base-300 shadow-sm">
            <div className="card-body gap-6">
                <h2 className="card-title text-xl">Confirm your order</h2>

                <dl className="flex flex-col gap-4">
                    <OrderDetail label="Book" value={order.book.title}/>
                    <OrderDetail label="Price" value={(order.book.price).toString()}/>
                    <OrderDetail label="Order email" value={order.email}/>
                </dl>

                <div className="card-actions mt-2 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                    <button type="button" className="btn btn-ghost" onClick={onEdit}>
                        Edit order
                    </button>
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={onConfirm}
                    >
                        Confirm order
                    </button>
                </div>
            </div>
        </div>
    );
}

function OrderDetail({label, value}: { label: string; value: string }) {
    return (
        <div className="flex items-center justify-between gap-4">
            <dt className="text-sm text-base-content/50">{label}</dt>
            <dd className="text-sm text-base-content/50">{value}</dd>
        </div>
    );
}