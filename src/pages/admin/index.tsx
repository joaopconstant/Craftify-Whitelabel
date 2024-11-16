import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { Sidebar } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Header from "@/components/ui/header";
import { ShoppingBag, Layers, Settings, Home } from "lucide-react";
import { useRouter } from "next/router";

const DashboardPage = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [produtos, setProdutos] = useState<any[]>([]);
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [totalReceita, setTotalReceita] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchDados = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      alert("Usuário não autenticado!");
      return;
    }

    try {
      // Consulta de produtos
      const produtosRef = collection(db, "produto");
      const qProdutos = query(produtosRef, where("lojistaId", "==", user.uid));
      const querySnapshotProdutos = await getDocs(qProdutos);
      const produtosList = querySnapshotProdutos.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setProdutos(produtosList);

      // Consulta de pedidos
      const pedidosRef = collection(db, "pedido");
      const qPedidos = query(pedidosRef, where("lojistaId", "==", user.uid));
      const querySnapshotPedidos = await getDocs(qPedidos);
      const pedidosList = querySnapshotPedidos.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setPedidos(pedidosList);

      // Calcula total da receita
      const total = pedidosList.reduce(
        (acc, pedido) => acc + parseFloat(pedido.total),
        0
      );
      setTotalReceita(total);

      setLoading(false);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
      alert("Erro ao buscar dados.");
    }
  };

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchDados(); // Carrega dados após autenticação
      } else {
        router.push("/admin/login");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return <p>Carregando...</p>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex-col">
      <Header type="admin"/>
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
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-bold">Dashboard da Loja</h2>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl">
                <Card>
                  <CardHeader>
                    <h3 className="font-bold">Produtos Cadastrados</h3>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xl font-bold">{produtos.length}</p>
                  </CardContent>
                </Card>

                <Card >
                  <CardHeader>
                    <h3 className="font-bold">Pedidos Realizados</h3>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xl font-bold">{pedidos.length}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <h3 className="font-bold">Total de Receita</h3>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xl font-bold">R${totalReceita.toFixed(2)}</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
