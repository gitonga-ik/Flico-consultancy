"use client";

import { useMemo, useState, useTransition } from "react";
import { getLogPage, type LogPageResult } from "@/utils/logs";

export interface LogEntry {
    level: "TRACE" | "DEBUG" | "INFO" | "WARN" | "ERROR" | "FATAL" | string;
    time: string;
    pid?: number;
    hostname?: string;
    msg: string;
    [key: string]: unknown;
}

const LEVEL_STYLES: Record<string, { bg: string; text: string; dot: string }> = {
    TRACE: { bg: "bg-slate-800", text: "text-slate-300", dot: "bg-slate-400" },
    DEBUG: { bg: "bg-cyan-950", text: "text-cyan-300", dot: "bg-cyan-400" },
    INFO: { bg: "bg-blue-950", text: "text-blue-300", dot: "bg-blue-400" },
    WARN: { bg: "bg-amber-950", text: "text-amber-300", dot: "bg-amber-400" },
    ERROR: { bg: "bg-red-950", text: "text-red-300", dot: "bg-red-400" },
    FATAL: { bg: "bg-red-900", text: "text-red-200", dot: "bg-red-500" },
};

const LEVEL_ORDER = ["TRACE", "DEBUG", "INFO", "WARN", "ERROR", "FATAL"];

function levelStyle(level: string) {
    return LEVEL_STYLES[level.toUpperCase()] ?? LEVEL_STYLES.INFO;
}

function formatTime(iso: string) {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleTimeString(undefined, { hour12: false }) + "." + d.getMilliseconds().toString().padStart(3, "0");
}

/**
 * `initialData` should come from a server-side call to `getLogPage(1)` — e.g. in the
 * Server Component page that renders this, so the first page loads with no client
 * round-trip. See actions/logs.ts for the server action, and the example page below.
 */
export default function LogViewer({ initialData }: { initialData: LogPageResult }) {
    const [data, setData] = useState<LogPageResult>(initialData);
    const [query, setQuery] = useState("");
    const [activeLevels, setActiveLevels] = useState<Set<string>>(new Set(LEVEL_ORDER));
    const [expanded, setExpanded] = useState<Set<number>>(new Set());
    const [isPending, startTransition] = useTransition();

    const entries = data.entries;

    const levelsPresent = useMemo(() => {
        const s = new Set(entries.map((e) => e.level.toUpperCase()));
        return LEVEL_ORDER.filter((l) => s.has(l)).concat(
            [...s].filter((l) => !LEVEL_ORDER.includes(l))
        );
    }, [entries]);

    // Filtering (search + level toggles) applies within the currently loaded page.
    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        return entries.filter((e) => {
            if (!activeLevels.has(e.level.toUpperCase())) return false;
            if (!q) return true;
            return (
                e.msg?.toLowerCase().includes(q) ||
                e.hostname?.toString().toLowerCase().includes(q) ||
                JSON.stringify(e).toLowerCase().includes(q)
            );
        });
    }, [entries, query, activeLevels]);

    function toggleLevel(level: string) {
        setActiveLevels((prev) => {
            const next = new Set(prev);
            if (next.has(level)) next.delete(level);
            else next.add(level);
            return next;
        });
    }

    function toggleExpanded(idx: number) {
        setExpanded((prev) => {
            const next = new Set(prev);
            if (next.has(idx)) next.delete(idx);
            else next.add(idx);
            return next;
        });
    }

    function goToPage(page: number) {
        startTransition(async () => {
            const next = await getLogPage(page, data.pageSize);
            setData(next);
            setExpanded(new Set());
        });
    }

    return (
        <div className="flex flex-col h-full rounded-lg border border-slate-800 bg-slate-950 text-slate-100 font-mono text-sm overflow-hidden">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 bg-slate-900 px-3 py-2">
                <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Filter this page…"
                    className="flex-1 min-w-40 rounded border border-slate-700 bg-slate-950 px-2 py-1 text-slate-100 placeholder-slate-500 outline-none focus:border-slate-500"
                />
                <div className="flex flex-wrap gap-1">
                    {levelsPresent.map((level) => {
                        const active = activeLevels.has(level);
                        const style = levelStyle(level);
                        return (
                            <button
                                key={level}
                                onClick={() => toggleLevel(level)}
                                className={`flex items-center gap-1 rounded px-2 py-1 text-xs font-semibold uppercase tracking-wide transition-opacity ${
                                    active ? style.bg + " " + style.text : "bg-slate-900 text-slate-500"
                                } ${active ? "opacity-100" : "opacity-50"}`}
                            >
                                <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
                                {level}
                            </button>
                        );
                    })}
                </div>
                <span className="text-xs text-slate-500">
          {filtered.length}/{entries.length} on this page
        </span>
            </div>

            {/* Log list */}
            <div className="flex-1 overflow-y-auto relative">
                {isPending && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-950/60 text-slate-400">
                        Loading…
                    </div>
                )}
                {filtered.length === 0 && (
                    <div className="p-4 text-slate-500">No log entries match the current filters.</div>
                )}
                {filtered.map((entry, idx) => {
                    const style = levelStyle(entry.level);
                    const isOpen = expanded.has(idx);
                    const { level, time, msg, pid, hostname, ...rest } = entry;
                    const hasExtra = Object.keys(rest).length > 0;

                    return (
                        <div key={idx} className="border-b border-slate-900/80">
                            <button
                                onClick={() => toggleExpanded(idx)}
                                className="flex w-full items-start gap-2 px-3 py-1.5 text-left hover:bg-slate-900/60"
                            >
                                <span className="shrink-0 text-slate-500">{formatTime(time)}</span>
                                <span
                                    className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${style.bg} ${style.text}`}
                                >
                  {level}
                </span>
                                {hostname && <span className="shrink-0 text-slate-600">{hostname}</span>}
                                <span className="flex-1 truncate text-slate-200">{msg}</span>
                                {hasExtra && (
                                    <span className="shrink-0 text-slate-600">{isOpen ? "▲" : "▼"}</span>
                                )}
                            </button>
                            {isOpen && (
                                <pre className="mx-3 mb-2 overflow-x-auto rounded bg-slate-900 p-2 text-xs text-slate-300">
                  {JSON.stringify({ pid, hostname, msg,...rest }, null, 2)}
                </pre>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between border-t border-slate-800 bg-slate-900 px-3 py-2 text-xs text-slate-400">
        <span>
          {data.totalEntries === 0
              ? "No entries"
              : `Page ${data.page} of ${data.totalPages} · ${data.totalEntries} total entries`}
        </span>
                <div className="flex gap-1">
                    <button
                        onClick={() => goToPage(1)}
                        disabled={data.page <= 1 || isPending}
                        className="rounded border border-slate-700 px-2 py-1 hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent"
                    >
                        « First
                    </button>
                    <button
                        onClick={() => goToPage(data.page - 1)}
                        disabled={data.page <= 1 || isPending}
                        className="rounded border border-slate-700 px-2 py-1 hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent"
                    >
                        ‹ Prev
                    </button>
                    <button
                        onClick={() => goToPage(data.page + 1)}
                        disabled={data.page >= data.totalPages || isPending}
                        className="rounded border border-slate-700 px-2 py-1 hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent"
                    >
                        Next ›
                    </button>
                    <button
                        onClick={() => goToPage(data.totalPages)}
                        disabled={data.page >= data.totalPages || isPending}
                        className="rounded border border-slate-700 px-2 py-1 hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent"
                    >
                        Last »
                    </button>
                </div>
            </div>
        </div>
    );
}