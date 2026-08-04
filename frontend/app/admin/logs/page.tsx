import LogViewer from "@/app/components/LogViewer";
import { getLogPage } from "@/utils/logs";

export const dynamic = "force-dynamic";

export default async function LogsPage() {
    const initialData = await getLogPage(1, 100);

    return (
        <main className="h-screen p-4">
            <LogViewer initialData={initialData} />
        </main>
    );
}