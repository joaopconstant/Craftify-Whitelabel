import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { getAuth } from "firebase/auth";
import { getDoc, doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/ui/sidebar";

const ConfiguracoesPage = () => {
  const router = useRouter();
  const [lojista, setLojista] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [nome, setNome] = useState<string>("");
  const [corPrimaria, setCorPrimaria] = useState<string>("");
  const [corSecundaria, setCorSecundaria] = useState<string>("");
  const [logotipo, setLogotipo] = useState<string>("");

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      router.push("/admin/login");
      return;
    }

    const fetchLojista = async () => {
      const lojistaRef = doc(db, "lojista", user.uid);
      const docSnap = await getDoc(lojistaRef);

      if (docSnap.exists()) {
        setLojista(docSnap.data());
        setNome(docSnap.data()?.nome || "");
        setCorPrimaria(docSnap.data()?.corPrimaria || "");
        setCorSecundaria(docSnap.data()?.corSecundaria || "");
        setLogotipo(docSnap.data()?.logotipo || "");
      } else {
        console.log("Lojista não encontrado");
      }

      setLoading(false);
    };

    fetchLojista();
  }, [router]);

  const handleSave = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const lojistaRef = doc(db, "lojista", user.uid);
      await setDoc(
        lojistaRef,
        {
          nome,
          corPrimaria,
          corSecundaria,
          logotipo,
        },
        { merge: true }
      );
    }
  };

  if (loading) return <div>Carregando...</div>;

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar>
        <Sidebar.Item onClick={() => router.push("/admin/produtos")}>
          Produtos
        </Sidebar.Item>
        <Sidebar.Item onClick={() => router.push("/admin/pedidos")}>
          Pedidos
        </Sidebar.Item>
        <Sidebar.Item onClick={() => router.push("/admin/configuracoes")}>
          Configurações
        </Sidebar.Item>
      </Sidebar>

      {/* Área de conteúdo */}
      <div className="flex-1 p-8">
        <Card className="w-full max-w-3xl mx-auto">
          <CardHeader>
            <h2 className="text-xl font-bold">Configurações da Loja</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold">Informações da Loja</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Nome da Loja
                    </label>
                    <Input
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Logo da Loja
                    </label>
                    <Input
                      value={logotipo}
                      onChange={(e) => setLogotipo(e.target.value)}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Cor Primária
                    </label>
                    <Input
                      value={corPrimaria}
                      onChange={(e) => setCorPrimaria(e.target.value)}
                      className="mt-2"
                      style={{ backgroundColor: corPrimaria }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Cor Secundária
                    </label>
                    <Input
                      value={corSecundaria}
                      onChange={(e) => setCorSecundaria(e.target.value)}
                      className="mt-2"
                      style={{ backgroundColor: corSecundaria }}
                    />
                  </div>
                </div>
              </div>

              {/* Botão para salvar configurações */}
              <Button onClick={handleSave} className="w-full mt-4">
                Salvar Configurações
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ConfiguracoesPage;
