import { useState, useEffect, useMemo } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, Grid3X3, List, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import ProductCard from '@/components/ProductCard';
import { categories, sampleProducts } from '@/data/products';
import type { ProductCategory } from '@/types';

const sortOptions = [
  { value: 'newest', label: 'Newest Arrivals' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'rating', label: 'Highest Rated' },
];

export default function Products() {
  const { category } = useParams<{ category?: string }>();
  const [_searchParams, _setSearchParams] = useSearchParams();
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [selectedCategory, setSelectedCategory] = useState<string>(
    category || 'all'
  );
  const [sortBy, setSortBy] = useState('newest');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Update selected category when URL param changes
  useEffect(() => {
    if (category) {
      setSelectedCategory(category as ProductCategory);
    } else {
      setSelectedCategory('all');
    }
  }, [category]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let products = sampleProducts.filter((p) => p.isActive);

    // Filter by category
    if (selectedCategory !== 'all') {
      products = products.filter((p) => p.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.tags.some((t) => t.toLowerCase().includes(query))
      );
    }

    // Filter by price
    products = products.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    // Sort
    switch (sortBy) {
      case 'price-asc':
        products.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        products.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        products.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'popular':
        products.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      case 'rating':
        products.sort((a, b) => b.rating - a.rating);
        break;
    }

    return products;
  }, [selectedCategory, searchQuery, priceRange, sortBy]);

  const activeFiltersCount =
    (selectedCategory !== 'all' ? 1 : 0) +
    (searchQuery ? 1 : 0) +
    (priceRange[0] > 0 || priceRange[1] < 1000 ? 1 : 0);

  const clearFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setPriceRange([0, 1000]);
    setSortBy('newest');
  };

  const currentCategoryName = selectedCategory !== 'all'
    ? categories.find((c) => c.id === selectedCategory)?.name
    : 'All Products';

  return (
    <div className="min-h-screen bg-black pt-24 pb-16">
      {/* Header */}
      <div className="section-padding mb-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <p className="text-gold uppercase tracking-[0.2em] text-sm mb-2">
              {filteredProducts.length} Products
            </p>
            <h1 className="font-display text-4xl md:text-5xl text-white">
              {currentCategoryName}
            </h1>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-gold"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="section-padding mb-8">
        <div className="flex flex-wrap items-center gap-4">
          {/* Mobile Filter Button */}
          <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                className="lg:hidden border-white/20 text-white hover:bg-white/5"
              >
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Filters
                {activeFiltersCount > 0 && (
                  <span className="ml-2 w-5 h-5 bg-gold text-black text-xs rounded-full flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 bg-black/98 border-r border-white/10">
              <SheetHeader>
                <SheetTitle className="text-white">Filters</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                {/* Mobile: Categories */}
                <div>
                  <h4 className="text-white font-medium mb-3">Categories</h4>
                  <div className="space-y-2">
                    <button
                      onClick={() => setSelectedCategory('all')}
                      className={`w-full text-left px-3 py-2 rounded transition-colors ${
                        selectedCategory === 'all'
                          ? 'bg-gold/20 text-gold'
                          : 'text-white/70 hover:bg-white/5'
                      }`}
                    >
                      All Products
                    </button>
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id as string)}
                        className={`w-full text-left px-3 py-2 rounded transition-colors ${
                          selectedCategory === cat.id
                            ? 'bg-gold/20 text-gold'
                            : 'text-white/70 hover:bg-white/5'
                        }`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mobile: Price Range */}
                <div>
                  <h4 className="text-white font-medium mb-3">Price Range</h4>
                  <Slider
                    value={priceRange}
                    onValueChange={(value) => setPriceRange(value as [number, number])}
                    max={1000}
                    step={10}
                    className="mb-4"
                  />
                  <div className="flex justify-between text-white/60 text-sm">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* Desktop: Category Pills */}
          <div className="hidden lg:flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-full text-sm transition-all ${
                selectedCategory === 'all'
                  ? 'bg-gold text-black'
                  : 'bg-white/5 text-white/70 hover:bg-white/10'
              }`}
            >
              All
            </button>
            {categories.slice(0, 6).map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as string)}
                className={`px-4 py-2 rounded-full text-sm transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-gold text-black'
                    : 'bg-white/5 text-white/70 hover:bg-white/10'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className="flex-1" />

          {/* Sort & View */}
          <div className="flex items-center gap-3">
            {/* Sort Dropdown */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-44 bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-black/95 border-white/10">
                {sortOptions.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className="text-white hover:bg-white/5 focus:bg-white/5"
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* View Mode Toggle */}
            <div className="hidden sm:flex items-center bg-white/5 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'grid' ? 'bg-gold text-black' : 'text-white/60 hover:text-white'
                }`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'list' ? 'bg-gold text-black' : 'text-white/60 hover:text-white'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Active Filters */}
        {activeFiltersCount > 0 && (
          <div className="flex items-center gap-2 mt-4 flex-wrap">
            {selectedCategory !== 'all' && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-gold/10 text-gold text-sm rounded-full">
                {categories.find((c) => c.id === selectedCategory)?.name}
                <button
                  onClick={() => setSelectedCategory('all')}
                  className="hover:text-gold-light"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-gold/10 text-gold text-sm rounded-full">
                Search: {searchQuery}
                <button
                  onClick={() => setSearchQuery('')}
                  className="hover:text-gold-light"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {(priceRange[0] > 0 || priceRange[1] < 1000) && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-gold/10 text-gold text-sm rounded-full">
                ${priceRange[0]} - ${priceRange[1]}
                <button
                  onClick={() => setPriceRange([0, 1000])}
                  className="hover:text-gold-light"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            <button
              onClick={clearFilters}
              className="text-white/50 hover:text-white text-sm underline"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Products Grid */}
      <div className="section-padding">
        {filteredProducts.length > 0 ? (
          <div
            className={`grid gap-6 ${
              viewMode === 'grid'
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                : 'grid-cols-1'
            }`}
          >
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/5 flex items-center justify-center">
              <Search className="w-8 h-8 text-white/30" />
            </div>
            <h3 className="font-display text-2xl text-white mb-2">No products found</h3>
            <p className="text-white/60 mb-6">Try adjusting your filters or search query</p>
            <Button onClick={clearFilters} variant="outline" className="border-white/20 text-white hover:bg-white/5">
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
