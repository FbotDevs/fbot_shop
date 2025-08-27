import React, { useState, useEffect } from 'react';
import './App.css';
import { ItemLoja } from './components/ItemLoja';
import CartFlyout from './components/CartFlyout';
import ModalDetalhes from './components/ModalDetalhes';
import PopupPedidoSucesso from './components/PopupPedidoSucesso';
import { LojaItem, CarrinhoItem } from './types';
import { fetchItensLoja, parseFeaturedFromLocation, selectFeaturedItemId, getItemById } from './services/items';
import { submitOrder } from './services/orders';

function App() {
  const [timeRemaining, setTimeRemaining] = useState('');
  const [nextMidnight, setNextMidnight] = useState<number>(() => {
    const now = new Date();
    const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0, 0);
    return next.getTime();
  });

  const [carrinho, setCarrinho] = useState<CarrinhoItem[]>([]);
  const [itemSelecionado, setItemSelecionado] = useState<LojaItem | null>(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [itensLoja, setItensLoja] = useState<LojaItem[]>([]);
  const [destaqueId, setDestaqueId] = useState<number | undefined>(undefined);
  const destaqueItem = getItemById(itensLoja, destaqueId) ?? itensLoja[0];
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [dealItemId, setDealItemId] = useState<number | undefined>(undefined);
  const [pedidoSucessoAberto, setPedidoSucessoAberto] = useState(false);

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
    setIsCartOpen(false);
    setPedidoSucessoAberto(true);
    setCarrinho([]);
  };

  const adicionarDealAoCarrinho = (item: LojaItem) => {
    const precoComDesconto = Number((item.preco * 0.8).toFixed(2));
    setCarrinho(carrinhoAtual => {
      const existente = carrinhoAtual.find(c => c.item.id === item.id);
      if (existente) {
        return carrinhoAtual.map(c =>
          c.item.id === item.id
            ? { ...c, item: { ...c.item, preco: precoComDesconto }, quantidadeSelecionada: c.quantidadeSelecionada + 1 }
            : c
        );
      }
      return [...carrinhoAtual, { item: { ...item, preco: precoComDesconto }, quantidadeSelecionada: 1 }];
    });
  };

  useEffect(() => {
    const updateTimer = () => {
      const now = Date.now();
      let diff = Math.max(0, nextMidnight - now);
      if (diff === 0) {
        const d = new Date();
        const next = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1, 0, 0, 0, 0);
        setNextMidnight(next.getTime());
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

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const itens = await fetchItensLoja();
        if (mounted) {
          setItensLoja(itens);
          const idFromCode = selectFeaturedItemId(itens);
          setDestaqueId(idFromCode);
          if (itens.length > 0) {
            const now = new Date();
            const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0).getTime();
            const dayIndex = Math.floor(startOfDay / 86400000);
            const idx = dayIndex % itens.length;
            setDealItemId(itens[idx].id);
          }
        }
      } catch (error) {
        console.error("Erro ao carregar itens da loja:", error);
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
      <div className="coluna-esquerda">
        <div className="visualizador-fundo">
          {destaqueItem && (
            <img 
              className="produto-imagem"
              src={`src/assets/${destaqueItem.imagem ?? 'Produto_Nao_Encontrado.png'}`}
              alt={destaqueItem.nome}
              onError={(e) => (e.currentTarget.src = 'src/assets/Produto_Nao_Encontrado.png')}
            />
          )}
        </div>
        <div className="conteudo-sobreposto">
          <div className="topo">
            <img className="logo" src="src\\assets\\Logo_FSHOP_LOGO.svg" alt="Logo FSHOP" />
            <h2 className="produto-nome">{destaqueItem?.nome ?? ""}</h2>
          </div>
          <div className="rodape">
            <p className="preco">{destaqueItem ? `R$ ${destaqueItem.preco.toFixed(2)}` : ""}</p>
            <div className="button-group">
              <button className="comprar-button" onClick={() => destaqueItem && adicionarAoCarrinho(destaqueItem)}>EU QUERO</button>
              <button className="vermais-button" onClick={() => destaqueItem && verDetalhes(destaqueItem)}>Ver mais</button>
            </div>
            <div className="valor-total-container">
              <button className="botao-cesta" onClick={abrirCarrinho}>
                <span className="botao-cesta-icone">
                  <img src="src/assets/Ico_Cesta.svg" alt="Cesta" />
                </span>
                <span className="botao-cesta-texto">Ver cesta</span>
              </button>
              <div className="total-pagar">
                <span className="total-label">Total</span>
                <span className="valor-preco">R$ {calcularTotalCarrinho().toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="coluna-direita">
        <h1>Próximo Drop em: <span className="timer">{timeRemaining}</span></h1>
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
              {dealItem && (
                <img 
                  className="produto-imagem"
                  src={`src/assets/${dealItem.imagem ?? 'Produto_Nao_Encontrado.png'}`}
                  alt={dealItem.nome}
                  onError={(e) => (e.currentTarget.src = 'src/assets/Produto_Nao_Encontrado.png')}
                />
              )}
            </div>
          </div>
        ) : (
          <div className="drop-content"><p className="drop-description">Carregando oferta…</p></div>
        )}
      </div>
        <div className="cardapio-section">
          <div className='cardapio-header'>
            <h3>DRINKS</h3>
          </div>
          <p className='cardapio-subtitle'>Refresque-se com as melhores bebidas</p>
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
            <h3>COMIDA</h3>
          </div>
          <p className='cardapio-subtitle'>Lanches e salgadinhos para matar a fome</p>
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
            <h3>DOCES</h3>
          </div>
          <p className='cardapio-subtitle'>Doces para adoçar seu dia</p>
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
          </div>
          <p className='cardapio-subtitle'>Ajude o time de robótica do seu coração</p>
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
      <ModalDetalhes
        item={itemSelecionado}
        isOpen={modalAberto}
        onClose={fecharModal}
        onAddToCart={adicionarAoCarrinho}
      />
      <CartFlyout 
        isOpen={isCartOpen}
        items={carrinho}
        onClose={fecharCarrinho}
        onIncrement={incrementarItem}
        onDecrement={decrementarItem}
        onRemove={removerItem}
        onCheckout={finalizarPedido}
      />
      <PopupPedidoSucesso
        aberto={pedidoSucessoAberto}
        onClose={() => setPedidoSucessoAberto(false)}
      />
    </div>
  );
}

export default App;