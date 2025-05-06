import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";

interface TestimonialProps {
  name: string;
  business: string;
  image: string;
  testimonial: string;
}

export function TestimonialCard({
  name,
  business,
  image,
  testimonial,
}: TestimonialProps) {
  return (
    <Card className="p-6 h-full flex flex-col">
      <div className="flex items-center space-x-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
        ))}
      </div>
      <blockquote className="text-lg mb-6 flex-grow">{testimonial}</blockquote>
      <div className="flex items-center space-x-4">
        <img
          src={image}
          alt={name}
          className="rounded-full h-12 w-12 object-cover"
        />
        <div>
          <p className="font-semibold">{name}</p>
          <p className="text-sm text-muted-foreground">{business}</p>
        </div>
      </div>
    </Card>
  );
}
