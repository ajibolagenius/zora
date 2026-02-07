"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
    ShoppingCart,
    Storefront,
    ChartBar,
    MapPin,
    Plus,
} from "@phosphor-icons/react";
import { Card } from "@zora/ui-web";
import { useVendorStats } from "../../hooks";
import { useAuth } from "../../hooks";

export function QuickActions() {
    const { vendor } = useAuth();
    const { data: stats } = useVendorStats(vendor?.id ?? null);

    return (
        <Card className="h-full">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Actions
            </h2>
            <div className="grid grid-cols-1 gap-3">
                <Link href="/products/new" className="block">
                    <motion.div
                        whileHover={{ scale: 1.02, x: 2 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-xl hover:border-primary/20 hover:bg-primary/5 transition-all shadow-sm hover:shadow-md"
                    >
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                            <Plus size={24} weight="duotone" className="text-primary" />
                        </div>
                        <div>
                            <p className="font-semibold text-gray-900">Add New Product</p>
                            <p className="text-xs text-gray-500 mt-0.5">
                                List a new item for sale
                            </p>
                        </div>
                    </motion.div>
                </Link>

                <Link href="/orders?status=pending" className="block">
                    <motion.div
                        whileHover={{ scale: 1.02, x: 2 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-xl hover:border-yellow-200 hover:bg-yellow-50 transition-all shadow-sm hover:shadow-md"
                    >
                        <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center shrink-0">
                            <ShoppingCart size={24} weight="duotone" className="text-yellow-600" />
                        </div>
                        <div>
                            <p className="font-semibold text-gray-900">Pending Orders</p>
                            <p className="text-xs text-gray-500 mt-0.5">
                                {stats?.pendingOrders || 0} orders awaiting action
                            </p>
                        </div>
                    </motion.div>
                </Link>

                <Link href="/shop" className="block">
                    <motion.div
                        whileHover={{ scale: 1.02, x: 2 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-xl hover:border-gray-200 hover:bg-gray-50 transition-all shadow-sm hover:shadow-md"
                    >
                        <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                            <Storefront size={24} weight="duotone" className="text-gray-600" />
                        </div>
                        <div>
                            <p className="font-semibold text-gray-900">
                                Update Shop Profile
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">
                                Edit your store details
                            </p>
                        </div>
                    </motion.div>
                </Link>

                <Link href="/analytics" className="block">
                    <motion.div
                        whileHover={{ scale: 1.02, x: 2 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-xl hover:border-blue-200 hover:bg-blue-50 transition-all shadow-sm hover:shadow-md"
                    >
                        <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                            <ChartBar size={24} weight="duotone" className="text-blue-600" />
                        </div>
                        <div>
                            <p className="font-semibold text-gray-900">View Analytics</p>
                            <p className="text-xs text-gray-500 mt-0.5">
                                Track your performance
                            </p>
                        </div>
                    </motion.div>
                </Link>

                <Link href="/settings" className="block">
                    <motion.div
                        whileHover={{ scale: 1.02, x: 2 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-xl hover:border-green-200 hover:bg-green-50 transition-all shadow-sm hover:shadow-md"
                    >
                        <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center shrink-0">
                            <MapPin size={24} weight="duotone" className="text-green-600" />
                        </div>
                        <div>
                            <p className="font-semibold text-gray-900">Delivery Settings</p>
                            <p className="text-xs text-gray-500 mt-0.5">
                                Configure delivery options
                            </p>
                        </div>
                    </motion.div>
                </Link>
            </div>
        </Card>
    );
}
