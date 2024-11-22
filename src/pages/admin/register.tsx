import { useState } from "react";
import { useRouter } from "next/router";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

const RegisterLojista = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nomeDaLoja, setNomeDaLoja] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Registrar usuário com email e senha
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Criar documento do lojista no Firestore com o mesmo ID do usuário
      const lojistaRef = doc(db, "lojista", user.uid); // Nome do documento "lojista"
      await setDoc(lojistaRef, {
        nome: nomeDaLoja,
        logotipo: "", // Adicionar URL do logo ou configurar um valor padrão
        corPrimaria: "#000000", // Cor primária padrão
        corSecundaria: "#FFFFFF", // Cor secundária padrão
        ownerId: user.uid, // Relacionando o UID ao proprietário
      });

      // Após o cadastro, redireciona para a página de login
      router.push(`/admin/login`);
    } catch (err: any) {
      setError("Erro ao registrar o lojista. Tente novamente.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <h2 className="text-xl font-bold">Cadastro do Lojista</h2>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="nomeDaLoja" className="block text-sm font-medium text-gray-700">
                  Nome da Loja
                </label>
                <Input
                  id="nomeDaLoja"
                  value={nomeDaLoja}
                  onChange={(e) => setNomeDaLoja(e.target.value)}
                  required
                  className="mt-2"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-2"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Senha
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="mt-2"
                />
              </div>
              {error && <div className="text-red-500 text-sm">{error}</div>}
              <Button type="submit" disabled={loading} className="w-full mt-4">
                {loading ? "Carregando..." : "Cadastrar"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterLojista;
