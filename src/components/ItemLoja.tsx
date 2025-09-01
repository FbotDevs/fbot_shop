import React, { useState } from 'react';
import { LojaItem } from '../types';

interface ItemLojaProps {
  item: LojaItem;
  onAddToCart: (item: LojaItem) => void;
  onViewDetails: (item: LojaItem) => void;
  className?: string;
}

export const ItemLoja: React.FC<ItemLojaProps> = ({ item, onAddToCart, onViewDetails, className }) => {
  const [hovered, setHovered] = useState(false);

  const handleAddToCart = () => {
    if ((item.quantidade ?? 0) > 0 && item.emEstoque) {
      onAddToCart(item);
    }
  };

  return (
    <div
      className={`item-loja-simple card-hover-clickable ${className || ''}`.trim()}
      tabIndex={0}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleAddToCart}
      style={{ cursor: item.emEstoque ? 'pointer' : 'not-allowed', position: 'relative' }}
      aria-disabled={!item.emEstoque}
    >
      {hovered && (
        <div className="item-popup-descricao">
          <strong>{item.nome}</strong>
          <p>{item.descricao}</p>
          {item.emEstoque && (
            <div className="item-popup-add-msg">Clique para adicionar à cesta</div>
          )}
          {!item.emEstoque && (
            <div className="item-popup-add-msg" style={{ color: '#ffb2a1' }}>Indisponível</div>
          )}
        </div>
      )}
      <div className="item-imagem-container">
        <img
          className="item-imagem"
          src={(() => {
            if (!item.imagem) return 'src/assets/Produto_Nao_Encontrado.png';
            const img = item.imagem.trim();
            if (/^https?:\/\//i.test(img) || /^data:/i.test(img)) return img;
            return `src/assets/${img}`;
          })()}
          alt={item.nome}
          onError={(e) => (e.currentTarget.src = 'src/assets/Produto_Nao_Encontrado.png')}
          draggable={false}
          style={{ pointerEvents: 'none' }}
        />
  {/* quantidade badge removida conforme ajustes de UI */}
      </div>
      <div className="item-info-simple">
        <h3 className="item-nome-simple">{item.nome}</h3>
        <span className="item-codigo-simple">Código: {item.id}</span>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'center', marginTop: 6 }}>
          <span className="item-preco-simple">R$ {item.preco.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};