import { FC } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface FAQItem {
  question: string;
  answer: string;
}

const DEFAULT_ITEMS: FAQItem[] = [
  {
    question: "Why use vibetake for your next project?",
    answer:
      "vibetake provides a comprehensive full-stack development foundation with modern technologies like Next.js, TypeScript, Tailwind CSS, and shadcn/ui. It includes authentication, database integration, payment processing, and documentation tools, saving you weeks of setup time while ensuring best practices.",
  },
  {
    question: "Is vibetake open source?",
    answer:
      "Yes, vibetake is an open-source project. This means you can use, modify, and contribute to the codebase. We believe in transparency and community-driven development, which helps us continually improve and adapt to developers' needs.",
  },
  {
    question: "What technologies are included in vibetake?",
    answer:
      "vibetake includes Next.js 14, TypeScript, Tailwind CSS v4, shadcn/ui components, BetterAuth for authentication, Drizzle ORM with libSQL, Vercel AI SDK, Stripe integration, Zustand for state management, and Fumadocs for documentation. Everything is pre-configured and ready to use.",
  },
  {
    question: "Can I customize vibetake for my specific needs?",
    answer:
      "Absolutely! vibetake is designed to be highly customizable. You can modify components, add new features, change styling, and adapt the architecture to fit your project requirements. The clean, well-documented code makes customization straightforward.",
  },
  {
    question: "Is there a learning curve to using vibetake?",
    answer:
      "vibetake is designed to be intuitive for developers familiar with modern web development practices. If you're comfortable with React, Next.js, and TypeScript, you'll find it easy to use. We provide comprehensive documentation and examples to help you get started quickly.",
  },
];

export const FAQ: FC<{ items?: FAQItem[] }> = (props) => {
  const { items = DEFAULT_ITEMS } = props;
  return (
    <section className="bg-gradient-to-t from-zinc-50 to-white dark:from-zinc-950 dark:to-black">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl text-center mb-8">
            Frequently Asked Questions
          </h2>
          <Accordion type="single" collapsible className="space-y-4">
            {items.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="rounded-lg shadow-sm border">
                <AccordionTrigger className="px-4 py-4">
                  <span className="text-left font-medium">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 pt-2 text-gray-600">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};
