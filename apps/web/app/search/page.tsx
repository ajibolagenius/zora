import React, { useState } from 'react';
import { Metadata } from 'next';
import { AdvancedSearch } from '../../components/search/AdvancedSearch';
import { SearchResults } from '../../components/search/SearchResults';
import { generatePageMetaTags } from '../../lib/metaTags';

export const metadata: Metadata = generatePageMetaTags({
  title: 'Search African Products | Zora Marketplace',
  description: 'Discover authentic African products, food, clothing, crafts, and more. Advanced search with filters and recommendations.',
  keywords: 'African products, search, marketplace, jollof rice, egusi soup, african clothing, crafts',
});

export default function SearchPage() {
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [currentQuery, setCurrentQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (query: string, results: any[]) => {
    setCurrentQuery(query);
    setSearchResults(results);
  };

  const handleProductClick = (product: any) => {
    // Navigate to product detail page
    window.location.href = `/products/${product.id}`;
  };

  const handleAddToCart = (product: any) => {
    // Add to cart logic
    console.log('Adding to cart:', product.name);
  };

  const handleToggleFavorite = (productId: string) => {
    // Toggle favorite logic
    console.log('Toggle favorite:', productId);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Search Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-center mb-2">
              Search African Marketplace
            </h1>
            <p className="text-muted-foreground text-center mb-6">
              Discover authentic African products from local vendors
            </p>
            
            <AdvancedSearch
              onSearch={handleSearch}
              placeholder="Search for jollof rice, african fabrics, crafts, and more..."
              showFilters={true}
              maxResults={20}
            />
          </div>
        </div>
      </div>

      {/* Search Results */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <SearchResults
            results={searchResults}
            isLoading={isLoading}
            query={currentQuery}
            totalResults={searchResults.length}
            onProductClick={handleProductClick}
            onAddToCart={handleAddToCart}
            onToggleFavorite={handleToggleFavorite}
          />
        </div>
      </div>
    </div>
  );
}
