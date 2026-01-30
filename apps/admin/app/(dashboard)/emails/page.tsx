"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    Envelope,
    MagnifyingGlass,
    Star,
    Archive,
    Trash,
    ArrowBendUpLeft,
    DotsThree,
    Paperclip,
    PaperPlaneTilt,
    User,
    Clock,
    Tag,
    Funnel,
    CaretLeft,
} from "@phosphor-icons/react";
import { Header } from "../../../components/Header";
import {
    Card,
    Button,
    Badge,
    Avatar,
    AvatarFallback,
} from "@zora/ui-web";

// Mock email threads
const emailThreads = [
    {
        id: "1",
        customer: "Sarah Johnson",
        email: "sarah.j@email.com",
        subject: "Order #ORD-4523 - Missing item",
        preview: "Hi, I received my order today but one item was missing from the package...",
        status: "open",
        priority: "high",
        orderId: "ORD-4523",
        unread: true,
        lastMessage: "10 min ago",
        messages: [
            { sender: "customer", content: "Hi, I received my order today but one item was missing from the package. The Jollof Rice Spice Mix wasn't included. Can you please help?", time: "10 min ago" },
        ],
    },
    {
        id: "2",
        customer: "Michael Okonkwo",
        email: "m.okonkwo@email.com",
        subject: "Question about delivery times",
        preview: "Hello, I wanted to ask about delivery to Manchester...",
        status: "open",
        priority: "normal",
        orderId: null,
        unread: false,
        lastMessage: "1 hour ago",
        messages: [
            { sender: "customer", content: "Hello, I wanted to ask about delivery to Manchester. How long does it typically take?", time: "2 hours ago" },
            { sender: "admin", content: "Hi Michael! Standard delivery to Manchester typically takes 3-5 business days. Express delivery is available for 1-2 days.", time: "1 hour ago" },
        ],
    },
    {
        id: "3",
        customer: "Amara Diallo",
        email: "amara.d@email.com",
        subject: "Refund request for damaged product",
        preview: "I need to request a refund as the palm oil bottle arrived broken...",
        status: "pending",
        priority: "high",
        orderId: "ORD-4501",
        unread: true,
        lastMessage: "2 hours ago",
        messages: [
            { sender: "customer", content: "I need to request a refund as the palm oil bottle arrived broken. I've attached photos of the damage.", time: "2 hours ago" },
        ],
    },
    {
        id: "4",
        customer: "David Mensah",
        email: "david.m@email.com",
        subject: "Thank you for the great service!",
        preview: "Just wanted to say thank you for the amazing products...",
        status: "closed",
        priority: "low",
        orderId: "ORD-4489",
        unread: false,
        lastMessage: "1 day ago",
        messages: [
            { sender: "customer", content: "Just wanted to say thank you for the amazing products and fast delivery. Will definitely order again!", time: "1 day ago" },
            { sender: "admin", content: "Thank you so much David! We're thrilled you enjoyed your order. We look forward to serving you again!", time: "1 day ago" },
        ],
    },
];

const statusConfig = {
    open: { label: "Open", variant: "warning" as const },
    pending: { label: "Pending", variant: "info" as const },
    closed: { label: "Closed", variant: "default" as const },
};

const priorityConfig = {
    high: { label: "High", color: "text-red-600 bg-red-100" },
    normal: { label: "Normal", color: "text-gray-600 bg-gray-100" },
    low: { label: "Low", color: "text-green-600 bg-green-100" },
};

export default function EmailsPage() {
    const [selectedThread, setSelectedThread] = useState<typeof emailThreads[0] | null>(null);
    const [statusFilter, setStatusFilter] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [replyText, setReplyText] = useState("");

    const filteredThreads = emailThreads.filter(thread => {
        const matchesSearch = thread.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
            thread.customer.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "all" || thread.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const openCount = emailThreads.filter(t => t.status === "open").length;
    const unreadCount = emailThreads.filter(t => t.unread).length;

    return (
        <>
            <Header
                title="Email Threads"
                description="Manage customer communications"
            />

            <div className="p-4 sm:p-6 lg:p-8">
                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
                >
                    <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                <Envelope size={24} weight="duotone" />
                            </div>
                            <div>
                                <p className="text-white/80 text-sm">Total Threads</p>
                                <p className="text-2xl font-bold">{emailThreads.length}</p>
                            </div>
                        </div>
                    </Card>
                    <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                <Clock size={24} weight="duotone" />
                            </div>
                            <div>
                                <p className="text-white/80 text-sm">Open</p>
                                <p className="text-2xl font-bold">{openCount}</p>
                            </div>
                        </div>
                    </Card>
                    <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                <Star size={24} weight="duotone" />
                            </div>
                            <div>
                                <p className="text-white/80 text-sm">Unread</p>
                                <p className="text-2xl font-bold">{unreadCount}</p>
                            </div>
                        </div>
                    </Card>
                    <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                <PaperPlaneTilt size={24} weight="duotone" />
                            </div>
                            <div>
                                <p className="text-white/80 text-sm">Avg. Response</p>
                                <p className="text-2xl font-bold">2.4h</p>
                            </div>
                        </div>
                    </Card>
                </motion.div>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Thread List */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className={`lg:col-span-1 ${selectedThread ? "hidden lg:block" : ""}`}
                    >
                        <Card padding="none">
                            <div className="p-4 border-b">
                                <div className="relative mb-3">
                                    <MagnifyingGlass size={16} weight="duotone" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search emails..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 text-sm rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                                    />
                                </div>
                                <div className="flex gap-2">
                                    {["all", "open", "pending", "closed"].map((status) => (
                                        <button
                                            key={status}
                                            onClick={() => setStatusFilter(status)}
                                            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${statusFilter === status
                                                    ? "bg-primary text-white"
                                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                                }`}
                                        >
                                            {status.charAt(0).toUpperCase() + status.slice(1)}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="divide-y max-h-[600px] overflow-y-auto">
                                {filteredThreads.map((thread) => (
                                    <div
                                        key={thread.id}
                                        onClick={() => setSelectedThread(thread)}
                                        className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${selectedThread?.id === thread.id ? "bg-primary/5 border-l-2 border-primary" : ""
                                            } ${thread.unread ? "bg-blue-50/50" : ""}`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <Avatar size="sm">
                                                <AvatarFallback>
                                                    {thread.customer.split(" ").map(n => n[0]).join("")}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className={`font-medium text-gray-900 truncate ${thread.unread ? "font-semibold" : ""}`}>
                                                        {thread.customer}
                                                    </span>
                                                    <span className="text-xs text-gray-500">{thread.lastMessage}</span>
                                                </div>
                                                <p className={`text-sm truncate ${thread.unread ? "text-gray-900 font-medium" : "text-gray-600"}`}>
                                                    {thread.subject}
                                                </p>
                                                <p className="text-xs text-gray-500 truncate mt-1">{thread.preview}</p>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <Badge variant={statusConfig[thread.status as keyof typeof statusConfig].variant} size="sm">
                                                        {statusConfig[thread.status as keyof typeof statusConfig].label}
                                                    </Badge>
                                                    {thread.orderId && (
                                                        <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">
                                                            {thread.orderId}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </motion.div>

                    {/* Email Detail */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className={`lg:col-span-2 ${!selectedThread ? "hidden lg:block" : ""}`}
                    >
                        {selectedThread ? (
                            <Card padding="none" className="h-full flex flex-col">
                                {/* Header */}
                                <div className="p-4 border-b">
                                    <div className="flex items-center gap-4 mb-3">
                                        <button
                                            onClick={() => setSelectedThread(null)}
                                            className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-gray-100"
                                        >
                                            <CaretLeft size={20} weight="duotone" />
                                        </button>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-900">{selectedThread.subject}</h3>
                                            <p className="text-sm text-gray-500">
                                                {selectedThread.customer} &lt;{selectedThread.email}&gt;
                                            </p>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button variant="ghost" size="sm">
                                                <Star size={16} weight="duotone" />
                                            </Button>
                                            <Button variant="ghost" size="sm">
                                                <Archive size={16} weight="duotone" />
                                            </Button>
                                            <Button variant="ghost" size="sm" className="text-red-600">
                                                <Trash size={16} weight="duotone" />
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Badge variant={statusConfig[selectedThread.status as keyof typeof statusConfig].variant}>
                                            {statusConfig[selectedThread.status as keyof typeof statusConfig].label}
                                        </Badge>
                                        <span className={`text-xs px-2 py-1 rounded-full ${priorityConfig[selectedThread.priority as keyof typeof priorityConfig].color}`}>
                                            {priorityConfig[selectedThread.priority as keyof typeof priorityConfig].label} Priority
                                        </span>
                                        {selectedThread.orderId && (
                                            <Badge variant="default">Order: {selectedThread.orderId}</Badge>
                                        )}
                                    </div>
                                </div>

                                {/* Messages */}
                                <div className="flex-1 p-4 overflow-y-auto space-y-4">
                                    {selectedThread.messages.map((message, index) => (
                                        <div
                                            key={index}
                                            className={`flex ${message.sender === "admin" ? "justify-end" : "justify-start"}`}
                                        >
                                            <div className={`max-w-[80%] ${message.sender === "admin" ? "order-2" : ""}`}>
                                                <div className={`p-4 rounded-xl ${message.sender === "admin"
                                                        ? "bg-primary text-white"
                                                        : "bg-gray-100 text-gray-800"
                                                    }`}>
                                                    <p>{message.content}</p>
                                                </div>
                                                <p className={`text-xs mt-1 ${message.sender === "admin" ? "text-right" : ""
                                                    } text-gray-500`}>
                                                    {message.sender === "admin" ? "Admin" : selectedThread.customer} • {message.time}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Reply Box */}
                                <div className="p-4 border-t">
                                    <div className="relative">
                                        <textarea
                                            value={replyText}
                                            onChange={(e) => setReplyText(e.target.value)}
                                            placeholder="Type your reply..."
                                            rows={3}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                                        />
                                    </div>
                                    <div className="flex items-center justify-between mt-3">
                                        <div className="flex gap-2">
                                            <Button variant="ghost" size="sm">
                                                <Paperclip size={16} weight="duotone" />
                                            </Button>
                                        </div>
                                        <Button leftIcon={<PaperPlaneTilt size={16} weight="duotone" />}>
                                            Send Reply
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ) : (
                            <Card className="h-full flex items-center justify-center text-center">
                                <div>
                                    <Envelope size={64} weight="duotone" className="text-gray-300 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
                                    <p className="text-gray-500">Choose an email thread from the list to view and reply</p>
                                </div>
                            </Card>
                        )}
                    </motion.div>
                </div>
            </div>
        </>
    );
}
