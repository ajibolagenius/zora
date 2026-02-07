import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    MagnifyingGlass,
    Star,
    Heart,
    ShoppingCart,
    ArrowSquareOut,
    Funnel,
    CaretUp,
    CaretDown,
} from '@phosphor-icons/react';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { cn } from '../../lib/utils';

interface SearchResultsProps {
    results: any[];
    isLoading?: boolean;
    query?: string;
    totalResults?: number;
    onProductClick?: (product: any) => void;
    onAddToCart?: (product: any) => void;
    onToggleFavorite?: (product: any) => void;
    className?: string;
}

export function SearchResults({
    results,
    isLoading,
    query,
    totalResults,
    onProductClick,
    onAddToCart,
    onToggleFavorite,
    className,
}: SearchResultsProps) {
    const [sortBy, setSortBy] = useState<'relevance' | 'price' | 'rating' | 'name'>('relevance');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [favorites, setFavorites] = useState<Set<string>>(new Set());

    const handleToggleFavorite = (productId: string) => {
        const newFavorites = new Set(favorites);
        if (newFavorites.has(productId)) {
            newFavorites.delete(productId);
        } else {
            newFavorites.add(productId);
        }
        setFavorites(newFavorites);
        onToggleFavorite?.(productId);
    };

    const sortedResults = React.useMemo(() => {
        if (!results.length) return results;

        const sorted = [...results].sort((a, b) => {
            let comparison = 0;

            switch (sortBy) {
                case 'price':
                    comparison = (a.price || 0) - (b.price || 0);
                    break;
                case 'rating':
                    comparison = (a.rating || 0) - (b.rating || 0);
                    break;
                case 'name':
                    comparison = (a.name || '').localeCompare(b.name || '');
                    break;
                case 'relevance':
                default:
                    comparison = 0; // Keep original order for relevance
                    break;
            }

            return sortOrder === 'asc' ? comparison : -comparison;
        });

        return sorted;
    }, [results, sortBy, sortOrder]);

    const renderStars = (rating: number) => {
        return (
            <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={cn(
                            "h-4 w-4",
                            star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                        )}
                    />
                ))}
                <span className="text-sm text-muted-foreground ml-1">
                    {rating?.toFixed(1) || '0.0'}
                </span>
            </div>
        );
    };

    if (isLoading) {
        return (
            <div className="space-y-4">
                {[...Array(6)].map((_, index) => (
                    <Card key={index} className="animate-pulse">
                        <CardContent className="p-4">
                            <div className="flex gap-4">
                                <div className="w-24 h-24 bg-gray-200 rounded-lg" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                                    <div className="h-3 bg-gray-200 rounded w-1/4" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    if (!results.length && query) {
        return (
            <div className="text-center py-12">
                <MagnifyingGlass className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No results found</h3>
                <p className="text-muted-foreground mb-4">
                    We couldn't find any products matching "{query}"
                </p>
                <div className="space-y-2 text-sm text-muted-foreground">
                    <p>Try:</p>
                    <ul className="list-disc list-inside space-y-1">
                        <li>Checking your spelling</li>
                        <li>Using more general terms</li>
                        <li>Browsing our categories</li>
                        <li>Looking at trending searches</li>
                    </ul>
                </div>
            </div>
        );
    }

    return (
        <div className={cn("space-y-6", className)}>
            {/* Results Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">
                        {query ? `Results for "${query}"` : 'All Products'}
                    </h2>
                    <p className="text-muted-foreground">
                        {totalResults || results.length} products found
                    </p>
                </div>

                {/* Sort Controls */}
                <div className="flex items-center gap-2">
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                        className="px-3 py-2 text-sm border rounded-md bg-background"
                    >
                        <option value="relevance">Relevance</option>
                        <option value="price">Price</option>
                        <option value="rating">Rating</option>
                        <option value="name">Name</option>
                    </select>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    >
                        {sortOrder === 'asc' ? (
                            <CaretUp className="h-4 w-4" />
                        ) : (
                            <CaretDown className="h-4 w-4" />
                        )}
                    </Button>
                </div>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedResults.map((product, index) => (
                    <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Card className="group hover:shadow-lg transition-shadow duration-200">
                            <CardHeader className="p-0">
                                <div className="relative">
                                    <img
                                        src={product.image_url || '/api/placeholder/300/200'}
                                        alt={product.name}
                                        className="w-full h-48 object-cover rounded-t-lg"
                                    />

                                    {/* Favorite Button */}
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                                        onClick={() => handleToggleFavorite(product.id)}
                                    >
                                        <Heart
                                            className={cn(
                                                "h-4 w-4",
                                                favorites.has(product.id)
                                                    ? "fill-red-500 text-red-500"
                                                    : "text-gray-600"
                                            )}
                                        />
                                    </Button>

                                    {/* Badges */}
                                    {product.is_featured && (
                                        <Badge className="absolute top-2 left-2 bg-yellow-500 text-white">
                                            Featured
                                        </Badge>
                                    )}
                                    {product.in_stock === false && (
                                        <Badge variant="destructive" className="absolute top-2 left-2">
                                            Out of Stock
                                        </Badge>
                                    )}
                                </div>
                            </CardHeader>

                            <CardContent className="p-4">
                                <div className="space-y-3">
                                    {/* Product Name */}
                                    <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
                                        {product.name}
                                    </h3>

                                    {/* Vendor */}
                                    <p className="text-sm text-muted-foreground">
                                        {product.vendor?.name || 'Unknown Vendor'}
                                    </p>

                                    {/* Rating */}
                                    {product.rating && (
                                        <div>{renderStars(product.rating)}</div>
                                    )}

                                    {/* Description */}
                                    {product.description && (
                                        <p className="text-sm text-muted-foreground line-clamp-2">
                                            {product.description}
                                        </p>
                                    )}

                                    {/* Category */}
                                    {product.category && (
                                        <Badge variant="secondary" className="text-xs">
                                            {product.category}
                                        </Badge>
                                    )}

                                    {/* Price and Actions */}
                                    <div className="flex items-center justify-between pt-2">
                                        <div>
                                            <p className="text-2xl font-bold text-primary">
                                                ${product.price?.toFixed(2) || '0.00'}
                                            </p>
                                            {product.compare_at_price && (
                                                <p className="text-sm text-muted-foreground line-through">
                                                    ${product.compare_at_price.toFixed(2)}
                                                </p>
                                            )}
                                        </div>

                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => onProductClick?.(product)}
                                            >
                                                <ArrowSquareOut className="h-4 w-4" />
                                            </Button>

                                            <Button
                                                size="sm"
                                                onClick={() => onAddToCart?.(product)}
                                                disabled={product.in_stock === false}
                                            >
                                                <ShoppingCart className="h-4 w-4 mr-1" />
                                                Add
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Load More */}
            {results.length > 0 && totalResults && results.length < totalResults && (
                <div className="text-center pt-6">
                    <Button variant="outline" size="lg">
                        Load More Products
                    </Button>
                </div>
            )}
        </div>
    );
}
