import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

const Loja = () => {
  const router = useRouter();
  const { lojistaId } = router.query;
  const [lojista, setLojista] = useState<any>(null);

  useEffect(() => {
    if (lojistaId) {
      // Buscar as informações do lojista no Firestore
      const fetchLojista = async () => {
        const lojistaRef = doc(db, "lojista", lojistaId as string); // Referência para o documento
        const docSnap = await getDoc(lojistaRef); // Obtém o documento

        if (docSnap.exists()) {
          setLojista(docSnap.data()); // Define os dados do lojista
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
    <div>
      <h1>{lojista.nome}</h1>
      <p>{lojista.descricao}</p>
      <img src={lojista.logotipo} alt={lojista.nome} />
      {/* Exibir outros detalhes da loja */}
    </div>
  );
};

export default Loja;