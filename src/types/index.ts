export interface DataModel {
    id: number;
    name: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
}

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
    preco: number;
    quantidade: number;
    descricao: string;
    tipo: ItemTipo;
    categoria?: string;
    emEstoque: boolean;
    viewer?: ViewerConfig;
    imagem?: string; 

}

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