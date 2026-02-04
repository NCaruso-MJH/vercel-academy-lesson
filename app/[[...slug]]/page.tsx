import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FiveStarRating } from "@/components/five-star-rating";
import { FilterableReviews } from "@/components/filterable-reviews";
import { ThemeSelector } from "@/components/theme-selector";
import { getProduct, getProducts } from "@/lib/sample-data";

export default async function Page({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug } = await params;

  // No slug = homepage
  if (!slug || slug.length === 0) {
    return <HomePage />;
  }

  // Two segments = product page
  if (slug.length === 2) {
    const [category, productId] = slug;
    return <ProductPage category={category} productId={productId} />;
  }

  // Any other path length = 404
  notFound();
}

function HomePage() {
  const products = getProducts();

  function averageRating(reviews: { stars: number }[]) {
    if (reviews.length === 0) return 0;
    return reviews.reduce((sum, r) => sum + r.stars, 0) / reviews.length;
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center gap-4">
          <ThemeSelector />
          <h1 className="text-4xl font-bold">Product Reviews</h1>
        </div>

        <div className="grid gap-4">
          {products.map((product) => (
            <Link key={product.slug} href={`/${product.category}/${product.slug}`}>
              <Card className="hover:border-primary transition-colors cursor-pointer">
                <CardHeader>
                  <CardTitle>{product.name}</CardTitle>
                  <div className="flex items-center gap-2">
                    <FiveStarRating rating={Math.round(averageRating(product.reviews))} />
                    <span className="text-sm text-muted-foreground">
                      {product.reviews.length} reviews
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {product.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}

function ProductPage({ category, productId }: { category: string; productId: string }) {
  let product;
  try {
    product = getProduct(productId);
    if (product.category !== category) {
      notFound();
    }
  } catch {
    notFound();
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <p className="text-sm text-muted-foreground uppercase tracking-wide">
            {product.category}
          </p>
          <div className="flex items-center gap-4">
            <ThemeSelector />
            <h1 className="text-4xl font-bold">{product.name}</h1>
          </div>
          <p className="text-lg text-muted-foreground mt-2">
            {product.description}
          </p>
        </div>

        <FilterableReviews product={product} />
      </div>
    </main>
  );
}

export function generateStaticParams() {
  const products = getProducts();

  return [
    // Homepage (empty slug)
    { slug: undefined },
    // Product pages
    ...products.map((product) => ({
      slug: [product.category, product.slug],
    })),
  ];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;

  // Homepage
  if (!slug || slug.length === 0) {
    return {
      title: "Product Reviews",
      description: "Browse customer reviews for our products",
    };
  }

  // Product page
  if (slug.length === 2) {
    const [, productId] = slug;
    try {
      const product = getProduct(productId);
      return {
        title: `${product.name} - Customer Reviews`,
        description: product.description,
      };
    } catch {
      return { title: "Product Not Found" };
    }
  }

  return { title: "Not Found" };
}
