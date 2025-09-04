
import { CarrinhoItem } from "../types";

export interface OrderPayload {
	items: Array<{ id: number; quantidade: number; }>;
	total: number;
	createdAt: string;
}

export async function submitOrder(cart: CarrinhoItem[]): Promise<OrderPayload> {
	const payload: OrderPayload = {
		items: cart.map(ci => ({ id: ci.item.id, quantidade: ci.quantidadeSelecionada })),
		total: cart.reduce((acc, ci) => acc + ci.item.preco * ci.quantidadeSelecionada, 0),
		createdAt: new Date().toISOString(),
	};
	await new Promise(r => setTimeout(r, 400));
	return payload;
}

