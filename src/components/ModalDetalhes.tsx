import React from 'react';
import { LojaItem } from '../types';

interface ModalDetalhesProps {
  item: LojaItem | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (item: LojaItem) => void;
}

const ModalDetalhes: React.FC<ModalDetalhesProps> = ({ item, isOpen, onClose, onAddToCart }) => {
  if (!isOpen || !item) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleAddToCart = () => {
    onAddToCart(item);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleBackdropClick}>
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>
          ×
        </button>
        
        <div className="modal-body">
          <div className="modal-left">
            <div className="modal-imagem">
              <img 
                src={`src/assets/${item.imagem ?? 'Produto_Nao_Encontrado.png'}`}
                alt={item.nome}
                onError={(e) => (e.currentTarget.src = 'src/assets/Produto_Nao_Encontrado.png')}
              />
            </div>
          </div>
          
          <div className="modal-right">
            <div className="modal-header">
              <h2 className="modal-title">{item.nome}</h2>
              <span className={`modal-status ${item.emEstoque ? 'em-estoque' : 'fora-estoque'}`}>
                {item.emEstoque ? 'Em estoque' : 'Fora de estoque'}
              </span>
            </div>
            
            <div className="modal-info">
              <div className="modal-price">
                <span className="price-label">Preço:</span>
                <span className="price-value">R$ {item.preco.toFixed(2)}</span>
              </div>
              
              <div className="modal-stock">
                <span className="stock-label">Estoque disponível:</span>
                <span className="stock-value">{item.quantidade} unidades</span>
              </div>
              
              {item.categoria && (
                <div className="modal-category">
                  <span className="category-label">Categoria:</span>
                  <span className="category-value">{item.categoria}</span>
                </div>
              )}
            </div>
            
            <div className="modal-description">
              <h3>Descrição</h3>
              <p>{item.descricao}</p>
            </div>
            
            <div className="modal-actions">
              <button 
                className="btn-modal-add"
                onClick={handleAddToCart}
                disabled={!item.emEstoque}
              >
                {item.emEstoque ? 'Adicionar ao Carrinho' : 'Fora de Estoque'}
              </button>
              <button className="btn-modal-close" onClick={onClose}>
                Fechar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalDetalhes;
