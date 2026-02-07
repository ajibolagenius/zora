"use client";

import { motion } from "framer-motion";
import { Truck, Package, Clock, MapPin } from "@phosphor-icons/react";
import { Card, staggerContainer, staggerItem } from "@zora/ui-web";

interface DeliveryStatsProps {
    readyForPickup: number;
    inTransit: number;
    pendingAssignments: number;
}

export function DeliveryStats({ readyForPickup, inTransit, pendingAssignments }: DeliveryStatsProps) {
    const stats = [
        {
            label: "Ready for Pickup",
            value: readyForPickup,
            icon: Package,
            color: "text-blue-600",
            bg: "bg-blue-50",
        },
        {
            label: "In Transit",
            value: inTransit,
            icon: Truck,
            color: "text-purple-600",
            bg: "bg-purple-50",
        },
        {
            label: "Unassigned",
            value: pendingAssignments,
            icon: MapPin,
            color: "text-orange-600",
            bg: "bg-orange-50",
        },
    ];

    return (
        <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6"
        >
            {stats.map((stat) => (
                <motion.div key={stat.label} variants={staggerItem}>
                    <Card>
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                                <stat.icon size={24} weight="duotone" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                                <p className="text-sm text-gray-500">{stat.label}</p>
                            </div>
                        </div>
                    </Card>
                </motion.div>
            ))}
        </motion.div>
    );
}
