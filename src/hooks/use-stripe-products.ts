import { useEffect, useState } from "react";
import Stripe from "stripe";
import { APIServer } from "@/lib/axios";

export interface Product {
  product: Stripe.Product;
  prices: Stripe.Price[];
}

export interface UseStripeProductsReturn {
  product: Product | null;
  loading: boolean;
  error: string | null;
}

export function useStripeProducts(): UseStripeProductsReturn {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    APIServer.post("/payment/product", {
      productId: "prod_T2XVYtW7SV0hPE",
    })
      .then((response) => {
        console.log("response", response.data);

        if (response.success) {
          setProduct(response.data);
        } else {
          throw new Error(response.error || "Failed to fetch products");
        }
      })
      .catch((err) => {
        console.error("Error fetching Stripe products:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch products");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return {
    product,
    loading,
    error,
  };
}
