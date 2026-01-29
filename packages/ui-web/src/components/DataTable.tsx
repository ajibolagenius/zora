"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp, ChevronDown, ChevronsUpDown, Search, Filter, MoreHorizontal } from "lucide-react";
import { cn } from "../lib/utils";
import { Input } from "./Input";
import { Button } from "./Button";
import { Badge } from "./Badge";

interface Column<T> {
    key: keyof T | string;
    header: string;
    sortable?: boolean;
    width?: string;
    render?: (item: T, index: number) => React.ReactNode;
}

interface DataTableProps<T> {
    data: T[];
    columns: Column<T>[];
    searchable?: boolean;
    searchPlaceholder?: string;
    searchKeys?: (keyof T)[];
    loading?: boolean;
    emptyMessage?: string;
    onRowClick?: (item: T) => void;
    getRowId?: (item: T) => string;
    className?: string;
    pagination?: {
        page: number;
        pageSize: number;
        total: number;
        onPageChange: (page: number) => void;
    };
}

export function DataTable<T extends Record<string, unknown>>({
    data,
    columns,
    searchable = false,
    searchPlaceholder = "Search...",
    searchKeys = [],
    loading = false,
    emptyMessage = "No data found",
    onRowClick,
    getRowId,
    className,
    pagination,
}: DataTableProps<T>) {
    const [searchTerm, setSearchTerm] = React.useState("");
    const [sortConfig, setSortConfig] = React.useState<{
        key: string;
        direction: "asc" | "desc";
    } | null>(null);

    // Filter data by search term
    const filteredData = React.useMemo(() => {
        if (!searchTerm || searchKeys.length === 0) return data;

        return data.filter((item) =>
            searchKeys.some((key) => {
                const value = item[key];
                if (typeof value === "string") {
                    return value.toLowerCase().includes(searchTerm.toLowerCase());
                }
                if (typeof value === "number") {
                    return value.toString().includes(searchTerm);
                }
                return false;
            })
        );
    }, [data, searchTerm, searchKeys]);

    // Sort data
    const sortedData = React.useMemo(() => {
        if (!sortConfig) return filteredData;

        return [...filteredData].sort((a, b) => {
            const aVal = a[sortConfig.key as keyof T];
            const bVal = b[sortConfig.key as keyof T];

            if (aVal === bVal) return 0;
            if (aVal === null || aVal === undefined) return 1;
            if (bVal === null || bVal === undefined) return -1;

            const comparison = aVal < bVal ? -1 : 1;
            return sortConfig.direction === "asc" ? comparison : -comparison;
        });
    }, [filteredData, sortConfig]);

    const handleSort = (key: string) => {
        setSortConfig((current) => {
            if (current?.key !== key) return { key, direction: "asc" };
            if (current.direction === "asc") return { key, direction: "desc" };
            return null;
        });
    };

    const getSortIcon = (key: string) => {
        if (sortConfig?.key !== key) return <ChevronsUpDown className="h-4 w-4" />;
        return sortConfig.direction === "asc" ? (
            <ChevronUp className="h-4 w-4" />
        ) : (
            <ChevronDown className="h-4 w-4" />
        );
    };

    const totalPages = pagination ? Math.ceil(pagination.total / pagination.pageSize) : 1;

    return (
        <div className={cn("space-y-4", className)}>
            {/* Search Bar */}
            {searchable && (
                <div className="flex items-center gap-4">
                    <div className="relative flex-1 max-w-sm">
                        <Input
                            placeholder={searchPlaceholder}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            leftIcon={<Search className="h-4 w-4" />}
                            inputSize="sm"
                        />
                    </div>
                </div>
            )}

            {/* Table */}
            <div className="rounded-xl border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                {columns.map((column) => (
                                    <th
                                        key={String(column.key)}
                                        className={cn(
                                            "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                                            column.sortable && "cursor-pointer select-none hover:bg-gray-100 transition-colors"
                                        )}
                                        style={{ width: column.width }}
                                        onClick={() => column.sortable && handleSort(String(column.key))}
                                    >
                                        <div className="flex items-center gap-2">
                                            {column.header}
                                            {column.sortable && getSortIcon(String(column.key))}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            <AnimatePresence mode="popLayout">
                                {loading ? (
                                    // Loading skeleton
                                    Array.from({ length: 5 }).map((_, i) => (
                                        <tr key={`skeleton-${i}`}>
                                            {columns.map((column, j) => (
                                                <td key={j} className="px-6 py-4">
                                                    <div className="h-4 bg-gray-200 rounded animate-pulse" />
                                                </td>
                                            ))}
                                        </tr>
                                    ))
                                ) : sortedData.length === 0 ? (
                                    // Empty state
                                    <tr>
                                        <td colSpan={columns.length} className="px-6 py-12 text-center">
                                            <p className="text-gray-500">{emptyMessage}</p>
                                        </td>
                                    </tr>
                                ) : (
                                    // Data rows
                                    sortedData.map((item, index) => (
                                        <motion.tr
                                            key={getRowId ? getRowId(item) : index}
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            transition={{ duration: 0.2, delay: index * 0.02 }}
                                            className={cn(
                                                "hover:bg-gray-50 transition-colors",
                                                onRowClick && "cursor-pointer"
                                            )}
                                            onClick={() => onRowClick?.(item)}
                                        >
                                            {columns.map((column) => (
                                                <td
                                                    key={String(column.key)}
                                                    className="px-6 py-4 text-sm text-gray-900"
                                                >
                                                    {column.render
                                                        ? column.render(item, index)
                                                        : String(item[column.key as keyof T] ?? "")}
                                                </td>
                                            ))}
                                        </motion.tr>
                                    ))
                                )}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            {pagination && totalPages > 1 && (
                <div className="flex items-center justify-between px-2">
                    <p className="text-sm text-gray-500">
                        Showing {(pagination.page - 1) * pagination.pageSize + 1} to{" "}
                        {Math.min(pagination.page * pagination.pageSize, pagination.total)} of{" "}
                        {pagination.total} results
                    </p>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={pagination.page <= 1}
                            onClick={() => pagination.onPageChange(pagination.page - 1)}
                        >
                            Previous
                        </Button>
                        <div className="flex items-center gap-1">
                            {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                                let pageNum: number;
                                if (totalPages <= 5) {
                                    pageNum = i + 1;
                                } else if (pagination.page <= 3) {
                                    pageNum = i + 1;
                                } else if (pagination.page >= totalPages - 2) {
                                    pageNum = totalPages - 4 + i;
                                } else {
                                    pageNum = pagination.page - 2 + i;
                                }

                                return (
                                    <Button
                                        key={pageNum}
                                        variant={pagination.page === pageNum ? "default" : "ghost"}
                                        size="sm"
                                        onClick={() => pagination.onPageChange(pageNum)}
                                        className="w-9"
                                    >
                                        {pageNum}
                                    </Button>
                                );
                            })}
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={pagination.page >= totalPages}
                            onClick={() => pagination.onPageChange(pagination.page + 1)}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
