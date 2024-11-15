import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, UserCredential, setPersistence, browserLocalPersistence } from "firebase/auth";
import { addDoc, collection, doc, getDocs, getFirestore, query, updateDoc, where } from "firebase/firestore";

// Configurações do Firebase (as variáveis estão no .env.local)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Inicializar o Firebase somente uma vez
const app = initializeApp(firebaseConfig);

// Exportar instâncias do Firebase Authentication e Firestore
const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence);
const db = getFirestore(app);

// Login do lojista
export const loginLojista = async (email: string, password: string): Promise<UserCredential> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential;
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    throw new Error('Falha no login. Verifique suas credenciais.');
  }
};

// Criação de novos lojistas
export const criarLojista = (email: string, password: string): Promise<UserCredential> => {
  return createUserWithEmailAndPassword(auth, email, password);
};

// Obter lojistas
export const getLojistas = async () => {
  const lojistasSnapshot = await getDocs(collection(db, 'lojistas'));
  const lojistasList = lojistasSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  return lojistasList;
};

// Adicionar produto
export const createProduct = async (productData: any) => {
  try {
    const productRef = await addDoc(collection(db, 'produtos'), productData);
    console.log("Produto criado com ID: ", productRef.id);
  } catch (e) {
    console.error("Erro ao adicionar produto: ", e);
  }
};

// Obter produto por lojista
export const getProductsByLojista = async (lojistaId: string) => {
  const q = query(collection(db, 'produtos'), where('lojistaId', '==', lojistaId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Criar pedido
export const createOrder = async (orderData: any) => {
  try {
    const orderRef = await addDoc(collection(db, 'pedidos'), orderData);
    console.log("Pedido criado com ID: ", orderRef.id);
  } catch (e) {
    console.error("Erro ao criar pedido: ", e);
  }
};

// Obter pedido por cliente
export const getOrdersByCliente = async (clienteId: string) => {
  const q = query(collection(db, 'pedidos'), where('clienteId', '==', clienteId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Função para atualizar as configurações do lojista
export const updateLojistaConfig = async (lojistaId: string, data: any) => {
  try {
    const lojistaRef = doc(db, "lojista", lojistaId);  // Referência ao documento do lojista
    await updateDoc(lojistaRef, data);  // Atualiza o documento com os dados fornecidos
    console.log("Configurações do lojista atualizadas com sucesso!");
  } catch (error) {
    console.error("Erro ao atualizar as configurações do lojista: ", error);
    throw new Error("Erro ao atualizar as configurações do lojista.");
  }
};

export { db, auth };
