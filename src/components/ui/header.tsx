import { useEffect, useState } from "react";
import { getAuth, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LogOut } from "lucide-react";

const Header = () => {
  const [lojistaNome, setLojistaNome] = useState("");

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      // Pegando o nome do lojista (ou outros dados)
      const fetchLojistaData = async () => {
        const docRef = doc(db, "lojista", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setLojistaNome(docSnap.data().nome);
        }
      };
      fetchLojistaData();
    }
  }, []);

  const handleLogout = async () => {
    const auth = getAuth();
    await signOut(auth);
    window.location.reload(); // Redireciona para a tela inicial
  };

  return (
    <Card className="text-black p-4 flex justify-between items-center rounded-none">
      <h1 className="text-lg font-bold">{lojistaNome}</h1>
      <Button
        onClick={handleLogout}
        variant={"outline"}
      >
        <LogOut/>
        Sair
      </Button>
    </Card>
  );
};

export default Header;
