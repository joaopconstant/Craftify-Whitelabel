export interface Lojista {
  id: string,
  corPrimaria: string,
  corSecundaria: string,
  logotipo: string,
  nome: string,
  ownerId: string,
  boasVindas?:string
}

export interface Produto {
  id: string;
  lojistaId: string;
  nome: string;
  descricao: string;
  detalhes?: string,
  preco: number;
  imagem: string;
  estoque: number,
  customizavel: boolean
}

export interface Pedido {
  id: string;
  dataCriacao: Date,
  lojistaId: string;
  produtos: Array<{
    produtoId: string;
    especificacoes: string,
    preco: number,
    quantidade: number;
  }>;
  status: string,
  total: number,
  usuarioId: string
}

export interface Usuario {
  nome: string,
  email: string,
  endereco: Array<{
    cep: string,
    estado: string,
    cidade: string,
    rua: string,
    numero: string
  }>;
}
