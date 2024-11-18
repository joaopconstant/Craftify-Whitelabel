import { useEffect, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";
import { db } from "@/lib/firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { Sidebar } from "@/components/ui/sidebar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import Header from "@/components/ui/header";
import { Home, Layers, Settings, ShoppingBag } from "lucide-react";
import { Produto } from "@/lib/types";
import { Textarea } from "@/components/ui/textarea";

const ProdutosPage = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // Para diferenciar entre adicionar e editar
  const [produtoIdEdit, setProdutoIdEdit] = useState<string | null>(null); // ID do produto sendo editado
  const [nome, setNome] = useState("");
  const [imagem, setImagem] = useState("");
  const [descricao, setDescricao] = useState("");
  const [detalhes, setDetalhes] = useState("");
  const [preco, setPreco] = useState<number>(0);
  const [estoque, setEstoque] = useState<number>(0);
  const [customizavel, setCustomizavel] = useState<boolean>(false);

  const fetchProdutos = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      alert("Usuário não autenticado!");
      return;
    }

    try {
      const produtoRef = collection(db, "produto");
      const q = query(produtoRef, where("lojistaId", "==", user.uid));
      const querySnapshot = await getDocs(q);

      const produtosList = querySnapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as Produto)
      );
      setProdutos(produtosList);
      setLoading(false);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      alert("Erro ao buscar produtos.");
    }
  };

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchProdutos();
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

  const handleAddProduto = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
      alert("Usuário não autenticado!");
      return;
    }

    const produtoData = {
      nome,
      imagem,
      descricao,
      detalhes,
      preco,
      estoque,
      customizavel,
      lojistaId: user.uid,
    };

    try {
      await addDoc(collection(db, "produto"), produtoData);
      alert("Produto adicionado com sucesso!");
      setOpenModal(false);
      setNome("");
      setImagem("");
      setDescricao("");
      setDetalhes("");
      setPreco(0);
      setEstoque(0);
      setCustomizavel(false);
      fetchProdutos();
    } catch (error) {
      console.error("Erro ao adicionar produto:", error);
      alert("Erro ao adicionar produto. Verifique as permissões.");
    }
  };

  const handleDeleteProduto = async (produtoId: string) => {
    const confirmDelete = window.confirm(
      "Tem certeza de que deseja excluir este produto?"
    );
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "produto", produtoId));
      alert("Produto excluído com sucesso!");
      fetchProdutos(); // Atualiza a lista após exclusão
    } catch (error) {
      console.error("Erro ao excluir produto:", error);
      alert("Erro ao excluir produto. Verifique as permissões.");
    }
  };

  const handleEditProduto = async () => {
    if (!produtoIdEdit) return;

    const produtoData = {
      nome,
      imagem,
      descricao,
      detalhes,
      preco,
      estoque,
      customizavel,
    };

    try {
      const produtoRef = doc(db, "produto", produtoIdEdit);
      await updateDoc(produtoRef, produtoData);
      alert("Produto atualizado com sucesso!");
      fetchProdutos();
      setOpenModal(false);
      setNome("");
      setImagem("");
      setDescricao("");
      setDetalhes("");
      setPreco(0);
      setEstoque(0);
      setCustomizavel(false);
      setIsEditing(false);
      setProdutoIdEdit(null);
    } catch (error) {
      console.error("Erro ao editar produto:", error);
      alert("Erro ao editar produto. Verifique as permissões.");
    }
  };

  const openEditModal = (produto: any) => {
    setIsEditing(true);
    setProdutoIdEdit(produto.id);
    setNome(produto.nome);
    setImagem(produto.imagem);
    setDescricao(produto.descricao);
    setDetalhes(produto.detalhes);
    setPreco(produto.preco);
    setEstoque(produto.estoque);
    setCustomizavel(produto.customizavel);
    setOpenModal(true);
  };

  return (
    <div className="flex-col ">
      <Header type="admin" />
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
          <Card className="w-full mx-auto">
            <CardHeader>
              <h2 className="text-2xl font-bold">Gerenciamento de Produtos</h2>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl">
                {produtos.length === 0 ? (
                  <p>Sem produtos cadastrados.</p>
                ) : (
                  produtos.map((produto) => (
                    <div
                      key={produto.id}
                      className="bg-white border rounded-lg shadow-lg p-6 space-y-4 flex flex-col"
                    >
                      <h3 className="font-semibold text-gray-800">
                        {produto.nome}
                      </h3>
                      <img
                        src={produto.imagem}
                        alt={produto.nome}
                        className="w-full h-48 object-cover rounded-md"
                      />
                      <p className="text-gray-600 flex-grow">
                        {produto.descricao}
                      </p>{" "}
                      {/* flex-grow para ocupar o espaço */}
                      <p className="text-lg font-bold text-gray-900">
                        Preço: R${produto.preco}
                      </p>
                      <div className="flex space-x-4 mt-4">
                        {" "}
                        {/* margin-top para separação */}
                        <Button
                          onClick={() => openEditModal(produto)}
                          className="w-full"
                        >
                          Editar
                        </Button>
                        <Button
                          onClick={() => handleDeleteProduto(produto.id)}
                          variant="outline"
                          className="w-full hover:bg-red-500 hover:text-white"
                        >
                          Excluir
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <Button
                onClick={() => setOpenModal(true)}
                className="w-auto mt-4"
              >
                Adicionar Produto
              </Button>
            </CardContent>
          </Card>

          <Dialog open={openModal} onOpenChange={setOpenModal}>
            <DialogContent className="bg-white p-6 rounded-lg">
              <DialogHeader>
                <DialogTitle>
                  {isEditing ? "Editar Produto" : "Adicionar Produto"}
                </DialogTitle>
                <DialogDescription>
                  {isEditing
                    ? "Faça as alterações necessárias no produto."
                    : "Preencha os dados do produto para adicionar à sua loja."}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <Input
                  placeholder="Nome do Produto"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                />
                <Input
                  placeholder="Link da Imagem"
                  value={imagem}
                  onChange={(e) => setImagem(e.target.value)}
                />
                <Input
                  placeholder="Descrição do Produto"
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                />
                <Textarea
                  placeholder="Descrição do Produto"
                  value={detalhes}
                  onChange={(e) => setDetalhes(e.target.value)}
                />
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor="preco">Preço</Label>
                  <Input
                    type="number"
                    placeholder="Preço"
                    value={preco}
                    onChange={(e) => setPreco(Number(e.target.value))}
                  />
                </div>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor="estoque">Estoque</Label>
                  <Input
                    type="number"
                    placeholder="Estoque"
                    value={estoque}
                    onChange={(e) => setEstoque(Number(e.target.value))}
                  />
                </div>
                <div className="items-top flex space-x-2">
                  <Checkbox
                    id="customizavel"
                    checked={customizavel}
                    onCheckedChange={() => setCustomizavel(!customizavel)}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <Label htmlFor="customizavel">Produto Customizável</Label>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  onClick={isEditing ? handleEditProduto : handleAddProduto}
                  className="w-full"
                >
                  {isEditing ? "Salvar Alterações" : "Adicionar Produto"}
                </Button>
                <DialogClose asChild>
                  <Button variant="outline" className="w-full">
                    Fechar
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default ProdutosPage;
