// src/App.tsx
import React, { useState, useEffect } from 'react';
import './App.css';
import { Visualizador3DItem } from './components/Visualizador3DItem';
import ItemLoja from './components/ItemLoja';
import CartFlyout from './components/CartFlyout';
import ModalDetalhes from './components/ModalDetalhes';
import { LojaItem, CarrinhoItem } from './types';
import { fetchItensLoja, getItemById, parseFeaturedFromLocation, selectFeaturedItemId } from './services/items';
import { submitOrder } from './services/orders';

function App() {
  // Drop diário: tempo restante e item em oferta
  const [timeRemaining, setTimeRemaining] = useState('');
  const [nextMidnight, setNextMidnight] = useState<number>(() => {
    const now = new Date();
    const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0, 0);
    return next.getTime();
  });
  
  // Estados para a loja
  const [carrinho, setCarrinho] = useState<CarrinhoItem[]>([]);
  const [itemSelecionado, setItemSelecionado] = useState<LojaItem | null>(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [itensLoja, setItensLoja] = useState<LojaItem[]>([]);
  const [destaqueId, setDestaqueId] = useState<number | undefined>(undefined);
  const destaqueItem = getItemById(itensLoja, destaqueId) ?? itensLoja[0];
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [dealItemId, setDealItemId] = useState<number | undefined>(undefined);

  // Funções para gerenciar o carrinho
  const adicionarAoCarrinho = (item: LojaItem) => {
    setCarrinho(carrinhoAtual => {
      const itemExistente = carrinhoAtual.find(c => c.item.id === item.id);
      
      if (itemExistente) {
        return carrinhoAtual.map(c =>
          c.item.id === item.id
            ? { ...c, quantidadeSelecionada: c.quantidadeSelecionada + 1 }
            : c
        );
      } else {
        return [...carrinhoAtual, { item, quantidadeSelecionada: 1 }];
      }
    });
  };

  const verDetalhes = (item: LojaItem) => {
    setItemSelecionado(item);
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
    setItemSelecionado(null);
  };

  const calcularTotalCarrinho = () => {
    return carrinho.reduce((total, carrinhoItem) => 
      total + (carrinhoItem.item.preco * carrinhoItem.quantidadeSelecionada), 0
    );
  };

  // Controles do carrinho
  const abrirCarrinho = () => setIsCartOpen(true);
  const fecharCarrinho = () => setIsCartOpen(false);
  const incrementarItem = (itemId: number) => {
    setCarrinho(cs => cs.map(c => c.item.id === itemId ? { ...c, quantidadeSelecionada: c.quantidadeSelecionada + 1 } : c));
  };
  const decrementarItem = (itemId: number) => {
    setCarrinho(cs => cs.map(c => c.item.id === itemId ? { ...c, quantidadeSelecionada: Math.max(1, c.quantidadeSelecionada - 1) } : c));
  };
  const removerItem = (itemId: number) => {
    setCarrinho(cs => cs.filter(c => c.item.id !== itemId));
  };
  const finalizarPedido = async () => {
    const order = await submitOrder(carrinho);
    console.log('Pedido enviado (stub):', order);
    // Futuro: navegar para tela de confirmação, limpar carrinho conforme regra
    setIsCartOpen(false);
  };

  // Adiciona item da oferta com desconto aplicado (20%)
  const adicionarDealAoCarrinho = (item: LojaItem) => {
    const precoComDesconto = Number((item.preco * 0.8).toFixed(2));
    setCarrinho(carrinhoAtual => {
      const existente = carrinhoAtual.find(c => c.item.id === item.id);
      if (existente) {
        // Atualiza o preço da linha para o valor com desconto e incrementa
        return carrinhoAtual.map(c =>
          c.item.id === item.id
            ? { ...c, item: { ...c.item, preco: precoComDesconto }, quantidadeSelecionada: c.quantidadeSelecionada + 1 }
            : c
        );
      }
      return [...carrinhoAtual, { item: { ...item, preco: precoComDesconto }, quantidadeSelecionada: 1 }];
    });
  };

  // Timer até a próxima virada de dia local e troca do item em oferta
  useEffect(() => {
    const updateTimer = () => {
      const now = Date.now();
      let diff = Math.max(0, nextMidnight - now);
      if (diff === 0) {
        // recalcula próxima meia-noite e troca o item em oferta
        const d = new Date();
        const next = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1, 0, 0, 0, 0);
        setNextMidnight(next.getTime());
        // Troca do item será tratada abaixo quando itens estiverem carregados
      }
      const h = Math.floor(diff / 3600000);
      diff -= h * 3600000;
      const m = Math.floor(diff / 60000);
      diff -= m * 60000;
      const s = Math.floor(diff / 1000);
      setTimeRemaining(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
    };
    const id = setInterval(updateTimer, 1000);
    updateTimer();
    return () => clearInterval(id);
  }, [nextMidnight]);

  // Carregar itens e definir destaque via código (pode alternar para URL quando quiser)
  useEffect(() => {
    let mounted = true;
    (async () => {
      const itens = await fetchItensLoja();
      if (!mounted) return;
      setItensLoja(itens);
      // selecione via código (altere em selectFeaturedItemId); para URL, use parseFeaturedFromLocation()
      const idFromCode = selectFeaturedItemId(itens);
      setDestaqueId(idFromCode);
      // Define item da oferta do dia com base no dia local
      if (itens.length > 0) {
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0).getTime();
        const dayIndex = Math.floor(startOfDay / 86400000);
        const idx = dayIndex % itens.length;
        setDealItemId(itens[idx].id);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const dealItem = getItemById(itensLoja, dealItemId);
  const dealPrice = dealItem ? Number((dealItem.preco * 0.8).toFixed(2)) : undefined;
  return (
    <div className="container-principal">

      {/*                                                                                        ===== COLUNA DA ESQUERDA (30%) ===== */}
      <div className="coluna-esquerda">

        {/*                                                                        O modelo 3D agora é um fundo que preenche a coluna */}
        <div className="visualizador-fundo">
          {destaqueItem && (
            <Visualizador3DItem 
              modelPath={`/${destaqueItem.modelo3d}`}
              autoRotate={true}
              enableControls={true}
              scale={1.0}
              position={[0, -2, 0]}
            />
          )}
        </div>

        {                                                               /* Todo o conteúdo visível fica agrupado e sobreposto ao fundo */}
        <div className="conteudo-sobreposto">
          <div className="topo">
            <img src="src\\assets\\Logo_FSHOP_LOGO.svg" alt="Logo FSHOP" />
            <h2 className="produto-nome">{destaqueItem?.nome ?? ""}</h2>
          </div>

          <div className="rodape">
            <p className="preco">{destaqueItem ? `R$ ${destaqueItem.preco.toFixed(2)}` : ""}</p>
            <div className="button-group">
              <button className="comprar-button" onClick={() => destaqueItem && adicionarAoCarrinho(destaqueItem)}>EU QUERO</button>
              <button className="vermais-button" onClick={() => destaqueItem && verDetalhes(destaqueItem)}>Ver mais</button>
            </div>
            <div className="valor-total-container">
              <div className="icone-cesta">
                <img src="src/assets/Ico_Cesta.svg" alt="Cesta" />
              </div>
              <span className="valor-texto">Valor total:</span>
              <span className="valor-preco">R$ {calcularTotalCarrinho().toFixed(2)}</span>
              <button className="vermais-button" onClick={abrirCarrinho}>Abrir Cesta</button>
            </div>
          </div>
        </div>

      </div>

      {                                                                                     /* ===== COLUNA DA DIREITA (70%) ===== */}
      <div className="coluna-direita">
        <h1>Próximo Drop em: <span className="timer">{timeRemaining}</span></h1>
       {/* Drop com Timer Dinâmico */}
      <div className="drop-section">
        {dealItem ? (
          <div className="deal-layout">
            <div className="deal-info">
              <div className="deal-name">{dealItem.nome}</div>
              <div className="deal-prices">
                <span className="deal-old">R$ {dealItem.preco.toFixed(2)}</span>
                <span className="deal-new">R$ {dealPrice?.toFixed(2)}</span>
                <span className="deal-badge">-20%</span>
              </div>
              <button className="deal-button" onClick={() => adicionarDealAoCarrinho(dealItem)}>Aproveitar</button>
            </div>
            <div className="deal-viewer">
              <Visualizador3DItem 
                modelPath={`/${dealItem.modelo3d}`}
                autoRotate={dealItem.viewer?.autoRotate ?? true}
                enableControls={false}
                scale={dealItem.viewer?.scale ?? 1.0}
                position={dealItem.viewer?.position ?? [0, -1.8, 0]}
                rotation={dealItem.viewer?.rotation ?? [0, 0, 0]}
              />
            </div>
          </div>
        ) : (
          <div className="drop-content"><p className="drop-description">Carregando oferta…</p></div>
        )}
      </div>
       {/* Cardápio: uma linha por tipo com scroll horizontal */}
        <div className="cardapio-section">
          <div className='cardapio-header'>
            <h3>DRINKS</h3>
            <p className='cardapio-subtitle'>Refresque-se com as melhores bebidas</p>
          </div>
          <div className="itens-loja">
            {itensLoja.filter(i => i.tipo === 'bebida').map(item => (
              <ItemLoja
                key={item.id}
                item={item}
                onAddToCart={adicionarAoCarrinho}
                onViewDetails={verDetalhes}
              />
            ))}
          </div>

          <div className='cardapio-header'>
            <h3>FOOD</h3>
            <p className='cardapio-subtitle'>Lanches e salgadinhos para matar a fome</p>
          </div>
          <div className="itens-loja">
            {itensLoja.filter(i => i.tipo === 'comida').map(item => (
              <ItemLoja
                key={item.id}
                item={item}
                onAddToCart={adicionarAoCarrinho}
                onViewDetails={verDetalhes}
              />
            ))}
          </div>

          <div className='cardapio-header'>
            <h3>SWEETS</h3>
            <p className='cardapio-subtitle'>Doces para adoçar seu dia</p>
          </div>
          <div className="itens-loja">
            {itensLoja.filter(i => i.tipo === 'doces').map(item => (
              <ItemLoja
                key={item.id}
                item={item}
                onAddToCart={adicionarAoCarrinho}
                onViewDetails={verDetalhes}
              />
            ))}
          </div>

          <div className='cardapio-header'>
            <h3>MERCH</h3>
            <p className='cardapio-subtitle'>Leve a marca com você</p>
          </div>
          <div className="itens-loja">
            {itensLoja.filter(i => i.tipo === 'merch').map(item => (
              <ItemLoja
                key={item.id}
                item={item}
                onAddToCart={adicionarAoCarrinho}
                onViewDetails={verDetalhes}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Modal de detalhes */}
      <ModalDetalhes
        item={itemSelecionado}
        isOpen={modalAberto}
        onClose={fecharModal}
        onAddToCart={adicionarAoCarrinho}
      />

      {/* Flyout do carrinho */}
      <CartFlyout 
        isOpen={isCartOpen}
        items={carrinho}
        onClose={fecharCarrinho}
        onIncrement={incrementarItem}
        onDecrement={decrementarItem}
        onRemove={removerItem}
        onCheckout={finalizarPedido}
      />

    </div>
  );
}

export default App;
