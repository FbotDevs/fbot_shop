export interface DataModel {
    id: number;
    name: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
}

// Interface para itens da loja
export type ItemTipo = 'comida' | 'bebida' | 'doces' | 'merch';

export interface ViewerConfig {
    scale?: number;
    position?: [number, number, number];
    rotation?: [number, number, number];
    autoRotate?: boolean;
    enableControls?: boolean;
}

export interface LojaItem {
    id: number;
    nome: string;
    modelo3d: string; // Caminho para o arquivo .glb
    preco: number;
    quantidade: number;
    descricao: string;
    tipo: ItemTipo; // Nova tag para separar por tipo
    categoria?: string;
    emEstoque: boolean;
    viewer?: ViewerConfig; // Configuração visual específica por item
}

// Interface para o carrinho de compras
export interface CarrinhoItem {
    item: LojaItem;
    quantidadeSelecionada: number;
}

export interface ButtonProps {
    label: string;
    onClick: () => void;
}

export interface InputProps {
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
}