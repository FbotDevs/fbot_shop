import React from 'react';
import { LojaItem } from '../types';

interface ItemLojaProps {
  item: LojaItem;
  onAddToCart: (item: LojaItem) => void;
  onViewDetails: (item: LojaItem) => void;
}

export const ItemLoja: React.FC<ItemLojaProps> = ({ item, onAddToCart, onViewDetails }) => {
  const handleAddToCart = () => {
    if (item.emEstoque) {
      onAddToCart(item);
    }
  };

  return (
    <div className="item-loja-simple">
      <img
        className="item-imagem"
        src={`src/assets/${item.imagem ?? 'Produto_Nao_Encontrado.png'}`}
        alt={item.nome}
        onError={(e) => (e.currentTarget.src = 'src/assets/Produto_Nao_Encontrado.png')}
      />
      <div className="item-info-simple">
        <h3 className="item-nome-simple">{item.nome}</h3>
        <span className="item-preco-simple">R$ {item.preco.toFixed(2)}</span>
      </div>
      <div className="item-buttons-simple">
        <button 
          className="btn-adicionar-simple"
          onClick={handleAddToCart}
          disabled={!item.emEstoque}
        >
          {item.emEstoque ? 'Adicionar' : 'Esgotado'}
        </button>
        <button 
          className="btn-detalhes-simple"
          onClick={() => onViewDetails(item)}
        >
          Detalhes
        </button>
      </div>
    </div>
  );
};