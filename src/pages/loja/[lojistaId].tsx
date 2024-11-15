import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Loja = () => {
  const router = useRouter();
  const { lojistaId } = router.query;
  const [lojista, setLojista] = useState<any>(null);
  const [produtos, setProdutos] = useState<any[]>([]);

  useEffect(() => {
    if (lojistaId) {
      const fetchLojista = async () => {
        const lojistaRef = doc(db, "lojista", lojistaId as string);
        const docSnap = await getDoc(lojistaRef);

        if (docSnap.exists()) {
          const lojistaData = docSnap.data();
          setLojista(lojistaData);

          // Buscar produtos associados ao lojista
          const produtosRef = collection(db, "produto");
          const q = query(produtosRef, where("lojistaId", "==", lojistaId));
          const querySnapshot = await getDocs(q);

          const produtosData = querySnapshot.docs.map((doc) => doc.data());
          setProdutos(produtosData);
        } else {
          console.log("Lojista não encontrado");
        }
      };

      fetchLojista();
    }
  }, [lojistaId]);

  if (!lojista) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="bg-white">
      <div className="container mx-auto p-6">
        <Card className="w-full max-w-4xl mx-auto bg-white shadow-lg">
          <CardHeader className="flex justify-between items-center">
            <img
              src={lojista.logotipo}
              alt={lojista.nome}
              className="w-32 h-auto"
            />
            <h1 className="text-3xl font-bold text-center">{lojista.nome}</h1>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <p className="text-center text-lg">{lojista.descricao}</p>
            <div className="mt-6">
              <h2 className="text-xl font-semibold">Produtos</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                {produtos.length > 0 ? (
                  produtos.map((produto, index) => (
                    <Card
                      key={index}
                      className="w-full max-w-xs mx-auto bg-white shadow-lg"
                    >
                      <CardHeader>
                        <h3 className="font-bold text-center">
                          {produto.nome}
                        </h3>
                      </CardHeader>
                      <CardContent className="p-4">
                        <img
                          src={produto.imagem}
                          alt={produto.nome}
                          className="w-full h-48 object-cover rounded-lg mb-5"
                        />
                        <p className="text-center">{produto.descricao}</p>
                        <Button
                          className="mt-4"
                          style={{
                            backgroundColor: lojista.corPrimaria,
                            color: "white",
                          }}
                          onClick={() =>
                            alert(`Visualizar produto: ${produto.nome}`)
                          }
                        >
                          Ver Detalhes
                        </Button>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <p className="text-center text-lg">
                    Nenhum produto disponível
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Loja;
