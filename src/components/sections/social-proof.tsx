import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

type Testimonial = {
  body: string;
  author: {
    name: string;
    handle: string;
    imageUrl: string;
  };
};

const testimonials = [
  {
    body: "VibeCape saved me weeks of setup time. The authentication, database, and payment integrations work flawlessly out of the box. I launched my SaaS in record time!",
    author: {
      name: "Emily Chen",
      handle: "emilychen_dev",
      imageUrl: "https://ui.convertfa.st/avatars/avatar-1.svg",
    },
  },
  {
    body: "The code quality in VibeCape is exceptional. Clean TypeScript, well-structured components, and excellent documentation. It's like having a senior developer on your team.",
    author: {
      name: "Marcus Johnson",
      handle: "marcusj_code",
      imageUrl: "https://ui.convertfa.st/avatars/avatar-2.svg",
    },
  },
  {
    body: "As a startup founder, I needed to move fast without compromising quality. VibeCape gave me the perfect foundation with modern tech stack and best practices built-in.",
    author: {
      name: "Sarah Thompson",
      handle: "sarahT_startup",
      imageUrl: "https://ui.convertfa.st/avatars/avatar-3.svg",
    },
  },
  {
    body: "The integration of Stripe, authentication, and database is seamless. I've never seen a template this comprehensive and well-thought-out. Highly recommended for any serious project.",
    author: {
      name: "Dr. Aisha Patel",
      handle: "dr_aisha_tech",
      imageUrl: "https://ui.convertfa.st/avatars/avatar-4.svg",
    },
  },
  {
    body: "VibeCape's architecture is production-ready from day one. The performance optimizations and security considerations are top-notch. It's saved our team months of development.",
    author: {
      name: "Robert Yamamoto",
      handle: "robyam_arch",
      imageUrl: "https://ui.convertfa.st/avatars/avatar-5.svg",
    },
  },
  {
    body: "The developer experience with VibeCape is outstanding. Hot reload, TypeScript support, and excellent tooling make development a joy. Best template I've ever used!",
    author: {
      name: "Olivia Foster",
      handle: "livfoster_dev",
      imageUrl: "https://ui.convertfa.st/avatars/avatar-6.svg",
    },
  },
];

const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => (
  <Card className="my-4">
    <CardContent className="pt-6">
      <blockquote>
        <p>"{testimonial.body}"</p>
      </blockquote>
      <div className="mt-6 flex items-center gap-x-4">
        <Avatar>
          <AvatarImage
            src={testimonial.author.imageUrl}
            alt={testimonial.author.name}
          />
          <AvatarFallback>{testimonial.author.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <div className="font-semibold">{testimonial.author.name}</div>
          <div className="text-zinc-600">@{testimonial.author.handle}</div>
        </div>
      </div>
    </CardContent>
  </Card>
);

const TestimonialsGrid = ({
  testimonials,
}: {
  testimonials: Testimonial[];
}) => (
  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    {testimonials.map((testimonial) => (
      <TestimonialCard
        key={testimonial.author.handle}
        testimonial={testimonial}
      />
    ))}
  </div>
);

export function SocialProof() {
  return (
    <div className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center my-8">
          <div className="text-sm font-semibold uppercase tracking-wide">
            Developer Testimonials
          </div>
          <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Loved by Developers Worldwide
          </h2>
        </div>
        <TestimonialsGrid testimonials={testimonials} />
      </div>
    </div>
  );
}
