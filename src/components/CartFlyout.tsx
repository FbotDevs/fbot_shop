import React from 'react';
import { CarrinhoItem } from '../types';

interface CartFlyoutProps {
	isOpen: boolean;
	items: CarrinhoItem[];
	onClose: () => void;
	onIncrement: (itemId: number) => void;
	onDecrement: (itemId: number) => void;
	onRemove: (itemId: number) => void;
	onCheckout: () => void;
}

const CartFlyout: React.FC<CartFlyoutProps> = ({
	isOpen,
	items,
	onClose,
	onIncrement,
	onDecrement,
	onRemove,
	onCheckout,
}) => {
	const total = items.reduce((acc, ci) => acc + ci.item.preco * ci.quantidadeSelecionada, 0);
	return (
		<div className={`cart-flyout ${isOpen ? 'open' : ''}`}>
			<div className="cart-header">
				<h3>Sua Cesta</h3>
				<button className="cart-close" onClick={onClose}>×</button>
			</div>
			<div className="cart-body">
				{items.length === 0 ? (
					<p className="cart-empty">Sua cesta está vazia.</p>
				) : (
					items.map(({ item, quantidadeSelecionada }) => (
						<div key={item.id} className="cart-line">
							<div className="cart-line-info">
								<div className="cart-line-title">{item.nome}</div>
								<div className="cart-line-price">R$ {item.preco.toFixed(2)}</div>
							</div>
							<div className="cart-line-actions">
								<button onClick={() => onDecrement(item.id)} disabled={quantidadeSelecionada <= 1}>-</button>
								<span className="cart-line-qty">{quantidadeSelecionada}</span>
								<button onClick={() => onIncrement(item.id)}>+</button>
								<button className="cart-line-remove" onClick={() => onRemove(item.id)}>Remover</button>
							</div>
						</div>
					))
				)}
			</div>
			<div className="cart-footer">
				<div className="cart-total">
					<span>Total</span>
					<strong>R$ {total.toFixed(2)}</strong>
				</div>
				<button className="cart-checkout" onClick={onCheckout} disabled={items.length === 0}>Finalizar Pedido</button>
			</div>
		</div>
	);
};

export default CartFlyout;

