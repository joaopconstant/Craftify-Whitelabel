import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Produto, Lojista } from "@/lib/types";
import Header from "@/components/ui/header";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ShoppingCart } from "lucide-react";

const ProdutoPage = () => {
  const [produto, setProduto] = useState<Produto | null>(null);
  const [lojista, setLojista] = useState<Lojista | null>(null);
  const router = useRouter();
  const { lojistaId, id } = router.query;

  useEffect(() => {
    if (lojistaId && id) {
      // Fetch produto
      const fetchProduto = async () => {
        const docRef = doc(db, "produto", id as string);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const produtoData = docSnap.data() as Produto;
          setProduto(produtoData);

          // Fetch lojista relacionado ao produto
          const lojistaRef = doc(db, "lojista", lojistaId as string);
          const lojistaSnap = await getDoc(lojistaRef);
          if (lojistaSnap.exists()) {
            setLojista(lojistaSnap.data() as Lojista);
          }
        }
      };

      fetchProduto();
    }
  }, [lojistaId, id]);

  if (!produto || !lojista) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <p>Carregando produto...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header type="loja" />
      <main className="container mx-auto p-6 flex justify-center">
        <Card className="max-w-4xl">
        <Button
              size={"icon"}
              variant={"ghost"}
              onClick={() => router.push(`/loja/${lojistaId}/produto`)}
            >
              <ChevronLeft />
            </Button>
          <CardHeader>
            <CardTitle className="text-3xl">{produto.nome}</CardTitle>
            <CardDescription className="text-base">
              {produto.descricao}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col md:flex-row gap-10">
            <img
              src={produto.imagem}
              alt={produto.nome}
              className="w-auto h-auto max-h-80 object-contain rounded-lg"
            />
            <div className="flex-col mt-4 md:mt-0">
              <CardDescription style={{ whiteSpace: "pre-wrap" }}>
                {produto.detalhes}
              </CardDescription>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <h1 className="text-2xl font-bold" style={{ color: lojista.corSecundaria }}>R$ {produto.preco ? produto.preco.toFixed(2) : "0.00"}</h1>
            <Button
              className="text-lg"
              style={{
                backgroundColor: lojista.corPrimaria,
                color: "white",
              }}
              onClick={() =>
                alert(`Produto ${produto.nome} adicionado ao carrinho!`)
              }
            >
              <ShoppingCart />
              Comprar
            </Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
};

export default ProdutoPage;
