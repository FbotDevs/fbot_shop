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
  const [itemSelecionadoIndex, setItemSelecionadoIndex] = useState<number>(0);
  const [itemDetalhes, setItemDetalhes] = useState<LojaItem | null>(null); // Estado para o item em detalhes
  const [tempoPressionado, setTempoPressionado] = useState<number>(0);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  const adicionarAoCarrinho = (item: LojaItem) => {
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
      } else {
        alert('Produto não encontrado.');
      }
      setCodigoProduto(''); // Clear input after adding
    } else {
      alert('Código inválido.');
    }
  };

  const handleVerDetalhes = (item: LojaItem) => {
    setItemDetalhes(item); // Define o item selecionado para exibir os detalhes
  };

  const fecharDetalhes = () => {
    setItemDetalhes(null); // Fecha os detalhes
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAdicionarPorCodigo(); // Add item by code on Enter
    } else if (e.key === ' ' && !intervalId) {
      e.preventDefault();
      const id = setInterval(() => {
        setTempoPressionado((tempo) => {
          if (tempo >= 1.5) {
            finalizarCompra(); // Finalize purchase after holding Space
            clearInterval(id);
            setIntervalId(null);
            return 0;
          }
          return tempo + 0.1;
        });
      }, 100);
      setIntervalId(id);
    } else if (e.key === 'Escape') {
      // Fecha os popups ao pressionar Esc
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
    // Automatically focus on the product code input when the page loads
    const inputElement = document.getElementById('codigo-produto-input') as HTMLInputElement;
    if (inputElement) {
      inputElement.focus();
    }
  }, []);

  useEffect(() => {
    // Refocus on the product code input whenever the cart changes ou popups close
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
                  <button onClick={() => adicionarAoCarrinho(item)}>+</button>
                  <button
                    onClick={() =>
                      setCarrinho((cs) =>
                        cs.map((c) =>
                          c.item.id === item.id
                            ? {
                                ...c,
                                quantidadeSelecionada: Math.max(
                                  1,
                                  c.quantidadeSelecionada - 1
                                ),
                              }
                            : c
                        )
                      )
                    }
                  >
                    -
                  </button>
                  <button
                    onClick={() =>
                      setCarrinho((cs) => cs.filter((c) => c.item.id !== item.id))
                    }
                    className="botao-lixeira"
                  >
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
        <div className="adicionar-por-codigo">
          <input
            id="codigo-produto-input" // Added ID for easier focus management
            type="text"
            value={codigoProduto}
            onChange={(e) => setCodigoProduto(e.target.value)}
            placeholder="Código do produto"
          />
          <button onClick={handleAdicionarPorCodigo}>+</button>
        </div>
      </div>
      <div className="coluna-direita">
        <h1>Catálogo</h1>
        <div className="produtos-grid">
          {itensLoja.map((item) => (
            <div key={item.id} className="item-card">
              <img src={item.imagem} alt={item.nome} className="item-image" />
              <h3 className="item-nome">{item.nome}</h3>
              <p className="item-preco">R$ {item.preco.toFixed(2)}</p>
              <p className="item-codigo">Código: {item.id}</p>
              <div className="item-buttons">
                <button onClick={() => adicionarAoCarrinho(item)} className="btn-adicionar">
                  Adicionar
                </button>
                <button onClick={() => handleVerDetalhes(item)} className="btn-detalhes">
                  Detalhes
                </button>
              </div>
            </div>
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
              src="https://via.placeholder.com/200"
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