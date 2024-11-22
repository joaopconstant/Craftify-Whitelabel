import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/ui/header";
import { useRouter } from "next/router";
import { db } from "@/lib/firebase";
import { addDoc, collection, doc, getDoc } from "firebase/firestore";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Carrinho = () => {
  const [produtos, setProdutos] = useState<any[]>([]);
  const [corPrimaria, setCorPrimaria] = useState<string>("");
  const [corSecundaria, setCorSecundaria] = useState<string>("");
  const [openDialog, setOpenDialog] = useState(false);
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
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

    const carrinho = JSON.parse(
      localStorage.getItem(`carrinho_${lojistaId}`) || "[]"
    );
    setProdutos(carrinho);
  }, [lojistaId]);

  const removerProduto = (index: number) => {
    const carrinhoAtual = JSON.parse(
      localStorage.getItem(`carrinho_${lojistaId}`) || "[]"
    );
    carrinhoAtual.splice(index, 1);
    localStorage.setItem(
      `carrinho_${lojistaId}`,
      JSON.stringify(carrinhoAtual)
    );
    setProdutos(carrinhoAtual);
  };

  const calcularTotal = () => {
    return produtos.reduce((total, produto) => total + (produto.preco || 0), 0);
  };

  const finalizarPedido = async () => {
    if (!nome || !telefone) {
      alert("Por favor, preencha o nome e o telefone.");
      return;
    }

    if (!lojistaId) {
      alert("Lojista não encontrado!");
      return;
    }

    const novoPedido = {
      lojistaId,
      produtos,
      total: calcularTotal(),
      status: "Pendente",
      cliente: { nome, telefone },
      data: new Date().toISOString(),
    };

    try {
      const pedidosRef = collection(db, "pedido");
      await addDoc(pedidosRef, novoPedido);
      alert("Pedido realizado com sucesso!");
      localStorage.removeItem(`carrinho_${lojistaId}`);
      setProdutos([]);
      setOpenDialog(false);
      router.push(`/loja/${lojistaId}`);
    } catch (error) {
      console.error("Erro ao salvar pedido:", error);
      alert("Erro ao finalizar o pedido. Tente novamente.");
    }
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
                  <Button
                    variant="outline"
                    onClick={() => removerProduto(index)}
                  >
                    Remover
                  </Button>
                </div>
              </Card>
            ))
          )}
          {produtos.length > 0 && (
            <div className="mt-6 flex justify-between">
              <h2 className="text-xl font-bold">Total</h2>
              <p className="text-xl font-bold">
                R$ {calcularTotal().toFixed(2)}
              </p>
            </div>
          )}
          <Button
            disabled={produtos.length === 0}
            className="w-full mt-6"
            onClick={() => setOpenDialog(true)}
            style={{ backgroundColor: corPrimaria }}
          >
            Finalizar Pedido
          </Button>
        </div>
      </main>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="bg-white p-6 sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Finalize seu pedido</DialogTitle>
            <p>Preencha as informações de contato para prosseguir.</p>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="nome">Nome</Label>
              <Input
                id="nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full p-2 mt-1 border border-gray-300 rounded"
                placeholder="Digite seu nome"
              />
            </div>
            <div>
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                id="telefone"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                className="w-full p-2 mt-1 border border-gray-300 rounded"
                placeholder="Digite seu telefone"
              />
            </div>
          </div>
          <DialogFooter className="sm:justify-start mt-4">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Fechar
              </Button>
            </DialogClose>
            <Button
              onClick={finalizarPedido}
              style={{ backgroundColor: corPrimaria, color: "white" }}
            >
              Confirmar Pedido
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Carrinho;
