"use server";

import { readFile } from "fs/promises";
import path from "path";
import type { LogEntry } from "@/app/components/LogViewer";

// Point this at wherever your app actually writes logs.
// Override with an env var so dev/prod paths can differ.
const LOG_FILE_PATH = process.env.APP_LOG_PATH ?? path.join(process.cwd(), "app.log");

export interface LogPageResult {
    entries: LogEntry[];
    page: number;
    pageSize: number;
    totalEntries: number;
    totalPages: number;
}

/**
 * Reads app.log (newline-delimited JSON, one log object per line) and returns
 * a single page of entries, most recent first.
 *
 * @param page 1-indexed page number
 * @param pageSize entries per page (defaults to 100)
 */
export async function getLogPage(page: number = 1, pageSize: number = 100): Promise<LogPageResult> {
    let raw: string;
    try {
        raw = await readFile(LOG_FILE_PATH, "utf-8");
    } catch (err) {
        // File missing or unreadable — surface an empty result rather than throwing,
        // so the UI can show a clean "no logs" state instead of crashing.
        console.error(`Failed to read log file at ${LOG_FILE_PATH}:`, err);
        return { entries: [], page: 1, pageSize, totalEntries: 0, totalPages: 0 };
    }

    const lines = raw
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean);

    const parsed: LogEntry[] = lines.map((line) => {
        try {
            return JSON.parse(line) as LogEntry;
        } catch {
            // Keep malformed lines visible instead of silently dropping them.
            return {
                level: "INFO",
                time: new Date().toISOString(),
                msg: line,
            } as LogEntry;
        }
    });

    // Most recent entries first.
    parsed.reverse();

    const totalEntries = parsed.length;
    const totalPages = Math.max(1, Math.ceil(totalEntries / pageSize));
    const safePage = Math.min(Math.max(1, page), totalPages);

    const start = (safePage - 1) * pageSize;
    const entries = parsed.slice(start, start + pageSize);

    return { entries, page: safePage, pageSize, totalEntries, totalPages };
}