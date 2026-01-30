"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    Star,
    MagnifyingGlass,
    CheckCircle,
    XCircle,
    Flag,
    Eye,
    ChatCircle,
    ThumbsUp,
    ThumbsDown,
    User,
} from "@phosphor-icons/react";
import { Header } from "../../../components/Header";
import {
    Card,
    Button,
    Badge,
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    Avatar,
    AvatarFallback,
} from "@zora/ui-web";

// Mock reviews data
const reviews = [
    {
        id: "1",
        customer: "Sarah Johnson",
        product: "Jollof Rice Spice Mix",
        vendor: "African Spice House",
        rating: 5,
        comment: "Amazing spice blend! Takes me back home. The aroma is authentic and the flavor is perfect for my jollof rice.",
        status: "pending",
        helpful: 12,
        reported: false,
        createdAt: "2 hours ago",
    },
    {
        id: "2",
        customer: "Michael Okonkwo",
        product: "Suya Pepper",
        vendor: "Nigerian Delights",
        rating: 4,
        comment: "Good quality but could use a bit more heat. Otherwise perfect for weekend BBQ.",
        status: "approved",
        helpful: 8,
        reported: false,
        createdAt: "5 hours ago",
    },
    {
        id: "3",
        customer: "Anonymous",
        product: "Palm Oil",
        vendor: "West African Foods",
        rating: 1,
        comment: "This is fake palm oil! Don't buy from this vendor!",
        status: "flagged",
        helpful: 2,
        reported: true,
        createdAt: "1 day ago",
    },
    {
        id: "4",
        customer: "Amara Diallo",
        product: "Egusi Seeds",
        vendor: "African Spice House",
        rating: 5,
        comment: "Fresh and well packaged. Will definitely order again!",
        status: "pending",
        helpful: 5,
        reported: false,
        createdAt: "3 hours ago",
    },
    {
        id: "5",
        customer: "David Mensah",
        product: "Plantain Chips",
        vendor: "Lagos Street Food",
        rating: 3,
        comment: "Decent taste but package arrived damaged.",
        status: "approved",
        helpful: 3,
        reported: false,
        createdAt: "2 days ago",
    },
];

const statusConfig = {
    pending: { label: "Pending", variant: "warning" as const },
    approved: { label: "Approved", variant: "success" as const },
    flagged: { label: "Flagged", variant: "error" as const },
    rejected: { label: "Rejected", variant: "error" as const },
};

const StarRating = ({ rating }: { rating: number }) => (
    <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
            <Star
                key={star}
                size={16}
                weight={star <= rating ? "fill" : "duotone"}
                className={star <= rating ? "text-yellow-400" : "text-gray-300"}
            />
        ))}
    </div>
);

export default function ReviewsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [selectedReview, setSelectedReview] = useState<typeof reviews[0] | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const filteredReviews = reviews.filter(review => {
        const matchesSearch = review.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
            review.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
            review.comment.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "all" || review.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const pendingCount = reviews.filter(r => r.status === "pending").length;
    const flaggedCount = reviews.filter(r => r.status === "flagged").length;
    const avgRating = (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1);

    return (
        <>
            <Header
                title="Reviews Management"
                description="Moderate customer reviews"
            />

            <div className="p-4 sm:p-6 lg:p-8">
                {/* Stats Cards */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
                >
                    <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                <ChatCircle size={24} weight="duotone" />
                            </div>
                            <div>
                                <p className="text-white/80 text-sm">Pending Review</p>
                                <p className="text-2xl font-bold">{pendingCount}</p>
                            </div>
                        </div>
                    </Card>
                    <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                <Flag size={24} weight="duotone" />
                            </div>
                            <div>
                                <p className="text-white/80 text-sm">Flagged</p>
                                <p className="text-2xl font-bold">{flaggedCount}</p>
                            </div>
                        </div>
                    </Card>
                    <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                <Star size={24} weight="duotone" />
                            </div>
                            <div>
                                <p className="text-white/80 text-sm">Avg. Rating</p>
                                <p className="text-2xl font-bold">{avgRating}</p>
                            </div>
                        </div>
                    </Card>
                    <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                <CheckCircle size={24} weight="duotone" />
                            </div>
                            <div>
                                <p className="text-white/80 text-sm">Total Reviews</p>
                                <p className="text-2xl font-bold">{reviews.length}</p>
                            </div>
                        </div>
                    </Card>
                </motion.div>

                {/* Filters */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex flex-col sm:flex-row gap-4 mb-6"
                >
                    <div className="relative flex-1">
                        <MagnifyingGlass size={20} weight="duotone" className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search reviews..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-3 rounded-xl border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                    >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="flagged">Flagged</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </motion.div>

                {/* Reviews List */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-4"
                >
                    {filteredReviews.map((review, index) => (
                        <motion.div
                            key={review.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.05 * index }}
                        >
                            <Card className={review.status === "flagged" ? "border-red-200 bg-red-50" : ""}>
                                <div className="flex flex-col lg:flex-row gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-start gap-4">
                                            <Avatar size="md">
                                                <AvatarFallback>
                                                    {review.customer.split(" ").map(n => n[0]).join("")}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1">
                                                <div className="flex flex-wrap items-center gap-2 mb-1">
                                                    <span className="font-medium text-gray-900">{review.customer}</span>
                                                    <Badge variant={statusConfig[review.status as keyof typeof statusConfig].variant} size="sm">
                                                        {statusConfig[review.status as keyof typeof statusConfig].label}
                                                    </Badge>
                                                    {review.reported && (
                                                        <Badge variant="error" size="sm">
                                                            <Flag size={12} weight="duotone" className="mr-1" />
                                                            Reported
                                                        </Badge>
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-500 mb-2">
                                                    {review.product} • {review.vendor}
                                                </p>
                                                <div className="flex items-center gap-2 mb-3">
                                                    <StarRating rating={review.rating} />
                                                    <span className="text-sm text-gray-500">{review.createdAt}</span>
                                                </div>
                                                <p className="text-gray-700">{review.comment}</p>
                                                <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                                                    <span className="flex items-center gap-1">
                                                        <ThumbsUp size={16} weight="duotone" />
                                                        {review.helpful} helpful
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex lg:flex-col gap-2 lg:w-32">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => {
                                                setSelectedReview(review);
                                                setIsModalOpen(true);
                                            }}
                                            className="flex-1"
                                        >
                                            <Eye size={16} weight="duotone" className="mr-1" />
                                            View
                                        </Button>
                                        {review.status === "pending" && (
                                            <>
                                                <Button variant="ghost" size="sm" className="flex-1 text-green-600">
                                                    <CheckCircle size={16} weight="duotone" className="mr-1" />
                                                    Approve
                                                </Button>
                                                <Button variant="ghost" size="sm" className="flex-1 text-red-600">
                                                    <XCircle size={16} weight="duotone" className="mr-1" />
                                                    Reject
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))}

                    {filteredReviews.length === 0 && (
                        <Card className="text-center py-12">
                            <ChatCircle size={48} weight="duotone" className="text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews found</h3>
                            <p className="text-gray-500">Try adjusting your search or filters</p>
                        </Card>
                    )}
                </motion.div>
            </div>

            {/* Review Detail Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Review Details</DialogTitle>
                    </DialogHeader>
                    {selectedReview && (
                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <Avatar size="lg">
                                    <AvatarFallback>
                                        {selectedReview.customer.split(" ").map(n => n[0]).join("")}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">{selectedReview.customer}</h3>
                                    <p className="text-gray-500">{selectedReview.createdAt}</p>
                                </div>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500 mb-1">Product</p>
                                <p className="font-medium">{selectedReview.product}</p>
                                <p className="text-sm text-gray-500">{selectedReview.vendor}</p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500 mb-2">Rating</p>
                                <StarRating rating={selectedReview.rating} />
                            </div>

                            <div>
                                <p className="text-sm text-gray-500 mb-2">Review</p>
                                <p className="text-gray-700 bg-gray-50 p-4 rounded-xl">{selectedReview.comment}</p>
                            </div>

                            {selectedReview.status === "pending" && (
                                <div className="flex gap-3 pt-4 border-t">
                                    <Button className="flex-1" leftIcon={<CheckCircle className="w-4 h-4" />}>
                                        Approve
                                    </Button>
                                    <Button variant="outline" className="flex-1 text-red-600 border-red-300" leftIcon={<XCircle className="w-4 h-4" />}>
                                        Reject
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}
