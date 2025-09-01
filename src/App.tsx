import React, { useState, useEffect } from 'react';
import './App.css';
import { ItemLoja } from './components/ItemLoja';
import { LojaItem, CarrinhoItem } from './types';
import { fetchItensLoja, getItemById } from './services/items';

function App() {
  const [carrinho, setCarrinho] = useState<CarrinhoItem[]>([]);
  const [itensLoja, setItensLoja] = useState<LojaItem[]>([]);
  const [codigoProduto, setCodigoProduto] = useState<string>('');
  const [mostrarQRCode, setMostrarQRCode] = useState<boolean>(false);
  const [itemDetalhes, setItemDetalhes] = useState<LojaItem | null>(null);
  const [tempoPressionado, setTempoPressionado] = useState<number>(0);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  const adicionarAoCarrinho = (item: LojaItem) => {
    const lojaItem = itensLoja.find((it) => it.id === item.id);
    if (!lojaItem || (lojaItem.quantidade ?? 0) <= 0 || !lojaItem.emEstoque) return;

    setCarrinho((carrinhoAtual) => {
      const itemExistente = carrinhoAtual.find((c) => c.item.id === item.id);
      return itemExistente
        ? carrinhoAtual.map((c) =>
            c.item.id === item.id
              ? { ...c, quantidadeSelecionada: c.quantidadeSelecionada + 1 }
              : c
          )
        : [...carrinhoAtual, { item, quantidadeSelecionada: 1 }];
    });

    setItensLoja((lista) =>
      lista.map((it) =>
        it.id === item.id
          ? {
              ...it,
              quantidade: Math.max(0, (it.quantidade ?? 0) - 1),
              emEstoque: Math.max(0, (it.quantidade ?? 0) - 1) > 0,
            }
          : it
      )
    );
  };

  const handleDecrement = (itemId: number) => {
    const existing = carrinho.find((c) => c.item.id === itemId);
    if (!existing) return;

  if (existing.quantidadeSelecionada <= 1) {
      setCarrinho((prev) => prev.filter((c) => c.item.id !== itemId));
      setItensLoja((prev) =>
        prev.map((it) =>
          it.id === itemId
            ? { ...it, quantidade: (it.quantidade ?? 0) + 1, emEstoque: ((it.quantidade ?? 0) + 1) > 0 }
            : it
        )
      );
    } else {
      
      setCarrinho((prev) =>
        prev.map((c) => (c.item.id === itemId ? { ...c, quantidadeSelecionada: c.quantidadeSelecionada - 1 } : c))
      );
      setItensLoja((prev) =>
        prev.map((it) =>
          it.id === itemId
            ? { ...it, quantidade: (it.quantidade ?? 0) + 1, emEstoque: ((it.quantidade ?? 0) + 1) > 0 }
            : it
        )
      );
    }
  };

  const handleRemove = (itemId: number) => {
    const existing = carrinho.find((c) => c.item.id === itemId);
    if (!existing) return;
    const qtyToReturn = existing.quantidadeSelecionada;
    setCarrinho((prev) => prev.filter((c) => c.item.id !== itemId));
    setItensLoja((prev) =>
      prev.map((it) =>
        it.id === itemId
          ? { ...it, quantidade: (it.quantidade ?? 0) + qtyToReturn, emEstoque: ((it.quantidade ?? 0) + qtyToReturn) > 0 }
          : it
      )
    );
  };

  const calcularTotal = () =>
    carrinho.reduce(
      (total, { item, quantidadeSelecionada }) =>
        total + item.preco * quantidadeSelecionada,
      0
    );

  const finalizarCompra = () => {
    if (carrinho.length > 0) {
      setMostrarQRCode(true);
      setCarrinho([]);
    } else {
  alert('O carrinho está vazio.');
    }
  };

  const handleAdicionarPorCodigo = () => {
    const id = parseInt(codigoProduto, 10);
    if (!isNaN(id)) {
      const item = getItemById(itensLoja, id);
      if (item) {
        if ((item.quantidade ?? 0) <= 0) {
          alert('Produto indisponível.');
        } else {
          setCarrinho((carrinhoAtual) => {
            const itemExistente = carrinhoAtual.find((c) => c.item.id === item.id);
            return itemExistente
              ? carrinhoAtual.map((c) =>
                  c.item.id === item.id
                    ? { ...c, quantidadeSelecionada: c.quantidadeSelecionada + 1 }
                    : c
                )
              : [...carrinhoAtual, { item, quantidadeSelecionada: 1 }];
          });

          setItensLoja((lista) =>
            lista.map((it) =>
              it.id === item.id
                ? {
                    ...it,
                    quantidade: Math.max(0, (it.quantidade ?? 0) - 1),
                    emEstoque: Math.max(0, (it.quantidade ?? 0) - 1) > 0,
                  }
                : it
            )
          );
        }
      } else {
        alert('Produto não encontrado.');
      }
      setCodigoProduto('');
    } else {
      alert('Código inválido.');
    }
  };

  const handleVerDetalhes = (item: LojaItem) => setItemDetalhes(item);
  const fecharDetalhes = () => setItemDetalhes(null);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAdicionarPorCodigo();
    } else if (e.key === ' ' && !intervalId) {
      e.preventDefault();
      const id = setInterval(() => {
        setTempoPressionado((tempo) => {
          if (tempo >= 1.5) {
            finalizarCompra();
            clearInterval(id);
            setIntervalId(null);
            return 0;
          }
          return tempo + 0.1;
        });
      }, 100);
      setIntervalId(id);
    } else if (e.key === 'Escape') {
    if (mostrarQRCode) {
        setMostrarQRCode(false);
      }
      if (itemDetalhes) {
        setItemDetalhes(null);
      }
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent) => {
    if (e.key === ' ') {
      if (intervalId) {
        clearInterval(intervalId);
        setIntervalId(null);
      }
      setTempoPressionado(0);
    }
  };

  useEffect(() => {
    (async () => {
      const itens = await fetchItensLoja();
      setItensLoja(itens);
    })();
  const inputElement = document.getElementById('codigo-produto-input') as HTMLInputElement;
    if (inputElement) {
      inputElement.focus();
    }
  }, []);

  useEffect(() => {
  const inputElement = document.getElementById('codigo-produto-input') as HTMLInputElement;
    if (inputElement) {
      inputElement.focus();
    }
  }, [carrinho, mostrarQRCode, itemDetalhes]);

  return (
    <div
      className="container-principal"
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      tabIndex={0}
    >
      <div className="coluna-esquerda">
        <img src="src/assets/Logo_FSHOP_LOGO.svg" alt="FShop Logo" className="logo-fshop" />
        <h2>Carrinho</h2>
        <div className="carrinho-itens">
          {carrinho.length === 0 ? (
            <p>Carrinho vazio.</p>
          ) : (
            carrinho.map(({ item, quantidadeSelecionada }) => (
              <div key={item.id} className="carrinho-item">
                <span>{item.nome}</span>
                <div className="carrinho-acoes">
                  <span className="quantidade">Qtd: {quantidadeSelecionada}</span>
                  <button
                    onClick={() => adicionarAoCarrinho(item)}
                    disabled={!(itensLoja.find((it) => it.id === item.id)?.emEstoque && (itensLoja.find((it) => it.id === item.id)?.quantidade ?? 0) > 0)}
                    title={! (itensLoja.find((it) => it.id === item.id)?.emEstoque && (itensLoja.find((it) => it.id === item.id)?.quantidade ?? 0) > 0) ? 'Item indisponível' : 'Adicionar mais'}
                  >
                    +
                  </button>
                  <button onClick={() => handleDecrement(item.id)}>-</button>
                  <button onClick={() => handleRemove(item.id)} className="botao-lixeira">
                    🗑️
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="carrinho-total">
          <h3>Total: R$ {calcularTotal().toFixed(2)}</h3>
          <button className="finalizar-compra" onClick={finalizarCompra}>
            Finalizar Compra
          </button>
        </div>
      </div>
      <div className="coluna-direita">
        <h1>Catálogo</h1>
        <div className="produtos-grid">
          {itensLoja.map((item) => (
            <ItemLoja
              key={item.id}
              item={item}
              onAddToCart={adicionarAoCarrinho}
              onViewDetails={handleVerDetalhes}
            />
          ))}
        </div>
      </div>
      {tempoPressionado > 0 && (
        <div className="carregamento">
          <div className="carregamento-barra" style={{ width: `${(tempoPressionado / 1.5) * 100}%` }} />
        </div>
      )}
      {mostrarQRCode && (
        <div className="qrcode-popup">
          <div className="qrcode-popup-content">
            <h2>Escaneie o QR Code para efetuar o pagamento</h2>
            <img
              src="src/assets/QR_CODE_Placeholder.png"
              alt="QR Code Placeholder"
              className="qrcode-image"
            />
            <button onClick={() => setMostrarQRCode(false)}>Fechar</button>
          </div>
        </div>
      )}
      {itemDetalhes && (
        <div className="detalhes-popup">
          <div className="detalhes-popup-content">
            <h2>{itemDetalhes.nome}</h2>
            <p>{itemDetalhes.descricao}</p>
            <p>Preço: R$ {itemDetalhes.preco.toFixed(2)}</p>
            <button onClick={fecharDetalhes}>Fechar</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;