import { LojaItem } from "../types";

// Fonte única dos itens da loja.
// No futuro, substitua por uma chamada à API/DB.
export const itensLojaSeed: LojaItem[] = [
  {
    id: 1,
    nome: "Coca-Cola Lata",
    modelo3d: "coca_cola_soda_can.glb",
    preco: 6.0,
    quantidade: 50,
    descricao:
      "Refrigerante clássico da Coca-Cola em lata de 350ml. Gelado e refrescante.",
  tipo: 'bebida',
    categoria: "Refrigerantes",
    emEstoque: true,
    viewer: {
      scale: 0.9,
      position: [0, -2, 0],
      rotation: [0, 0, 0],
      autoRotate: false,
      enableControls: true,
    }
  },
  {
    id: 6,
    nome: "Doritos",
    modelo3d: "doritos_package.glb",
    preco: 6.5,
    quantidade: 40,
    descricao: "Salgadinho Doritos sabor nacho cheese. Crocante e saboroso.",
  tipo: 'comida',
    categoria: "Salgadinhos",
    emEstoque: true,
    viewer: {
      scale: 2.2,
      position: [0, -1.6, 0],
      rotation: [0, -Math.PI * 0.5, -Math.PI * 0.5],
      autoRotate: false,
      enableControls: true,
    }
  },
  {
    id: 7,
    nome: "Monster Energy",
    modelo3d: "monster_energy_drink.glb",
    preco: 18.0,
    quantidade: 15,
    descricao:
      "Energético Monster Energy. Potência máxima para seus desafios.",
  tipo: 'bebida',
    categoria: "Energéticos",
    emEstoque: true,
    viewer: {
      scale: 0.9,
      position: [0, -1.8, 0],
      rotation: [0, 0, 0],
      autoRotate: false,
      enableControls: true,
    }
  },
  {
    id: 4,
    nome: "Café",
    modelo3d: "cofee_mug.glb", // Fallback até ter o modelo real
    preco: 3.0,
    quantidade: 100,
    descricao:
      "Café torrado e moído, embalagem de 250g. Sabor intenso e encorpado.",
  tipo: 'bebida',
    categoria: "Bebidas Quentes",
    emEstoque: false,
    viewer: {
      scale: 0.2,
      position: [0, 0, 0],
      rotation: [0, Math.PI * 0.2, 0],
      autoRotate: false,
      enableControls: true,
    }
  },
  {
    id: 5,
    nome: "Batata Lays",
  modelo3d: "lays_potato_chips.glb", // placeholder até existir o modelo real
    preco: 6.0,
    quantidade: 50,
    descricao:
      "Batata Lays clássica em embalagem de 200g. Crocante e saborosa.",
  tipo: 'comida',
    categoria: "Salgadinhos",
    emEstoque: true,
    viewer: {
      scale: 1.0,
      position: [0, -3, 0],
      rotation: [0, Math.PI * -0.1, 0],
      autoRotate: false,
      enableControls: true,
    }
  },
  {
  id: 8,
  nome: "Crunch Bar",
  modelo3d: "chocolate_crunch_bar.glb", // placeholder até existir o modelo real
    preco: 6.5,
    quantidade: 40,
  descricao: "Barra de chocolate crocante e saborosa.",
  tipo: 'doces',
    categoria: "Barritas de Chocolate",
    emEstoque: true,
    viewer: {
      scale: 4,
      position: [0, -1, 0],
      rotation: [0, -1.3, 0],
      autoRotate: false,
      enableControls: true,
    }
  }
];

// Simula um fetch assíncrono. Substitua por chamada HTTP quando houver backend.
export async function fetchItensLoja(): Promise<LojaItem[]> {
  // Simular latência mínima se quiser: await new Promise(r => setTimeout(r, 50));
  return itensLojaSeed;
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

// Escolha do item em destaque via código (alterar regra aqui conforme desejar)
export function selectFeaturedItemId(items: LojaItem[]): number | undefined {
  // Exemplo: manter Coca-Cola (id:1) como destaque; se não existir, usa o primeiro
  return items.find((i) => i.id === 7)?.id ?? items[0]?.id;
}
