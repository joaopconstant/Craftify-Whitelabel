import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Palette, ShoppingBag, LayoutDashboard, Brush, Package, LineChart } from "lucide-react";
import Link from "next/link";
import { TestimonialCarousel } from "@/components/testimonials/testimonalsCarousel";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-primary/5 to-background pt-20 pb-32">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                Transforme seu{" "}
                <span className="bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">
                  Artesanato
                </span>{" "}
                em um Negócio Digital
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Crie sua loja online especializada em minutos e alcance clientes em todo o Brasil.
                Gerencie produtos, pedidos e personalize sua vitrine digital.
              </p>
            </div>
            <Link href="/admin/register">
              <Button size="lg" className="h-12 px-8 text-lg bg-pink-500 hover:bg-pink-600">
                Criar Minha Loja Agora
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter text-center mb-12">
            Tudo que você precisa para vender online
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-6 space-y-4 transition-all hover:shadow-lg text-center">
              <Palette className="h-12 w-12 text-pink-500 mx-auto" />
              <h3 className="text-xl font-bold">Design Personalizado</h3>
              <p className="text-muted-foreground">
                Personalize cores, layout e estilo da sua loja para combinar com sua marca
              </p>
            </Card>
            <Card className="p-6 space-y-4 transition-all hover:shadow-lg text-center">
              <ShoppingBag className="h-12 w-12 text-pink-500 mx-auto" />
              <h3 className="text-xl font-bold">Gestão de Produtos</h3>
              <p className="text-muted-foreground">
                Cadastre produtos, gerencie estoque e preços de forma simples e rápida
              </p>
            </Card>
            <Card className="p-6 space-y-4 transition-all hover:shadow-lg text-center">
              <LayoutDashboard className="h-12 w-12 text-pink-500 mx-auto" />
              <h3 className="text-xl font-bold">Painel Completo</h3>
              <p className="text-muted-foreground">
                Acompanhe vendas, pedidos e desempenho da sua loja em tempo real
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-6">
          <TestimonialCarousel />
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-zinc-100">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold tracking-tighter">
                Por que escolher nossa plataforma?
              </h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Brush className="h-6 w-6 text-pink-500" />
                  <p>Feito especialmente para artesãos e criadores</p>
                </div>
                <div className="flex items-center space-x-4">
                  <Package className="h-6 w-6 text-pink-500" />
                  <p>Integração com principais serviços de entrega</p>
                </div>
                <div className="flex items-center space-x-4">
                  <LineChart className="h-6 w-6 text-pink-500" />
                  <p>Relatórios detalhados de vendas e clientes</p>
                </div>
              </div>
              <Link href="/admin/register">
                <Button className="h-12 mt-5 px-8 bg-pink-500 hover:bg-pink-600">
                  Começar Gratuitamente
                </Button>
              </Link>
            </div>
            <div className="relative h-[400px] rounded-lg">
              <div className="absolute inset-0 flex items-center justify-center">
                <img
                  src="board-amico.svg"
                  alt="Artesão trabalhando"
                  className="object-cover rounded-lg"
                  style={{ width: "100%", height: "100%" }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-8">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
              Pronto para começar sua jornada digital?
            </h2>
            <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl">
              Junte-se a milhares de artesãos que já estão vendendo online.
              Crie sua loja agora e alcance mais clientes.
            </p>
            <Link href="/admin/register">
              <Button size="lg" className="h-12 px-8 bg-pink-500 hover:bg-pink-600">
                Criar Minha Loja
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
