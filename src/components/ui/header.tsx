import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getAuth, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogOut, ShoppingCart } from "lucide-react";

const Header = ({ type }: { type: "admin" | "loja" }) => {
  const [lojistaNome, setLojistaNome] = useState("");
  const [logotipo, setLogotipo] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchLojistaData = async () => {
      let lojistaId;
      if (type === "admin") {
        const auth = getAuth();
        const user = auth.currentUser;
        if (user) lojistaId = user.uid;
      } else {
        lojistaId = router.query.lojistaId;
      }

      if (lojistaId) {
        const docRef = doc(db, "lojista", lojistaId as string);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setLojistaNome(data.nome);
          setLogotipo(data.logotipo || null);
        }
      }
    };

    fetchLojistaData();
  }, [type, router.query.lojistaId]);

  const handleLogout = async () => {
    const auth = getAuth();
    await signOut(auth);
    router.reload();
  };

  return (
    <Card className="text-black p-4 flex justify-between items-center rounded-none">
      <div className="flex items-center gap-4">
        {logotipo && (
          <img
            src={logotipo}
            alt={lojistaNome}
            className="h-12 w-auto object-contain"
          />
        )}
      </div>
      {type === "admin" ? (
        <Button onClick={handleLogout} variant="outline">
          <LogOut />
          Sair
        </Button>
      ) : (
        <div className="flex items-center gap-6">
          <nav className="flex gap-4">
            <a href="#inicio" className="text-sm font-semibold hover:underline">
              Início
            </a>
            <a href="#produtos" className="text-sm font-semibold hover:underline">
              Produtos
            </a>
            <a href="#contato" className="text-sm font-semibold hover:underline">
              Contato
            </a>
          </nav>
          <Button variant="outline" onClick={() => alert("Abrir carrinho")}>
            <ShoppingCart className="mr-2" />
            Carrinho
          </Button>
        </div>
      )}
    </Card>
  );
};

export default Header;
