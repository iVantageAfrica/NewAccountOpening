"use client";
import React, { useState, useEffect, useRef } from "react";
import Papa from "papaparse";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { MoveLeft, MoveRight } from "lucide-react";
import Image from "next/image";

interface Column {
    key: string;
    label: string;
    cellClassName?: string | ((value: any, row: any, rowIndex: number) => string);
}

interface DataTableProps<T extends Record<string, any>> {
    data: T[];
    tableTitle?: string;
    searchPlaceholder?: string;
    entriesPerPage?: number;
    tableHeight?: number;
    columns?: Column[];
    onRowClick?: (row: T) => void;
    renderActions?: (row: T) => React.ReactNode;
    onSearchChange?: (query: string) => void;
    onLengthChange?: (length: number | "all") => void;
    onPageChange?: (direction: "next" | "prev") => void;

    nextUrl?: string | null;
    prevUrl?: string | null;
}

const DataTable = <T extends Record<string, any>>({
    data = [],
    tableTitle,
    searchPlaceholder = "Search...",
    entriesPerPage = 10,
    tableHeight = 430,
    onRowClick,
    columns = null,
    renderActions,
    onSearchChange,
    onLengthChange,
    onPageChange,
    nextUrl,
    prevUrl,
}: DataTableProps<T>) => {
    const [searchText, setSearchText] = useState("");
    const [entryPerPage, setEntryPerPage] = useState(entriesPerPage);
    const [isSNDescending, setIsSNDescending] = useState(false);
    const [showColumnDropdown, setShowColumnDropdown] = useState(false);
    const [localPage, setLocalPage] = useState(1);
    const localEntriesPerPage = 10;

    const dropdownRef = useRef<HTMLDivElement>(null);

    const headers: Column[] =
        columns ?? (data[0] ? Object.keys(data[0]).map((k) => ({ key: k, label: k })) : []);
    const [visibleColumns, setVisibleColumns] = useState(headers.map((h) => h.key));

    const toggleColumnVisibility = (key: string) =>
        setVisibleColumns((prev) =>
            prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
        );

    // Close dropdown on outside click
    useEffect(() => {
        const handleOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node))
                setShowColumnDropdown(false);
        };
        document.addEventListener("mousedown", handleOutside);
        return () => document.removeEventListener("mousedown", handleOutside);
    }, []);

    // Debounced search
    useEffect(() => {
        const timer = setTimeout(() => onSearchChange?.(searchText), 500);
        return () => clearTimeout(timer);
    }, [searchText, onSearchChange]);

    const handleEntryChange = (value: string) => {
        if (value === "all") {
            setEntryPerPage(data.length);
            onLengthChange?.("all");
        } else {
            const val = Number(value);
            setEntryPerPage(val);
            onLengthChange?.(val);
        }
    };

    const handleExportCSV = () => {
        const csv = Papa.unparse(
            data.map((row) =>
                headers.reduce<Record<string, string>>(
                    (acc, h) => ({ ...acc, [h.label]: row[h.key] }),
                    {}
                )
            )
        );
        const link = document.createElement("a");
        link.href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
        link.download = `${tableTitle?.replace(/ /g, "_").toLowerCase()}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleExportPDF = () => {
        const doc = new jsPDF();
        autoTable(doc, {
            head: [headers.map((h) => h.label)],
            body: data.map((row) => headers.map((h) => row[h.key])),
        });
        doc.save(`${tableTitle?.replace(/ /g, "_").toLowerCase()}.pdf`);
    };

    const isLocalPagination = !prevUrl && !nextUrl;
    const paginatedData = isLocalPagination ? data.slice((localPage - 1) * localEntriesPerPage, localPage * localEntriesPerPage) : data;
    const startNumber = isLocalPagination ? (localPage - 1) * localEntriesPerPage + 1 : 1;
    const endNumber = isLocalPagination ? (localPage - 1) * localEntriesPerPage + paginatedData.length : data.length;

    return (
        <div className="p-4 rounded shadow-md shadow-black/20 dark:bg-black">
            {tableTitle && <p className="uppercase pb-2 opacity-80 font-bold">{tableTitle}</p>}

            <div className="mb-5 flex justify-between items-center flex-wrap gap-4">
                {/* Entries & Column Dropdown */}
                <div className="relative flex-wrap flex gap-4 items-center">
                    <div>
                        <span className="text-gray-500 text-xs mr-2">Filter:</span>
                        <select
                            value={entryPerPage}
                            onChange={(e) => handleEntryChange(e.target.value)}
                            className="bg-white text-black px-2 py-1 text-xs rounded-md border border-[#c4c4c460] focus:outline-0 focus:border-secondary"
                        >
                            {[10, 25, 50, 75, 100].map((n) => (
                                <option key={n} value={n}>{n}</option>
                            ))}
                            <option value="all">All</option>
                        </select>
                    </div>

                    <span
                        className="text-gray-500 font-bold text-xs mr-2 cursor-pointer"
                        onClick={() => setShowColumnDropdown((prev) => !prev)}
                    >
                        Select Columns
                    </span>
                    {showColumnDropdown && (
                        <div
                            ref={dropdownRef}
                            className="absolute top-full left-0 mt-2 bg-white border border-gray-300 rounded-md shadow-md z-50 p-3 w-60 max-h-64 overflow-y-auto"
                        >
                            <p className="text-sm font-bold text-primary mb-2">
                                Select columns to display
                            </p>
                            {headers.map((h) => (
                                <label key={h.key} className="flex items-center space-x-2 mb-1">
                                    <input
                                        type="checkbox"
                                        checked={visibleColumns.includes(h.key)}
                                        onChange={() => toggleColumnVisibility(h.key)}
                                    />
                                    <span className="text-sm dark:text-black">{h.label}</span>
                                </label>
                            ))}
                        </div>
                    )}
                </div>

                {/* Search & Export */}
                <div className="flex gap-2 items-center flex-wrap">
                    <p className="font-bold text-xs">Export:</p>
                    <button onClick={handleExportCSV} className="hover:text-primary hover:font-bold rounded-sm cursor-pointer text-xs py-1">CSV</button>
                    <button onClick={handleExportPDF} className="hover:text-primary hover:font-bold rounded-sm cursor-pointer text-xs py-1">PDF</button>
                    <input
                        type="search"
                        placeholder={searchPlaceholder}
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        className="bg-white text-black px-4 py-2 text-sm rounded-md border border-[#c4c4c460] focus:outline-0 focus:border-secondary placeholder:opacity-70 placeholder:text-xs"
                    />
                </div>
            </div>

            {data.length > 0 ? (
                <>
                    <div className="grid rounded-md border border-[#c4c4c460] overflow-auto scrollbar-thin scrollbar-thumb-red-600 scrollbar-track-transparent" style={{ maxHeight: `${tableHeight}px` }}>
                        <table className="min-w-full text-sm text-left">
                            <thead className="bg-primary text-white text-sm font-semibold sticky top-0 z-10 dark:bg-black">
                                <tr>
                                    <th className="px-6 py-3 text-xs whitespace-nowrap uppercase bg-secondary/10 cursor-pointer select-none">
                                        S/N
                                    </th>
                                    {headers.filter(h => visibleColumns.includes(h.key)).map((h, idx) => (
                                        <th key={idx} className="px-6 py-3 text-xs uppercase whitespace-nowrap bg-secondary/10">{h.label}</th>
                                    ))}
                                    {renderActions && <th className="px-6 py-3 whitespace-nowrap bg-secondary/10 text-xs uppercase">Actions</th>}
                                </tr>
                            </thead>
                            <tbody className="bg-white/10 text-sm">
                                {paginatedData.map((row, idx) => (
                                    <tr
                                        key={idx}
                                        onClick={() => onRowClick?.(row)}
                                        className={`dark:text-black ${onRowClick ? "cursor-pointer " : ""} ${idx % 2 === 0 ? "bg-white" : "bg-secondary/2 dark:bg-gray-300 "} hover:bg-black/5 dark:hover:text-white whitespace-nowrap`}
                                    >
                                        <td className="text-start py-4 px-6">
                                            {isLocalPagination
                                                ? (localPage - 1) * localEntriesPerPage + idx + 1
                                                : idx + 1}
                                        </td>
                                        {headers.filter(h => visibleColumns.includes(h.key)).map(({ key, cellClassName }, ci) => {
                                            const val = row[key];
                                            const cls = typeof cellClassName === "function" ? cellClassName(val, row, idx) : cellClassName || "";
                                            return <td key={ci} className={`text-start py-4 px-6 text-xs ${cls}`}>{val}</td>
                                        })}
                                        {renderActions && <td className="text-start py-4 px-6 text-xs">{renderActions(row)}</td>}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="gap-4 flex justify-between items-center mt-4">
                        {/* Pagination info */}
                        <p className="text-gray-500 text-sm">
                            Showing{" "}
                            <span className="font-medium text-black">
                                {isLocalPagination
                                    ? (localPage - 1) * localEntriesPerPage + 1
                                    : 1}
                            </span>{" "}
                            to{" "}
                            <span className="font-medium text-black">
                                {isLocalPagination
                                    ? (localPage - 1) * localEntriesPerPage + paginatedData.length
                                    : paginatedData.length}
                            </span>{" "}
                            of {data.length} results
                        </p>
                        <div className="flex gap-3">
                            {/* Previous Button */}
                            <button
                                onClick={() => {
                                    if (isLocalPagination) setLocalPage(p => Math.max(p - 1, 1));
                                    else onPageChange?.("prev"); // API pagination
                                }}
                                disabled={isLocalPagination ? localPage === 1 : !prevUrl}
                                className={`bg-secondary/10 border rounded-md p-1 text-sm ${(isLocalPagination ? localPage === 1 : !prevUrl) ? "opacity-50 cursor-not-allowed" : "opacity-100"
                                    }`}
                            >
                                <MoveLeft size={15} />
                            </button>

                            {/* Next Button */}
                            <button
                                onClick={() => {
                                    if (isLocalPagination) setLocalPage(p => p + 1);
                                    else onPageChange?.("next"); // API pagination
                                }}
                                disabled={isLocalPagination ? localPage * localEntriesPerPage >= data.length : !nextUrl}
                                className={`bg-secondary/10 border rounded-md p-1 text-sm ${(isLocalPagination ? localPage * localEntriesPerPage >= data.length : !nextUrl)
                                        ? "opacity-50 cursor-not-allowed"
                                        : "opacity-100"
                                    }`}
                            >
                                <MoveRight size={15} />
                            </button>
                        </div>
                    </div>
                </>
            ) : (
                <div className="flex flex-col items-center justify-center text-center text-gray-500 min-h-[60vh] px-4">
                    <Image src="/images/noData.png" alt="noData" width={400} height={400} />
                    <p className="w-full">It looks like you don't have any records yet. Once data is available, it will show up here.</p>
                </div>
            )}
        </div>
    );
};

export default DataTable;