import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Header from "@/components/ui/header";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { HandHeart, Truck, ShieldCheck } from "lucide-react";

const LojaHome = () => {
  const [boasVindas, setBoasVindas] = useState<string | null>(null);
  const [lojistaNome, setLojistaNome] = useState<string | null>(null);
  const [corSecundaria, setCorSecundaria] = useState<string>("#f3f4f6");
  const router = useRouter();
  const { lojistaId } = router.query;

  useEffect(() => {
    const fetchLojistaData = async () => {
      if (lojistaId) {
        const docRef = doc(db, "lojista", lojistaId as string);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setBoasVindas(data.boasVindas || "Bem-vindo à nossa loja!");
          setLojistaNome(data.nome);
          setCorSecundaria(data.corSecundaria || "#f3f4f6");
        }
      }
    };

    fetchLojistaData();
  }, [lojistaId]);

  return (
    <div>
      {/* Header */}
      <Header type="loja" />

      {/* Conteúdo Principal */}
      <div className="p-6 text-center">
        <h1 className="text-3xl font-bold text-gray-800">{lojistaNome}</h1>
        <p
          className="mt-4 text-lg text-gray-600 whitespace-pre-line"
          style={{ whiteSpace: "pre-line" }}
        >
          {boasVindas}
        </p>

        <div className="mt-8 flex justify-center gap-8 flex-wrap">
          <Card className="w-64">
            <CardHeader className="flex items-center gap-4">
              <HandHeart className="w-8 h-8" style={{ color: corSecundaria }} />
              <CardTitle className="text-xl " style={{ color: corSecundaria }}>
                Feito à mão
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Produtos únicos e artesanais feitos com carinho.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="w-64">
            <CardHeader className="flex items-center gap-4">
              <Truck className=" w-8 h-8" style={{ color: corSecundaria }} />
              <CardTitle className="text-xl" style={{ color: corSecundaria }}>
                Envio para todo o Brasil
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Receba onde estiver, com rapidez e segurança.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="w-64">
            <CardHeader className="flex items-center gap-4">
              <ShieldCheck
                className="w-8 h-8"
                style={{ color: corSecundaria }}
              />
              <CardTitle className="text-xl" style={{ color: corSecundaria }}>
                Pagamento Seguro
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Compre com total tranquilidade e proteção.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LojaHome;
