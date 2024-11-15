import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { getDoc, doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/ui/sidebar";
import Header from "@/components/ui/header";
import { Home, Layers, Settings, ShoppingBag } from "lucide-react";

const ConfiguracoesPage = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [lojista, setLojista] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [nome, setNome] = useState<string>("");
  const [corPrimaria, setCorPrimaria] = useState<string>("");
  const [corSecundaria, setCorSecundaria] = useState<string>("");
  const [logotipo, setLogotipo] = useState<string>("");

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        // Carregar as informações do lojista
        const lojistaRef = doc(db, "lojista", currentUser.uid);
        const lojistaSnap = await getDoc(lojistaRef);

        if (lojistaSnap.exists()) {
          const lojistaData = lojistaSnap.data();
          setLojista(lojistaData);
          setNome(lojistaData.nome || "");
          setCorPrimaria(lojistaData.corPrimaria || "");
          setCorSecundaria(lojistaData.corSecundaria || "");
          setLogotipo(lojistaData.logotipo || "");
        }
      } else {
        router.push("/admin/login");
      }
      setLoading(false);
    });

    return () => unsubscribe();
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
      alert("Configurações salvas com sucesso.")
    }
  };

  if (loading) return <div>Carregando...</div>;

  return (
    <div className="flex-col">
      <Header />
      <div className="flex min-h-screen">
        <Sidebar>
          <Sidebar.Item onClick={() => router.push("/admin/")}>
            <Home /> Início
          </Sidebar.Item>
          <Sidebar.Item onClick={() => router.push("/admin/produtos")}>
            <Layers /> Produtos
          </Sidebar.Item>
          <Sidebar.Item onClick={() => router.push("/admin/pedidos")}>
            <ShoppingBag /> Pedidos
          </Sidebar.Item>
          <Sidebar.Item onClick={() => router.push("/admin/configuracoes")}>
            <Settings /> Configurações
          </Sidebar.Item>
        </Sidebar>

        <div className="flex-1 p-8">
          <Card className="w-full max-w-3xl mx-auto">
            <CardHeader>
              <h2 className="text-2xl font-bold">Configurações da Loja</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Informações</h3>
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
                <Button onClick={handleSave} className="w-full mt-4">
                  Salvar Configurações
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ConfiguracoesPage;
