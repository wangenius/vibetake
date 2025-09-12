// Client-side subscription constants and types
// This file contains only data and types, no server-side imports

export const PRICE_FEATURES: Record<
  string,
  {
    id: string;
    features: string[];
  }
> = {
  free: {
    id: "free",
    features: [
      "MIT License",
      "Community Support",
      "Basic Documentation",
      "GitHub Repository Access",
    ],
  },
  community: {
    id: "price_1S6SQ12OPw3DTd5UVAvYk5wL",
    features: [
      "Everything in Open Source",
      "Priority Support",
      "Advanced Documentation",
      "Community Discord Access",
      "Monthly Office Hours",
    ],
  },
  course: {
    id: "price_1S6TyI2OPw3DTd5UKApJK8L6",
    features: [
      "Everything in Community",
      "Step-by-step Video Tutorials",
      "Project Templates",
      "Code Reviews",
      "Direct Instructor Access",
      "Certificate of Completion",
    ],
  },
};

export interface SubscriptionStatus {
  id: string;
  object: string;
  billing_thresholds: any;
  created: number;
  current_period_end: number;
  current_period_start: number;
  discounts: any[];
  metadata: Record<string, any>;
  plan: {
    id: string;
    object: string;
    active: boolean;
    amount: number;
    amount_decimal: string;
    billing_scheme: string;
    created: number;
    currency: string;
    interval: string;
    interval_count: number;
    livemode: boolean;
    metadata: Record<string, any>;
    meter: any;
    nickname: string | null;
    product: string;
    tiers_mode: any;
    transform_usage: any;
    trial_period_days: any;
    usage_type: string;
  };
  price: {
    id: string;
    object: string;
    active: boolean;
    billing_scheme: string;
    created: number;
    currency: string;
    custom_unit_amount: any;
    livemode: boolean;
    lookup_key: any;
    metadata: Record<string, any>;
    nickname: string | null;
    product: string;
    recurring: {
      interval: string;
      interval_count: number;
      meter: any;
      trial_period_days: any;
      usage_type: string;
    };
    tax_behavior: string;
    tiers_mode: any;
    transform_quantity: any;
    type: string;
    unit_amount: number;
    unit_amount_decimal: string;
  };
  quantity: number;
  subscription: string;
  tax_rates: any[];
}
