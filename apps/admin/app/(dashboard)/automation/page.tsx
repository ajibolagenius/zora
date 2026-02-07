"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Robot,
    ChartLine,
    Clock,
    CheckCircle,
    WarningCircle,
    Play,
    Pause,
    GearSix,
    Funnel,
    Users,
    ShoppingCart,
    Package,
    TrendUp,
    ArrowsClockwise,
    CaretDown,
    CaretUp,
    CaretLeft,
    CaretRight,
    Activity,
} from "@phosphor-icons/react";
import { Header } from "../../../components/Header";
import {
    Card,
    Button,
    Badge,
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent,
    formatCurrency,
    formatRelativeTime,
    staggerContainer,
    staggerItem,
} from "@zora/ui-web";

interface AutomationRule {
    id: string;
    name: string;
    description: string;
    trigger: string;
    action: string;
    status: "active" | "paused" | "error";
    lastRun?: string;
    successRate: number;
    totalRuns: number;
}

interface SystemHealth {
    cpu: number;
    memory: number;
    disk: number;
    uptime: string;
    responseTime: number;
    status: "healthy" | "warning" | "critical";
}

const mockAutomationRules: AutomationRule[] = [
    {
        id: "1",
        name: "Low Stock Alert",
        description: "Notify vendors when products fall below 10 units",
        trigger: "Stock < 10",
        action: "Send email notification",
        status: "active",
        lastRun: "2 hours ago",
        successRate: 98.5,
        totalRuns: 1247,
    },
    {
        id: "2",
        name: "Order Processing",
        description: "Automatically assign orders to available couriers",
        trigger: "New order created",
        action: "Assign to nearest courier",
        status: "active",
        lastRun: "5 minutes ago",
        successRate: 99.2,
        totalRuns: 3421,
    },
    {
        id: "3",
        name: "Daily Sales Report",
        description: "Generate and email daily sales summary to vendors",
        trigger: "Daily at 9:00 PM",
        action: "Generate PDF report and email",
        status: "active",
        lastRun: "1 day ago",
        successRate: 100,
        totalRuns: 89,
    },
    {
        id: "4",
        name: "Customer Follow-up",
        description: "Send follow-up email for delivered orders",
        trigger: "Order status = delivered",
        action: "Send review request email",
        status: "paused",
        lastRun: "3 days ago",
        successRate: 94.1,
        totalRuns: 567,
    },
];

const mockSystemHealth: SystemHealth = {
    cpu: 45,
    memory: 62,
    disk: 38,
    uptime: "99.98%",
    responseTime: 245,
    status: "healthy",
};

export default function AutomationPage() {
    const [activeTab, setActiveTab] = useState("automation");
    const [selectedRule, setSelectedRule] = useState<AutomationRule | null>(null);
    const [systemHealth, setSystemHealth] = useState<SystemHealth>(mockSystemHealth);

    useEffect(() => {
        // Simulate real-time system health updates
        const interval = setInterval(() => {
            setSystemHealth(prev => ({
                ...prev,
                cpu: Math.max(20, Math.min(80, prev.cpu + (Math.random() - 0.5) * 10)),
                memory: Math.max(40, Math.min(85, prev.memory + (Math.random() - 0.5) * 8)),
                responseTime: Math.max(150, Math.min(400, prev.responseTime + (Math.random() - 0.5) * 50)),
            }));
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case "active": return "text-green-600 bg-green-100";
            case "paused": return "text-yellow-600 bg-yellow-100";
            case "error": return "text-red-600 bg-red-100";
            default: return "text-gray-600 bg-gray-100";
        }
    };

    const getHealthColor = (value: number, type: string) => {
        if (type === "cpu" || type === "memory" || type === "disk") {
            if (value > 80) return "text-red-600";
            if (value > 60) return "text-yellow-600";
            return "text-green-600";
        }
        return "text-gray-600";
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header title="Automation & System Health" />

            <div className="container mx-auto px-4 py-6">
                <div className="max-w-7xl mx-auto">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="automation">Automation Rules</TabsTrigger>
                            <TabsTrigger value="health">System Health</TabsTrigger>
                        </TabsList>

                        <TabsContent value="automation" className="space-y-6">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">Automation Rules</h2>
                                    <p className="text-gray-600 mt-1">Manage automated workflows and business rules</p>
                                </div>
                                <Button className="flex items-center gap-2">
                                    <Robot size={20} />
                                    Create Rule
                                </Button>
                            </div>

                            <motion.div
                                className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                                variants={staggerContainer}
                                initial="initial"
                                animate="animate"
                            >
                                {mockAutomationRules.map((rule, index) => (
                                    <motion.div
                                        key={rule.id}
                                        variants={staggerItem}
                                        whileHover={{ scale: 1.02 }}
                                        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-lg ${getStatusColor(rule.status)}`}>
                                                    <Robot size={24} className="text-white" />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-gray-900">{rule.name}</h3>
                                                    <p className="text-sm text-gray-600">{rule.description}</p>
                                                </div>
                                            </div>
                                            <Badge className={rule.status === "active" ? "bg-green-100 text-green-800" : rule.status === "paused" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}>
                                                {rule.status}
                                            </Badge>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600">Trigger:</span>
                                                <span className="font-medium">{rule.trigger}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600">Action:</span>
                                                <span className="font-medium">{rule.action}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600">Last Run:</span>
                                                <span className="font-medium">{rule.lastRun}</span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t">
                                            <div>
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <CheckCircle size={16} />
                                                    Success Rate
                                                </div>
                                                <div className="text-2xl font-bold text-green-600">{rule.successRate}%</div>
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <ArrowsClockwise size={16} />
                                                    Total Runs
                                                </div>
                                                <div className="text-2xl font-bold text-gray-900">{rule.totalRuns.toLocaleString()}</div>
                                            </div>
                                        </div>

                                        <div className="flex gap-2 mt-4">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setSelectedRule(rule)}
                                                className="flex items-center gap-2"
                                            >
                                                <GearSix size={16} />
                                                Configure
                                            </Button>
                                            <Button
                                                variant={rule.status === "active" ? "outline" : "default"}
                                                size="sm"
                                                className="flex items-center gap-2"
                                            >
                                                {rule.status === "active" ? (
                                                    <>
                                                        <Pause size={16} />
                                                        Pause
                                                    </>
                                                ) : (
                                                    <>
                                                        <Play size={16} />
                                                        Resume
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </TabsContent>

                        <TabsContent value="health" className="space-y-6">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">System Health Monitoring</h2>

                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    <Card className="lg:col-span-2">
                                        <div className="p-6">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Resource Usage</h3>

                                            <div className="space-y-6">
                                                <div>
                                                    <div className="flex justify-between items-center mb-2">
                                                        <div className="flex items-center gap-2">
                                                            <ArrowsClockwise size={20} />
                                                            <span className="font-medium">CPU Usage</span>
                                                        </div>
                                                        <span className={`font-bold ${getHealthColor(systemHealth.cpu, "cpu")}`}>
                                                            {systemHealth.cpu}%
                                                        </span>
                                                    </div>
                                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                                        <div
                                                            className={`h-2 rounded-full ${systemHealth.cpu > 80 ? "bg-red-500" :
                                                                systemHealth.cpu > 60 ? "bg-yellow-500" : "bg-green-500"
                                                                }`}
                                                            style={{ width: `${systemHealth.cpu}%` }}
                                                        />
                                                    </div>
                                                </div>

                                                <div>
                                                    <div className="flex justify-between items-center mb-2">
                                                        <div className="flex items-center gap-2">
                                                            <Package size={20} />
                                                            <span className="font-medium">Memory Usage</span>
                                                        </div>
                                                        <span className={`font-bold ${getHealthColor(systemHealth.memory, "memory")}`}>
                                                            {systemHealth.memory}%
                                                        </span>
                                                    </div>
                                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                                        <div
                                                            className={`h-2 rounded-full ${systemHealth.memory > 80 ? "bg-red-500" :
                                                                systemHealth.memory > 60 ? "bg-yellow-500" : "bg-green-500"
                                                                }`}
                                                            style={{ width: `${systemHealth.memory}%` }}
                                                        />
                                                    </div>
                                                </div>

                                                <div>
                                                    <div className="flex justify-between items-center mb-2">
                                                        <div className="flex items-center gap-2">
                                                            <Package size={20} />
                                                            <span className="font-medium">Disk Usage</span>
                                                        </div>
                                                        <span className={`font-bold ${getHealthColor(systemHealth.disk, "disk")}`}>
                                                            {systemHealth.disk}%
                                                        </span>
                                                    </div>
                                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                                        <div
                                                            className={`h-2 rounded-full ${systemHealth.disk > 80 ? "bg-red-500" :
                                                                systemHealth.disk > 60 ? "bg-yellow-500" : "bg-green-500"
                                                                }`}
                                                            style={{ width: `${systemHealth.disk}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>

                                    <Card>
                                        <div className="p-6">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>

                                            <div className="space-y-4">
                                                <div className="text-center">
                                                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${systemHealth.status === "healthy" ? "bg-green-100 text-green-800" :
                                                        systemHealth.status === "warning" ? "bg-yellow-100 text-yellow-800" :
                                                            "bg-red-100 text-red-800"
                                                        }`}>
                                                        <div className={`w-3 h-3 rounded-full ${systemHealth.status === "healthy" ? "bg-green-600" :
                                                            systemHealth.status === "warning" ? "bg-yellow-600" :
                                                                "bg-red-600"
                                                            }`} />
                                                        {systemHealth.status === "healthy" ? "System Healthy" :
                                                            systemHealth.status === "warning" ? "System Warning" : "System Critical"}
                                                    </div>
                                                </div>

                                                <div className="space-y-3 pt-4">
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">Uptime</span>
                                                        <span className="font-bold text-green-600">{systemHealth.uptime}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">Response Time</span>
                                                        <span className="font-bold">{systemHealth.responseTime}ms</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                </div>

                                <Card className="mt-6">
                                    <div className="p-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Events</h3>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                                                <CheckCircle size={20} className="text-green-600" />
                                                <div className="flex-1">
                                                    <div className="font-medium">System backup completed</div>
                                                    <div className="text-sm text-gray-600">15 minutes ago</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                                                <Activity size={20} className="text-blue-600" />
                                                <div className="flex-1">
                                                    <div className="font-medium">Database optimization completed</div>
                                                    <div className="text-sm text-gray-600">1 hour ago</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                                                <WarningCircle size={20} className="text-yellow-600" />
                                                <div className="flex-1">
                                                    <div className="font-medium">High memory usage detected</div>
                                                    <div className="text-sm text-gray-600">2 hours ago</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}
