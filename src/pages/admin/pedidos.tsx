import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { Sidebar } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Header from "@/components/ui/header";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Layers, Settings } from "lucide-react";
import { useRouter } from "next/router";

const PedidosPage = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPedidos = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      alert("Usuário não autenticado!");
      return;
    }

    try {
      const pedidosRef = collection(db, "pedido");
      const q = query(pedidosRef, where("lojistaId", "==", user.uid));
      const querySnapshot = await getDocs(q);

      const pedidosList = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setPedidos(pedidosList);
      setLoading(false);
    } catch (error) {
      console.error("Erro ao buscar pedidos:", error);
      alert("Erro ao buscar pedidos.");
    }
  };

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchPedidos(); // Carrega pedidos apenas após a autenticação
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

  const handleStatusUpdate = async (pedidoId: string, newStatus: string) => {
    try {
      const pedidoRef = doc(db, "pedido", pedidoId);
      await updateDoc(pedidoRef, { status: newStatus });
      alert("Status atualizado com sucesso!");
      fetchPedidos();
    } catch (error) {
      console.error("Erro ao atualizar status do pedido:", error);
      alert("Erro ao atualizar status.");
    }
  };

  return (
    <div className="flex-col">
      <Header />
      <div className="flex min-h-screen">
        <Sidebar>
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
              <h2 className="text-2xl font-bold">Gerenciamento de Pedidos</h2>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p>Carregando pedidos...</p>
              ) : pedidos.length === 0 ? (
                <p>Nenhum pedido encontrado.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl">
                  {pedidos.map((pedido) => (
                    <div
                      key={pedido.id}
                      className="border rounded p-4 shadow-md"
                    >
                      <h3 className="font-bold">Pedido #{pedido.id}</h3>
                      <p>
                        <strong>Cliente:</strong> {pedido.cliente}
                      </p>
                      <p>
                        <strong>Status:</strong> {pedido.status}
                      </p>
                      <p>
                        <strong>Total:</strong> R${pedido.total}
                      </p>
                      <Button
                        onClick={() => handleStatusUpdate(pedido.id, "Enviado")}
                        className="mt-2 w-full"
                      >
                        Marcar como Enviado
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PedidosPage;
