"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
    ChatCircle,
    MagnifyingGlass,
    User,
    Clock,
    WarningCircle,
    ArrowsClockwise,
    Tray,
} from "@phosphor-icons/react";
import { Header } from "../../../components/Header";
import {
    Button,
    Input,
    Card,
    Badge,
    EmptyState,
    SkeletonCard,
    staggerContainer,
    staggerItem,
} from "@zora/ui-web";
import { useAuth, useVendorConversations, useVendorUnreadCount } from "../../../hooks";
import { formatDistanceToNow } from "date-fns";

export default function MessagesPage() {
    const { vendor } = useAuth();
    const [searchTerm, setSearchTerm] = useState("");

    const {
        data: conversations,
        isLoading,
        isError,
        refetch,
    } = useVendorConversations(vendor?.id ?? null);

    const { data: unreadCount } = useVendorUnreadCount(vendor?.id ?? null);

    // Filter conversations by search term
    const filteredConversations = useMemo(() => {
        if (!conversations) return [];
        if (!searchTerm) return conversations;

        const term = searchTerm.toLowerCase();
        return conversations.filter((conv) => {
            const customerName = conv.customer?.full_name?.toLowerCase() || '';
            const customerEmail = conv.customer?.email?.toLowerCase() || '';
            const lastMessage = conv.last_message_text?.toLowerCase() || '';
            return customerName.includes(term) || customerEmail.includes(term) || lastMessage.includes(term);
        });
    }, [conversations, searchTerm]);

    const formatTime = (dateStr: string) => {
        try {
            return formatDistanceToNow(new Date(dateStr), { addSuffix: true });
        } catch {
            return 'Unknown';
        }
    };

    return (
        <>
            <Header
                title="Messages"
                description={`${unreadCount || 0} unread conversations`}
                action={
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => refetch()}
                        leftIcon={<ArrowsClockwise size={16} weight="duotone" />}
                    >
                        Refresh
                    </Button>
                }
            />

            <div className="p-4 sm:p-6 lg:p-8">
                {/* Stats */}
                <motion.div
                    variants={staggerContainer}
                    initial="initial"
                    animate="animate"
                    className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6"
                >
                    <motion.div variants={staggerItem}>
                        <Card className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-blue-100 text-blue-600">
                                <ChatCircle size={24} weight="duotone" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{conversations?.length || 0}</p>
                                <p className="text-sm text-gray-500">Total Conversations</p>
                            </div>
                        </Card>
                    </motion.div>
                    <motion.div variants={staggerItem}>
                        <Card className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-red-100 text-red-600">
                                <Tray size={24} weight="duotone" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{unreadCount || 0}</p>
                                <p className="text-sm text-gray-500">Unread Messages</p>
                            </div>
                        </Card>
                    </motion.div>
                    <motion.div variants={staggerItem} className="hidden sm:block">
                        <Card className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-green-100 text-green-600">
                                <User size={24} weight="duotone" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">
                                    {new Set(conversations?.map(c => c.user_id)).size || 0}
                                </p>
                                <p className="text-sm text-gray-500">Active Customers</p>
                            </div>
                        </Card>
                    </motion.div>
                </motion.div>

                {/* Search */}
                <Card className="mb-6">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="flex-1">
                            <Input
                                placeholder="Search conversations..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                leftIcon={<MagnifyingGlass size={16} weight="duotone" />}
                            />
                        </div>
                    </div>
                </Card>

                {/* Loading State */}
                {isLoading && (
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <SkeletonCard key={i} />
                        ))}
                    </div>
                )}

                {/* Error State */}
                {isError && (
                    <Card className="p-8 text-center">
                        <WarningCircle size={48} weight="duotone" className="mx-auto mb-4 text-red-500" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to load messages</h3>
                        <p className="text-gray-500 mb-4">There was an error loading your conversations.</p>
                        <Button onClick={() => refetch()}>Try Again</Button>
                    </Card>
                )}

                {/* Empty State */}
                {!isLoading && !isError && filteredConversations.length === 0 && (
                    <EmptyState
                        icon={ChatCircle}
                        title={searchTerm ? "No conversations found" : "No messages yet"}
                        description={
                            searchTerm
                                ? "Try adjusting your search term"
                                : "When customers message you, their conversations will appear here"
                        }
                    />
                )}

                {/* Conversations List */}
                {!isLoading && !isError && filteredConversations.length > 0 && (
                    <motion.div
                        variants={staggerContainer}
                        initial="initial"
                        animate="animate"
                        className="space-y-3"
                    >
                        {filteredConversations.map((conversation) => (
                            <motion.div key={conversation.id} variants={staggerItem}>
                                <Link href={`/messages/${conversation.id}`}>
                                    <Card
                                        className={`hover:shadow-md transition-shadow cursor-pointer ${conversation.unread_count_vendor > 0 ? 'border-l-4 border-l-primary' : ''
                                            }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            {/* Avatar */}
                                            <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                                                {conversation.customer?.avatar_url ? (
                                                    <Image
                                                        src={conversation.customer.avatar_url}
                                                        alt={conversation.customer.full_name || 'Customer'}
                                                        width={48}
                                                        height={48}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-primary/10">
                                                        <User size={24} weight="duotone" className="text-primary" />
                                                    </div>
                                                )}
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between gap-2 mb-1">
                                                    <h3 className={`font-medium truncate ${conversation.unread_count_vendor > 0 ? 'text-gray-900' : 'text-gray-700'
                                                        }`}>
                                                        {conversation.customer?.full_name || 'Unknown Customer'}
                                                    </h3>
                                                    <span className="text-xs text-gray-500 flex-shrink-0 flex items-center gap-1">
                                                        <Clock size={12} weight="duotone" />
                                                        {formatTime(conversation.last_message_at)}
                                                    </span>
                                                </div>
                                                <p className={`text-sm truncate ${conversation.unread_count_vendor > 0 ? 'text-gray-900 font-medium' : 'text-gray-500'
                                                    }`}>
                                                    {conversation.last_message_text || 'No messages yet'}
                                                </p>
                                                {conversation.order && (
                                                    <div className="mt-1">
                                                        <Badge variant="outline" className="text-xs">
                                                            Order #{conversation.order.id.slice(0, 8)}
                                                        </Badge>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Unread Badge */}
                                            {conversation.unread_count_vendor > 0 && (
                                                <div className="flex-shrink-0">
                                                    <Badge variant="default" className="rounded-full min-w-[24px] h-6 flex items-center justify-center">
                                                        {conversation.unread_count_vendor}
                                                    </Badge>
                                                </div>
                                            )}
                                        </div>
                                    </Card>
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>
        </>
    );
}
