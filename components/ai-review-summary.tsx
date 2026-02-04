import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Product } from "@/lib/types";
import { summarizeReviews } from "@/lib/ai-summary";
import { FiveStarRating } from "./five-star-rating";

export async function AIReviewSummary({ product }: { product: Product }) {
  const averageRating =
    product.reviews.reduce((acc, review) => acc + review.stars, 0) /
    product.reviews.length;

  let summary: string | null = null;
  try {
    summary = await summarizeReviews(product);
  } catch (error) {
    // AI summary unavailable - show fallback UI
    console.error("AI summary unavailable:", error);
  }

  return (
    <Card className="w-full max-w-prose p-10 grid gap-10">
      <CardHeader className="items-center space-y-0 gap-4 p-0">
        <div className="grid gap-1 text-center">
          <CardTitle className="text-lg">AI Summary</CardTitle>
          <p className="text-xs text-muted-foreground">
            Based on {product.reviews.length} customer ratings
          </p>
        </div>
        <div className="bg-gray-100 px-3 rounded-full flex items-center py-2 dark:bg-gray-800">
          <FiveStarRating rating={Math.round(averageRating)} />
          <span className="text-sm ml-4 text-gray-500 dark:text-gray-400">
            {averageRating.toFixed(1)} out of 5
          </span>
        </div>
      </CardHeader>
      <CardContent className="p-0 grid gap-4">
        {summary ? (
          <p className="text-sm leading-loose text-gray-500 dark:text-gray-400">
            {summary}
          </p>
        ) : (
          <p className="text-sm leading-loose text-muted-foreground italic">
            AI summary unavailable. Please add a credit card to your Vercel account to enable this feature.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
