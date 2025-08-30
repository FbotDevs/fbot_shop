// src/types.ts
export interface LojaItem {
  id: number;
  nome: string;
  preco: number;
  tipo: string;
  imagem?: string;
  descricao?: string;
  quantidade?: number;
  categoria?: string;
  emEstoque?: boolean;
}

export interface CarrinhoItem {
  item: LojaItem;
  quantidadeSelecionada: number;
}