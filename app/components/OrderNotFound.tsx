import Link from "next/link";
import {AlertTriangle} from "lucide-react";

export default function OrderNotFound() {
    return (
        <div
            className="mx-auto flex max-w-md flex-col items-center gap-3 rounded-lg border border-error/30 bg-error/5 px-6 py-8 text-center mt-15">
            <AlertTriangle className="h-8 w-8 text-error"/>
            <div className="space-y-1">
                <p className="font-medium text-error">Invalid or expired link</p>
                <p className="text-sm text-base-content/50">
                    This link contains an invalid token, or we couldn&apos;t find the order it points to.
                </p>
            </div>
            <Link href="/books" className="btn btn-sm btn-outline mt-2">
                Back to catalogue
            </Link>
        </div>
    );
}