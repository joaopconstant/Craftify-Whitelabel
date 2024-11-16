import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { collection, getDocs, query, doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Header from "@/components/ui/header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const LojaHome = () => {
  const [produtos, setProdutos] = useState<any[]>([]);
  const [lojista, setLojista] = useState<any | null>(null);
  const router = useRouter();
  const { lojistaId } = router.query;

  useEffect(() => {
    if (lojistaId) {
      // Fetch produtos
      const fetchProdutos = async () => {
        const produtosRef = collection(db, "produto");
        const q = query(produtosRef);
        const querySnapshot = await getDocs(q);

        const produtosData = querySnapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((produto) => produto.lojistaId === lojistaId);

        setProdutos(produtosData);
      };

      // Fetch lojista
      const fetchLojista = async () => {
        const docRef = doc(db, "lojista", lojistaId as string);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setLojista(docSnap.data());
        }
      };

      fetchProdutos();
      fetchLojista();
    }
  }, [lojistaId]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header type="loja" />
      <main className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Produtos</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {produtos.length > 0 ? (
            produtos.map((produto) => (
              <Card key={produto.id} className="p-4 shadow-lg max-w-4xl">
                <img
                  src={produto.imagem}
                  alt={produto.nome}
                  className="w-full h-48 object-cover rounded-t-md"
                />
                <div className="mt-4">
                  <h2 className="text-lg font-bold">{produto.nome}</h2>
                  <p className="text-sm text-gray-600">{produto.descricao}</p>
                  <p
                    className="text-xl font-semibold mt-2"
                    style={{
                      color: lojista?.corSecundaria || "blue", // Cor secundária
                    }}
                  >
                    R$ {produto.preco.toFixed(2)}
                  </p>
                  <Button
                    className="mt-4 w-full"
                    style={{
                      backgroundColor: lojista?.corPrimaria || "gray", // Cor primária
                      color: "white",
                    }}
                    onClick={() =>
                      alert(`Adicionar ao carrinho: ${produto.nome}`)
                    }
                  >
                    Adicionar ao Carrinho
                  </Button>
                </div>
              </Card>
            ))
          ) : (
            <p className="text-gray-600 text-center col-span-full">
              Nenhum produto disponível no momento.
            </p>
          )}
        </div>
      </main>
    </div>
  );
};

export default LojaHome;
