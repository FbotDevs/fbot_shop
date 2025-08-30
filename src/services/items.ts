import { LojaItem } from "../types";
export const fetchItensLoja = async () => {
  return new Promise<LojaItem[]>((resolve) => {
    setTimeout(() => {
      resolve(itensLojaSeed);
    }, 500);
  });
};

export const itensLojaSeed: LojaItem[] = [
  {
    id: 1,
    nome: "Coca-Cola Lata",
    imagem: "https://www.thebakers.com.br/wp-content/uploads/2019/05/coca-600x540-600x540.png", 
    preco: 6.0,
    quantidade: 12,
    descricao:
      "Refrigerante clássico da Coca-Cola em lata de 350ml. Gelado e refrescante.",
    tipo: 'bebida',
    categoria: "Refrigerantes",
    emEstoque: true,
  },
  {
    id: 6,
    nome: "Doritos",
    imagem: "https://phygital-files.mercafacil.com/catalogo/uploads/produto/salgadinho_doritos_queijo_nacho_140g_aab7c3ac-2b4d-4b14-a69c-20c43ddb375f.jpg",
    preco: 6.5,
    quantidade: 6,
    descricao: "Salgadinho Doritos sabor nacho cheese. Crocante e saboroso.",
    tipo: 'comida',
    categoria: "Salgadinhos",
    emEstoque: true,
  },
  {
    id: 7,
    nome: "Monster Energy",
    imagem: "https://instamart-media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,h_600/c1esxs0nvjxtb2ngtnlx", 
    preco: 18.0,
    quantidade: 1,
    descricao:
      "Energético Monster Energy. Potência máxima para seus desafios.",
    tipo: 'bebida',
    categoria: "Energéticos",
    emEstoque: true,
  },
  {
    id: 4,
    nome: "Café",
    imagem: "https://static.vecteezy.com/system/resources/previews/049/376/953/non_2x/cup-of-coffee-with-creamy-frothy-top-and-coffee-beans-free-png.png", 
    preco: 3.0,
    quantidade: 1,
    descricao:
      "Café torrado e moído, embalagem de 250g. Sabor intenso e encorpado.",
    tipo: 'bebida',
    categoria: "Bebidas Quentes",
    emEstoque: true,
  },
  {
    id: 5,
    nome: "Batata Lays",
  imagem: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQiyLe_vaeumtKWuR-dkiyEoIBjUQJK0Bgoww&s",
    preco: 6.0,
    quantidade: 12,
    descricao:
      "Batata Lays clássica em embalagem de 200g. Crocante e saborosa.",
    tipo: 'comida',
    categoria: "Salgadinhos",
    emEstoque: true,
  },
  {
    id: 8,
    nome: "Crunch Bar",
  imagem: "https://allcitycandy.com/cdn/shop/files/crunch.png?v=1739163400",
    preco: 6.5,
    quantidade: 5,
    descricao: "Barra de chocolate crocante e saborosa.",
    tipo: 'doces',
    categoria: "Barritas de Chocolate",
    emEstoque: true,
  }
];


export function getItemById(items: LojaItem[], id?: number | null): LojaItem | undefined {
  if (!id) return undefined;
  return items.find((i) => i.id === id);
}

export function parseFeaturedFromLocation(): number | undefined {
  const params = new URLSearchParams(window.location.search);
  const raw = params.get("destaque") ?? params.get("featured");
  if (!raw) return undefined;
  const id = Number(raw);
  return Number.isFinite(id) ? id : undefined;
}

