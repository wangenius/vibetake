import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Open Source",
    id: "plan-starter",
    href: "#",
    price: { monthly: "Free", annually: "Free" },
    description: "Perfect for individual developers and small projects",
    actionTitle: "Get Started",
    features: [
      "Complete template code",
      "Basic component library",
      "Documentation and examples",
      "Community support",
    ],
    popular: false,
  },
  {
    name: "Professional",
    id: "plan-pro",
    href: "#",
    price: { monthly: "$19", annually: "$190" },
    description: "Ideal for growing teams and commercial projects",
    actionTitle: "Buy Now",
    features: [
      "Advanced component library",
      "Multiple theme templates",
      "Priority technical support",
      "Customization services",
      "Commercial license",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    id: "plan-enterprise",
    href: "#",
    price: { monthly: "$49", annually: "$490" },
    description: "For large teams and enterprise-level projects",
    actionTitle: "Contact Sales",
    features: [
      "Unlimited usage",
      "Dedicated technical consultant",
      "Custom development services",
      "24/7 priority support",
      "Private deployment",
      "Source code license",
    ],
    popular: false,
  },
];

export function PricingSection() {
  return (
    <div className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl sm:text-center">
          <h2 className="text-base font-semibold leading-7 text-muted-foreground">Pricing Plans</h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-primary sm:text-5xl">
            Choose the perfect plan for your needs
          </p>
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground sm:text-center">
          VibeCape offers flexible pricing options to suit developers and teams of all sizes. Kickstart your modern project development.
        </p>
        <div className="mt-20 flow-root">
          <div className="isolate -mt-16 grid max-w-sm grid-cols-1 gap-y-16 gap-x-4 sm:mx-auto lg:-mx-8 lg:mt-0 lg:max-w-none lg:grid-cols-3 xl:-mx-4">
            {plans.map((plan) => (
              <Card key={plan.id} className={cn("flex flex-col", plan.popular ? "ring-1 ring-primary" : "")}>
                <CardHeader>
                  <CardTitle id={plan.id} className="text-base font-semibold leading-7">
                    {plan.name}
                  </CardTitle>
                  <CardDescription className="mt-6 flex items-baseline gap-x-1">
                    <span className="text-5xl font-bold tracking-tight text-primary">{plan.price.monthly}</span>
                    <span className="text-sm font-semibold leading-6 text-muted-foreground">/month</span>
                  </CardDescription>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{plan.price.annually} billed annually</p>
                </CardHeader>
                <CardContent>
                  <p className="mt-10 text-sm font-semibold leading-6 text-primary">{plan.description}</p>
                  <ul role="list" className="mt-6 space-y-3 text-sm leading-6 text-muted-foreground">
                    {plan.features.map((feature) => (
                      <li key={feature}>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="mt-auto">
                  <Button className="w-full" aria-describedby={plan.id} asChild>
                    <a href={plan.href}>{plan.actionTitle}</a>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
