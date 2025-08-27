import { LojaItem } from "../types";
export const fetchItensLoja = async () => {
  // Simula uma chamada assíncrona, por exemplo, a uma API
  return new Promise<LojaItem[]>((resolve) => {
    setTimeout(() => {
      resolve(itensLojaSeed);
    }, 500); // Simula um atraso de 500ms
  });
};

// Fonte única dos itens da loja.
// No futuro, substitua por uma chamada à API/DB.
export const itensLojaSeed: LojaItem[] = [
  {
    id: 1,
    nome: "Coca-Cola Lata",
    imagem: "coca_cola_soda_can.png",
    preco: 6.0,
    quantidade: 50,
    descricao:
      "Refrigerante clássico da Coca-Cola em lata de 350ml. Gelado e refrescante.",
    tipo: 'bebida',
    categoria: "Refrigerantes",
    emEstoque: true,
  },
  {
    id: 6,
    nome: "Doritos",
    imagem: "doritos_package.png",
    preco: 6.5,
    quantidade: 40,
    descricao: "Salgadinho Doritos sabor nacho cheese. Crocante e saboroso.",
    tipo: 'comida',
    categoria: "Salgadinhos",
    emEstoque: true,
  },
  {
    id: 7,
    nome: "Monster Energy",
    imagem: "monster_energy_drink.png",
    preco: 18.0,
    quantidade: 15,
    descricao:
      "Energético Monster Energy. Potência máxima para seus desafios.",
    tipo: 'bebida',
    categoria: "Energéticos",
    emEstoque: true,
  },
  {
    id: 4,
    nome: "Café",
    imagem: "cofee_mug.png",
    preco: 3.0,
    quantidade: 100,
    descricao:
      "Café torrado e moído, embalagem de 250g. Sabor intenso e encorpado.",
    tipo: 'bebida',
    categoria: "Bebidas Quentes",
    emEstoque: false,
  },
  {
    id: 5,
    nome: "Batata Lays",
    imagem: "lays_potato_chips.png",
    preco: 6.0,
    quantidade: 50,
    descricao:
      "Batata Lays clássica em embalagem de 200g. Crocante e saborosa.",
    tipo: 'comida',
    categoria: "Salgadinhos",
    emEstoque: true,
  },
  {
    id: 8,
    nome: "Crunch Bar",
    imagem: "chocolate_crunch_bar.png",
    preco: 6.5,
    quantidade: 40,
    descricao: "Barra de chocolate crocante e saborosa.",
    tipo: 'doces',
    categoria: "Barritas de Chocolate",
    emEstoque: true,
  }
];

// Escolha do item em destaque via código (alterar regra aqui conforme desejar)
export function selectFeaturedItemId(items: LojaItem[]): number | undefined {
  // Exemplo: manter Coca-Cola (id:1) como destaque; se não existir, usa o primeiro
  return items.find((i) => i.id === 7)?.id ?? items[0]?.id;
}


export function getItemById(items: LojaItem[], id?: number | null): LojaItem | undefined {
  if (!id) return undefined;
  return items.find((i) => i.id === id);
}

export function parseFeaturedFromLocation(): number | undefined {
  // Suporta ?destaque=ID ou ?featured=ID
  const params = new URLSearchParams(window.location.search);
  const raw = params.get("destaque") ?? params.get("featured");
  if (!raw) return undefined;
  const id = Number(raw);
  return Number.isFinite(id) ? id : undefined;
}

