import { useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE;

export const useDataExport = () => {
    const [error, setError] = useState<string | null>(null);

    const fetchJson = async (endpoint: string) => {
        try {
            const response = await fetch(`${API_BASE_URL}/${endpoint}`);
            if (!response.ok) {
                throw new Error(`HTTP error at ${endpoint}! Status: ${response.status} ${response.statusText}`);
            }
            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                const text = await response.text();
                console.error(`Non-JSON response at ${endpoint}:`, text);
                throw new Error(`Response from ${endpoint} is not valid JSON`);
            }
            return await response.json();
        } catch (err: unknown) {
            throw new Error(`Failed to fetch ${endpoint}: ${err instanceof Error ? err.message : String(err)}`);
        }
    };

    const exportToExcel = async () => {
        setError(null);
        if (!API_BASE_URL) {
            setError("Configuration error: API base URL is not set.");
            return;
        }

        try {
            const [users, orders, products] = await Promise.all([
                fetchJson("users"),
                fetchJson("orders"),
                fetchJson("products"),
            ]);

            const usersSheet = XLSX.utils.json_to_sheet(users || []);
            const ordersSheet = XLSX.utils.json_to_sheet(orders || []);
            const productsSheet = XLSX.utils.json_to_sheet(products || []);

            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, usersSheet, "Users");
            XLSX.utils.book_append_sheet(workbook, ordersSheet, "Orders");
            XLSX.utils.book_append_sheet(workbook, productsSheet, "Products");

            const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
            const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
            saveAs(blob, "dashboard_data.xlsx");
        } catch (err: unknown) {
            console.error("Error exporting to Excel:", err);
            setError(`Failed to export to Excel: ${err instanceof Error ? err.message : String(err)}`);
        }
    };

    const exportToCSV = async () => {
        setError(null);
        if (!API_BASE_URL) {
            setError("Configuration error: API base URL is not set.");
            return;
        }

        try {
            const [users, orders, products] = await Promise.all([
                fetchJson("users"),
                fetchJson("orders"),
                fetchJson("products"),
            ]);

            const jsonToCSV = (json: unknown[]) => {
                if (!json || json.length === 0) return "";
                const headers = Object.keys(json[0] as object);
                const csvRows = [
                    headers.join(","),
                    ...json.map((row) =>
                        headers
                            .map((header) => {
                                const value = (row as Record<string, unknown>)[header];
                                if (typeof value === "object" && value !== null) {
                                    return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
                                }
                                return `"${value?.toString().replace(/"/g, '""') || ""}"`;
                            })
                            .join(",")
                    ),
                ];
                return csvRows.join("\n");
            };

            const usersCSV = jsonToCSV(users || []);
            const ordersCSV = jsonToCSV(orders || []);
            const productsCSV = jsonToCSV(products || []);

            const combinedCSV = [
                "Users",
                usersCSV,
                "",
                "Orders",
                ordersCSV,
                "",
                "Products",
                productsCSV,
            ].join("\n");

            const blob = new Blob([combinedCSV], { type: "text/csv;charset=utf-8;" });
            saveAs(blob, "dashboard_data.csv");
        } catch (err: unknown) {
            console.error("Error exporting to CSV:", err);
            setError(`Failed to export to CSV: ${err instanceof Error ? err.message : String(err)}`);
        }
    };

    return {
        error,
        exportToExcel,
        exportToCSV,
        isConfigured: !!API_BASE_URL
    };
};
