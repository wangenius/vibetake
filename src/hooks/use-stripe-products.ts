import { useEffect, useState } from "react";
import { APIServer } from "@/lib/axios";
import Stripe from "stripe";

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

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await APIServer.post("/payment/product", {
        productId: "prod_T2XVYtW7SV0hPE",
      });
      console.log("response", response.data);

      if (response.success) {
        setProduct(response.data);
      } else {
        throw new Error(response.error || "Failed to fetch products");
      }
    } catch (err) {
      console.error("Error fetching Stripe products:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, []);

  return {
    product,
    loading,
    error,
  };
}
