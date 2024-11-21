import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Produto, Lojista } from "@/lib/types";
import Header from "@/components/ui/header";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ShoppingCart } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const ProdutoPage = () => {
  const [produto, setProduto] = useState<Produto | null>(null);
  const [lojista, setLojista] = useState<Lojista | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [customizacao, setCustomizacao] = useState<string>("");
  const router = useRouter();
  const { lojistaId, id } = router.query;

  useEffect(() => {
    if (lojistaId && id) {
      const fetchProduto = async () => {
        const docRef = doc(db, "produto", id as string);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const produtoData = docSnap.data() as Produto;
          setProduto(produtoData);

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

  const handleAdicionarAoCarrinho = () => {
    if (produto.customizavel) {
      setOpenDialog(true); // Abre o modal para customização
    } else {
      const carrinhoAtual = JSON.parse(
        localStorage.getItem("carrinho") || "[]"
      );
      carrinhoAtual.push(produto); // Adiciona o produto ao carrinho
      localStorage.setItem("carrinho", JSON.stringify(carrinhoAtual)); // Salva no localStorage
      alert(`Produto ${produto.nome} adicionado ao carrinho!`);
    }
  };

  // Depois que a customização for fornecida no modal, adicione o produto customizado no carrinho
  const handleProdutoCustomizado = (especificacoes: string) => {
    const produtoCustomizado = {
      ...produto,
      especificacoes, // Adiciona as especificações customizadas
    };
    const carrinhoAtual = JSON.parse(localStorage.getItem(`carrinho_${lojistaId}`) || "[]");
    carrinhoAtual.push(produtoCustomizado); // Adiciona o produto customizado ao carrinho
    localStorage.setItem(`carrinho_${lojistaId}`, JSON.stringify(carrinhoAtual)); // Salva no localStorage
    setOpenDialog(false); // Fecha o modal
    alert(`Produto ${produto.nome} customizado adicionado ao carrinho!`);
  };

  const handleConfirmarCustomizacao = () => {
    if (customizacao.trim() !== "") {
      handleProdutoCustomizado(customizacao); // Chama a função de adicionar produto customizado
    } else {
      alert("Por favor, forneça as especificações para customizar o produto.");
    }
  };

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
            <h1
              className="text-2xl font-bold"
              style={{ color: lojista.corSecundaria }}
            >
              R$ {produto.preco ? produto.preco.toFixed(2) : "0.00"}
            </h1>
            <Button
              className="text-lg"
              style={{
                backgroundColor: lojista.corPrimaria,
                color: "white",
              }}
              onClick={handleAdicionarAoCarrinho}
            >
              <ShoppingCart />
              Comprar
            </Button>
          </CardFooter>
        </Card>
      </main>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className=" bg-white p-6 sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Personalize seu produto</DialogTitle>
            <p>Especifique os detalhes para personalização do produto.</p>
          </DialogHeader>
          <div className="flex items-center space-x-2">
            <div className="grid flex-1 gap-2">
              <Label htmlFor="customizacao" className="sr-only">
                Personalização
              </Label>
              <Input
                id="customizacao"
                value={customizacao}
                onChange={(e) => setCustomizacao(e.target.value)}
                className="w-full p-2 mt-2 border border-gray-300 rounded"
                placeholder="Digite suas preferências"
              />
            </div>
          </div>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Fechar
              </Button>
            </DialogClose>
            <Button
              onClick={handleConfirmarCustomizacao}
              style={{
                backgroundColor: lojista.corPrimaria,
                color: "white",
              }}
            >
              <ShoppingCart />
              Adicionar ao carrinho
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProdutoPage;
