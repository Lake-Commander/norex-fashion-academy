import { Product } from "@/types";

export const products: Product[] = [
  {
    id: "1",
    slug: "crimson-evening-gown",
    name: "Crimson Evening Gown",
    price: 185000,
    category: "Evening Wear",
    description: "A breathtaking floor-length gown crafted from premium silk charmeuse. Features a dramatic open back, hand-sewn beading at the bodice, and a sweeping train. Perfect for galas, weddings, and black-tie events.",
    images: ["/product-1.png", "/product-1.png"],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Crimson", "Midnight Black", "Ivory"],
    featured: true,
    inStock: true,
    // NEW FIELDS
    additionalInfo: [
      { label: "Material", value: "100% Premium Silk Charmeuse" },
      { label: "Care Instructions", value: "Dry clean only. Do not bleach." },
      { label: "Fit", value: "True to size. Tailored bodice with a flowing skirt." },
      { label: "Origin", value: "Handcrafted in Warri, Nigeria" }
    ],
    reviews: [
      { user: "Kemi S.", rating: 5, date: "October 12, 2025", comment: "Absolutely stunning dress! The beadwork is impeccable." }
    ]
  },
  {
    id: "2",
    slug: "ivory-bridal-ensemble",
    name: "Ivory Bridal Ensemble",
    price: 320000,
    category: "Bridal",
    description: "An exquisite bridal ensemble featuring intricate lace overlay, cathedral-length veil, and a structured bodice with hand-embroidered floral details. Every stitch tells a story of timeless elegance.",
    images: ["/product-4.jpg", "/product-4.jpg"],
    sizes: ["XS", "S", "M", "L"],
    colors: ["Ivory", "Pearl White"],
    featured: true,
    inStock: true,
    // NEW FIELDS
    additionalInfo: [
      { label: "Material", value: "100% Premium Silk Charmeuse" },
      { label: "Care Instructions", value: "Dry clean only. Do not bleach." },
      { label: "Fit", value: "True to size. Tailored bodice with a flowing skirt." },
      { label: "Origin", value: "Handcrafted in Warri, Nigeria" }
    ],
    reviews: [
      { user: "Kemi S.", rating: 5, date: "October 12, 2025", comment: "Absolutely stunning dress! The beadwork is impeccable." }
    ]
  },
  {
    id: "3",
    slug: "wine-wrap-dress",
    name: "Wine Wrap Dress",
    price: 75000,
    category: "Casual Wear",
    description: "A versatile wrap dress in deep wine crepe fabric. Flattering silhouette with adjustable waist tie, flutter sleeves, and midi length. Effortlessly transitions from day to evening.",
    images: ["/product-3.png", "/product-3.png"],
    sizes: ["XS", "S", "M", "L", "XL", "2XL"],
    colors: ["Wine", "Forest Green", "Navy"],
    featured: true,
    inStock: true,
    // NEW FIELDS
    additionalInfo: [
      { label: "Material", value: "100% Premium Silk Charmeuse" },
      { label: "Care Instructions", value: "Dry clean only. Do not bleach." },
      { label: "Fit", value: "True to size. Tailored bodice with a flowing skirt." },
      { label: "Origin", value: "Handcrafted in Warri, Nigeria" }
    ],
    reviews: [
      { user: "Kemi S.", rating: 5, date: "October 12, 2025", comment: "Absolutely stunning dress! The beadwork is impeccable." }
    ]
  },
  {
    id: "4",
    slug: "structured-power-blazer",
    name: "Structured Power Blazer",
    price: 95000,
    category: "Work Wear",
    description: "A sharp, tailored blazer with clean lines and a modern cut. Premium wool-blend fabric with satin lapels. The ultimate power piece for the confident professional woman.",
    images: ["/product-5.jpeg", "/product-5.jpeg"],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Charcoal", "Ivory", "Burgundy"],
    featured: false,
    inStock: true,
    // NEW FIELDS
    additionalInfo: [
      { label: "Material", value: "100% Premium Silk Charmeuse" },
      { label: "Care Instructions", value: "Dry clean only. Do not bleach." },
      { label: "Fit", value: "True to size. Tailored bodice with a flowing skirt." },
      { label: "Origin", value: "Handcrafted in Warri, Nigeria" }
    ],
    reviews: [
      { user: "Kemi S.", rating: 5, date: "October 12, 2025", comment: "Absolutely stunning dress! The beadwork is impeccable." }
    ]
  },
  {
    id: "5",
    slug: "ankara-fusion-co-ord",
    name: "Ankara Fusion Co-ord Set",
    price: 68000,
    category: "Casual Wear",
    description: "A stunning two-piece co-ord set fusing vibrant Ankara print with contemporary tailoring. Features a cropped jacket and wide-leg trousers. Celebrating African heritage with modern flair.",
    images: ["/product-6-new.jpeg", "/product-6-new.jpeg"],
    sizes: ["S", "M", "L", "XL", "2XL"],
    colors: ["Multi-print"],
    featured: true,
    inStock: true,
    // NEW FIELDS
    additionalInfo: [
      { label: "Material", value: "100% Premium Silk Charmeuse" },
      { label: "Care Instructions", value: "Dry clean only. Do not bleach." },
      { label: "Fit", value: "True to size. Tailored bodice with a flowing skirt." },
      { label: "Origin", value: "Handcrafted in Warri, Nigeria" }
    ],
    reviews: [
      { user: "Kemi S.", rating: 5, date: "October 12, 2025", comment: "Absolutely stunning dress! The beadwork is impeccable." }
    ]
  },
  {
    id: "6",
    slug: "noir-cocktail-dress",
    name: "Noir Cocktail Dress",
    price: 112000,
    category: "Evening Wear",
    description: "A sleek knee-length cocktail dress in matte black crepe. Features an asymmetric neckline, ruched waist detail, and a subtle thigh-high slit. The perfect little black dress, elevated.",
    images: ["/product-7-new.jpeg", "/product-7-new.jpeg"],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Noir Black"],
    featured: false,
    inStock: true,
    // NEW FIELDS
    additionalInfo: [
      { label: "Material", value: "100% Premium Silk Charmeuse" },
      { label: "Care Instructions", value: "Dry clean only. Do not bleach." },
      { label: "Fit", value: "True to size. Tailored bodice with a flowing skirt." },
      { label: "Origin", value: "Handcrafted in Warri, Nigeria" }
    ],
    reviews: [
      { user: "Kemi S.", rating: 5, date: "October 12, 2025", comment: "Absolutely stunning dress! The beadwork is impeccable." }
    ]
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.featured);
}

export function getProductsByCategory(category: string): Product[] {
  return products.filter(
    (p) => p.category.toLowerCase() === category.toLowerCase()
  );
}