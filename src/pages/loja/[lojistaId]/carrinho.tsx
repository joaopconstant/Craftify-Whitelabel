import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/ui/header";
import { useRouter } from "next/router";
import { db } from "@/lib/firebase"; // Use db, pois o firestore não é exportado diretamente
import { doc, getDoc } from "firebase/firestore";

const Carrinho = () => {
  const [produtos, setProdutos] = useState<any[]>([]);
  const [corPrimaria, setCorPrimaria] = useState<string>("");
  const [corSecundaria, setCorSecundaria] = useState<string>("");
  const router = useRouter();
  const { lojistaId } = router.query;

  useEffect(() => {
    const fetchLojistaData = async () => {
      if (lojistaId) {
        const lojistaDocRef = doc(db, "lojista", lojistaId as string);
        const lojistaDoc = await getDoc(lojistaDocRef);
        const lojistaData = lojistaDoc.data();
        if (lojistaData) {
          setCorPrimaria(lojistaData.corPrimaria);
          setCorSecundaria(lojistaData.corSecundaria);
        }
      }
    };

    fetchLojistaData();

    const carrinho = JSON.parse(localStorage.getItem("carrinho") || "[]");
    setProdutos(carrinho);
  }, [lojistaId]);


  const removerProduto = (index: number) => {
    const carrinhoAtual = JSON.parse(localStorage.getItem("carrinho") || "[]");
    carrinhoAtual.splice(index, 1);
    localStorage.setItem("carrinho", JSON.stringify(carrinhoAtual));
    setProdutos(carrinhoAtual);
  };

  const calcularTotal = () => {
    return produtos.reduce((total, produto) => total + (produto.preco || 0), 0);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header type="loja" />
      <main className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Carrinho de Compras</h1>
        <div>
          {produtos.length === 0 ? (
            <p>Seu carrinho está vazio.</p>
          ) : (
            produtos.map((produto, index) => (
              <Card key={index} className="mb-4 p-4">
                <div className="flex gap-4">
                  <img
                    src={produto.imagem}
                    alt={produto.nome}
                    className="w-24 h-24 object-contain rounded-lg"
                  />
                  <div className="flex-1">
                    <p>{produto.nome}</p>
                    {produto.especificacoes && (
                      <p className="text-sm text-gray-500">
                        {produto.especificacoes}
                      </p>
                    )}
                    <p
                      className="text-lg font-semibold"
                      style={{ color: corSecundaria }}
                    >
                      R$ {produto.preco?.toFixed(2)}
                    </p>
                  </div>
                  <Button variant="outline" onClick={() => removerProduto(index)}>
                    Remover
                  </Button>
                </div>
              </Card>
            ))
          )}
          {produtos.length > 0 && (
            <div className="mt-6 flex justify-between">
              <h2 className="text-xl font-bold">Total</h2>
              <p className="text-xl font-bold">R$ {calcularTotal().toFixed(2)}</p>
            </div>
          )}
          <Button
            className="w-full mt-6"
            onClick={() => alert("Ir para o checkout")}
            style={{ backgroundColor: corPrimaria }}
          >
            Finalizar Pedido
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Carrinho;
