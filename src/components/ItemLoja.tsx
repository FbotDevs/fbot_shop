import React from 'react';
import { LojaItem } from '../types';
import { Visualizador3DItem } from './Visualizador3DItem';

interface ItemLojaProps {
  item: LojaItem;
  onAddToCart: (item: LojaItem) => void;
  onViewDetails: (item: LojaItem) => void;
}

const ItemLoja: React.FC<ItemLojaProps> = ({ item, onAddToCart, onViewDetails }) => {
  const handleAddToCart = () => {
    if (item.emEstoque) {
      onAddToCart(item);
    }
  };

  return (
    <div className="item-loja-simple">
      <div className="item-3d-container">
        <Visualizador3DItem 
          modelPath={`/${item.modelo3d}`}
          autoRotate={item.viewer?.autoRotate ?? false}
          enableControls={item.viewer?.enableControls ?? true}
          scale={item.viewer?.scale ?? 1.0}
          position={item.viewer?.position ?? [0, -2, 0]}
          rotation={item.viewer?.rotation ?? [0, 0, 0]}
        />
      </div>
      
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

export default ItemLoja;
