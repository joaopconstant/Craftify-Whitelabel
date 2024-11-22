import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { TestimonialCard } from "@/components/testimonials/testimonialsCard";

const testimonials = [
  {
    name: "Ana Silva",
    business: "Arte em Cerâmica",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80",
    testimonial: "Desde que comecei a usar a plataforma, minhas vendas aumentaram 300%. A facilidade de gerenciar os pedidos e personalizar minha loja é incrível!"
  },
  {
    name: "Carlos Santos",
    business: "Madeira & Arte",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80",
    testimonial: "A melhor decisão que tomei para meu negócio. O painel administrativo é intuitivo e as ferramentas de marketing ajudaram a expandir minha clientela."
  },
  {
    name: "Mariana Costa",
    business: "Bijuterias Artesanais",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80",
    testimonial: "Impressionante como é fácil gerenciar meu estoque e processar pedidos. O suporte ao cliente é excepcional!"
  },
  {
    name: "Pedro Oliveira",
    business: "Tecelagem Manual",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80",
    testimonial: "A plataforma transformou meu pequeno negócio em uma marca reconhecida. As ferramentas de personalização são fantásticas!"
  },
  {
    name: "Beatriz Lima",
    business: "Arte em Vidro",
    image: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?auto=format&fit=crop&q=80",
    testimonial: "Nunca foi tão fácil vender meu artesanato online. A integração com os serviços de entrega é perfeita!"
  }
];

export function TestimonialCarousel() {
  return (
    <section className="py-20 bg-zinc-100">
      <div className="container px-4 md:px-6">
        <h2 className="text-3xl font-bold tracking-tighter text-center mb-12">
          O que nossos artesãos dizem
        </h2>
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={index} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                <div className="h-full">
                  <TestimonialCard {...testimonial} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="hidden md:flex">
            <CarouselPrevious className="relative left-0 translate-x-0 translate-y-10 hover:bg-primary hover:text-white" />
            <CarouselNext className="relative right-0 translate-x-0 translate-y-10 hover:bg-primary hover:text-white" />
          </div>
        </Carousel>
      </div>
    </section>
  );
}