"use client";

import { useState } from "react";
import { Star, X } from "lucide-react";
import { Product } from "@/lib/types";
import { Review } from "./review";
import { Separator } from "./ui/separator";

function StarFilter({
  selectedRatings,
  onToggleRating,
  onClearAll,
  reviewCounts,
}: {
  selectedRatings: Set<number>;
  onToggleRating: (rating: number) => void;
  onClearAll: () => void;
  reviewCounts: Record<number, number>;
}) {
  const hasSelections = selectedRatings.size > 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm">Filter by Rating</h3>
        {hasSelections && (
          <button
            onClick={onClearAll}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Clear all
          </button>
        )}
      </div>
      {[5, 4, 3, 2, 1].map((rating) => {
        const isSelected = selectedRatings.has(rating);
        const count = reviewCounts[rating] || 0;

        return (
          <button
            key={rating}
            onClick={() => onToggleRating(rating)}
            className={`flex items-center justify-between w-full px-3 py-2 rounded-lg border transition-all ${
              isSelected
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card border-border hover:bg-accent"
            }`}
          >
            <div className="flex items-center gap-2">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < rating
                        ? isSelected
                          ? "fill-primary-foreground text-primary-foreground"
                          : "fill-yellow-400 text-yellow-400"
                        : isSelected
                          ? "fill-primary-foreground/30 text-primary-foreground/30"
                          : "fill-gray-200 text-gray-200"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm">({count})</span>
            </div>
            {isSelected && <X className="h-4 w-4" />}
          </button>
        );
      })}
    </div>
  );
}

export function FilterableReviews({ product }: { product: Product }) {
  const [selectedRatings, setSelectedRatings] = useState<Set<number>>(
    new Set()
  );

  const reviewCounts = product.reviews.reduce(
    (acc, review) => {
      acc[review.stars] = (acc[review.stars] || 0) + 1;
      return acc;
    },
    {} as Record<number, number>
  );

  const handleToggleRating = (rating: number) => {
    setSelectedRatings((prev) => {
      const next = new Set(prev);
      if (next.has(rating)) {
        next.delete(rating);
      } else {
        next.add(rating);
      }
      return next;
    });
  };

  const handleClearAll = () => {
    setSelectedRatings(new Set());
  };

  const filteredReviews =
    selectedRatings.size > 0
      ? product.reviews.filter((review) => selectedRatings.has(review.stars))
      : product.reviews;

  const selectedRatingsText = Array.from(selectedRatings)
    .sort((a, b) => b - a)
    .join(", ");

  return (
    <div className="flex gap-8">
      <div className="w-48 flex-shrink-0">
        <StarFilter
          selectedRatings={selectedRatings}
          onToggleRating={handleToggleRating}
          onClearAll={handleClearAll}
          reviewCounts={reviewCounts}
        />
      </div>

      <div className="flex-1 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Customer Reviews</h2>
          {selectedRatings.size > 0 && (
            <p className="text-sm text-muted-foreground">
              Showing {filteredReviews.length} of {product.reviews.length}{" "}
              reviews
            </p>
          )}
        </div>

        {filteredReviews.length === 0 ? (
          <p className="text-muted-foreground py-8 text-center">
            No {selectedRatingsText}-star reviews yet.
          </p>
        ) : (
          <div className="space-y-6">
            {filteredReviews.map((review, index) => (
              <div key={index}>
                <Review review={review} />
                {index < filteredReviews.length - 1 && (
                  <Separator className="mt-6" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
