import {CheckCircle2} from "lucide-react";
import {OrderDetails} from "@/utils/interfaces";

interface OrderSuccessProps {
    order : OrderDetails
}

export default function SuccessStep({ order }: OrderSuccessProps) {
    return (
        <div className="card bg-base-100 border border-base-300 shadow-sm">
            <div className="card-body items-center gap-4 text-center">
                <CheckCircle2 className="h-12 w-12 text-success" />
                <h2 className="card-title text-xl">Order confirmed</h2>
                <p className="text-sm text-base-content/50">
                    A receipt for {order.book.title} has been sent to {order.email}.
                </p>
            </div>
        </div>
    );
}