"use client";

import { use, useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowLeft,
    PaperPlaneTilt,
    User,
    Clock,
    WarningCircle,
    Package,
    DotsThreeVertical,
    Phone,
    Envelope,
} from "@phosphor-icons/react";
import { Header } from "../../../../components/Header";
import {
    Button,
    Input,
    Card,
    Badge,
    SkeletonCard,
} from "@zora/ui-web";
import {
    useAuth,
    useVendorConversations,
    useVendorMessages,
    useSendVendorMessage,
    useMarkMessagesRead,
} from "../../../../hooks";
import { format, isToday, isYesterday, isSameDay } from "date-fns";

export default function ConversationPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const conversationId = resolvedParams.id;
    const router = useRouter();
    const { vendor } = useAuth();
    const [messageText, setMessageText] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Fetch conversation details
    const { data: conversations } = useVendorConversations(vendor?.id ?? null);
    const conversation = conversations?.find((c) => c.id === conversationId);

    // Fetch messages
    const {
        data: messages,
        isLoading,
        isError,
        refetch,
    } = useVendorMessages(conversationId);

    // Mutations
    const sendMessageMutation = useSendVendorMessage();
    const markReadMutation = useMarkMessagesRead();

    // Mark messages as read when conversation is opened
    useEffect(() => {
        if (conversationId && vendor?.id && conversation?.unread_count_vendor > 0) {
            markReadMutation.mutate({ conversationId, vendorId: vendor.id });
        }
    }, [conversationId, vendor?.id, conversation?.unread_count_vendor]);

    // Scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = async () => {
        if (!messageText.trim() || !vendor?.id) return;

        try {
            await sendMessageMutation.mutateAsync({
                conversationId,
                vendorId: vendor.id,
                text: messageText.trim(),
            });
            setMessageText("");
            inputRef.current?.focus();
        } catch (error) {
            console.error("Failed to send message:", error);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const formatMessageTime = (dateStr: string) => {
        try {
            const date = new Date(dateStr);
            return format(date, "h:mm a");
        } catch {
            return "";
        }
    };

    const formatDateHeader = (dateStr: string) => {
        try {
            const date = new Date(dateStr);
            if (isToday(date)) return "Today";
            if (isYesterday(date)) return "Yesterday";
            return format(date, "MMMM d, yyyy");
        } catch {
            return "";
        }
    };

    const shouldShowDateHeader = (currentMsg: any, prevMsg: any) => {
        if (!prevMsg) return true;
        return !isSameDay(new Date(currentMsg.created_at), new Date(prevMsg.created_at));
    };

    if (!conversation && !isLoading) {
        return (
            <>
                <Header title="Conversation" description="Not found" />
                <div className="p-8">
                    <Card className="p-8 text-center">
                        <WarningCircle size={48} weight="duotone" className="mx-auto mb-4 text-red-500" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Conversation not found</h3>
                        <p className="text-gray-500 mb-4">This conversation doesn't exist or you don't have access to it.</p>
                        <Link href="/messages">
                            <Button>Back to Messages</Button>
                        </Link>
                    </Card>
                </div>
            </>
        );
    }

    return (
        <div className="flex flex-col h-[calc(100vh-4rem)]">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-4">
                <Link href="/messages" className="lg:hidden">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft size={20} weight="duotone" />
                    </Button>
                </Link>

                {/* Customer Info */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                        {conversation?.customer?.avatar_url ? (
                            <Image
                                src={conversation.customer.avatar_url}
                                alt={conversation.customer.full_name || "Customer"}
                                width={40}
                                height={40}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-primary/10">
                                <User size={20} weight="duotone" className="text-primary" />
                            </div>
                        )}
                    </div>
                    <div className="min-w-0">
                        <h2 className="font-semibold text-gray-900 truncate">
                            {conversation?.customer?.full_name || "Customer"}
                        </h2>
                        <p className="text-sm text-gray-500 truncate">
                            {conversation?.customer?.email || ""}
                        </p>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    {conversation?.order && (
                        <Link href={`/orders?id=${conversation.order.id}`}>
                            <Badge variant="outline" className="cursor-pointer hover:bg-gray-50">
                                <Package size={12} weight="duotone" className="mr-1" />
                                Order #{conversation.order.id.slice(0, 8)}
                            </Badge>
                        </Link>
                    )}
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                {isLoading && (
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <SkeletonCard key={i} />
                        ))}
                    </div>
                )}

                {isError && (
                    <div className="text-center py-8">
                        <WarningCircle size={48} weight="duotone" className="mx-auto mb-4 text-red-500" />
                        <p className="text-gray-500 mb-4">Failed to load messages</p>
                        <Button onClick={() => refetch()} size="sm">
                            Try Again
                        </Button>
                    </div>
                )}

                {!isLoading && !isError && messages && (
                    <div className="space-y-4 max-w-3xl mx-auto">
                        <AnimatePresence>
                            {messages.map((message, index) => {
                                const isVendor = message.sender_type === "vendor";
                                const showDateHeader = shouldShowDateHeader(message, messages[index - 1]);

                                return (
                                    <div key={message.id}>
                                        {/* Date Header */}
                                        {showDateHeader && (
                                            <div className="flex justify-center my-4">
                                                <span className="px-3 py-1 bg-gray-200 text-gray-600 text-xs rounded-full">
                                                    {formatDateHeader(message.created_at)}
                                                </span>
                                            </div>
                                        )}

                                        {/* Message Bubble */}
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className={`flex items-end gap-2 ${isVendor ? "justify-end" : "justify-start"}`}
                                        >
                                            {/* Customer Avatar */}
                                            {!isVendor && (
                                                <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                                                    {message.sender_avatar ? (
                                                        <Image
                                                            src={message.sender_avatar}
                                                            alt={message.sender_name || ""}
                                                            width={32}
                                                            height={32}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <User size={16} weight="duotone" className="text-gray-400" />
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {/* Message Content */}
                                            <div
                                                className={`max-w-[75%] px-4 py-2 rounded-2xl ${isVendor
                                                        ? "bg-primary text-white rounded-br-sm"
                                                        : "bg-white text-gray-900 rounded-bl-sm shadow-sm"
                                                    }`}
                                            >
                                                <p className="whitespace-pre-wrap break-words">{message.text}</p>
                                                <p
                                                    className={`text-xs mt-1 ${isVendor ? "text-white/70" : "text-gray-400"
                                                        }`}
                                                >
                                                    {formatMessageTime(message.created_at)}
                                                    {message.read_at && isVendor && " · Read"}
                                                </p>
                                            </div>
                                        </motion.div>
                                    </div>
                                );
                            })}
                        </AnimatePresence>
                        <div ref={messagesEndRef} />
                    </div>
                )}

                {!isLoading && !isError && messages?.length === 0 && (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                            <PaperPlaneTilt size={32} weight="duotone" className="text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No messages yet</h3>
                        <p className="text-gray-500">Send a message to start the conversation</p>
                    </div>
                )}
            </div>

            {/* Message Input */}
            <div className="bg-white border-t border-gray-200 p-4">
                <div className="max-w-3xl mx-auto flex items-center gap-3">
                    <Input
                        ref={inputRef}
                        placeholder="Type your message..."
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        onKeyDown={handleKeyPress}
                        className="flex-1"
                    />
                    <Button
                        onClick={handleSendMessage}
                        disabled={!messageText.trim() || sendMessageMutation.isPending}
                        loading={sendMessageMutation.isPending}
                    >
                        <PaperPlaneTilt size={16} weight="duotone" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
