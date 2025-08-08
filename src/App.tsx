// src/App.tsx
import './App.css';
import { Visualizador3D } from './components/Visualizador3D';

function App() {
  return (
    <div className="container-principal">

      {/*                                                                                        ===== COLUNA DA ESQUERDA (30%) ===== */}
      <div className="coluna-esquerda">

        {/*                                                                        O modelo 3D agora é um fundo que preenche a coluna */}
        <div className="visualizador-fundo">
          <Visualizador3D />
        </div>

        {                                                               /* Todo o conteúdo visível fica agrupado e sobreposto ao fundo */}
        <div className="conteudo-sobreposto">
          <div className="topo">
            <img src="src\assets\Logo_FSHOP_LOGO.svg" alt="Logo FSHOP" />
            <h2 className="produto-nome">Coca-Cola Lata</h2>
          </div>

          <div className="rodape">
            <p className="preco">R$ 9,00</p>
            <div className="button-group">
              <button className="comprar-button">EU QUERO</button>
              <button className="vermais-button">Ver mais</button>
            </div>
            <div className="valor-total-container">
              <div className="icone-cesta">
                <img src="src/assets/Ico_Cesta.svg" alt="Cesta" />
              </div>
              <span className="valor-texto">Valor total:</span>
              <span className="valor-preco">R$ 7,00</span>
            </div>
          </div>
        </div>

      </div>

      {                                                                                     /* ===== COLUNA DA DIREITA (70%) ===== */}
      <div className="coluna-direita">
        <h2>Conteúdo Principal</h2>
        <p>
          Esta é a coluna da direita, com 70% da largura. Se o conteúdo aqui for muito grande, 
          uma barra de rolagem aparecerá somente nesta área.
        </p>
        
        {Array.from({ length: 25 }).map((_, index) => (
          <p key={index}>
            Este é o parágrafo de exemplo número {index + 1}. Lorem ipsum dolor sit amet, 
            consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed
            erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh
            porttitor. Ut in nulla enim.
          </p>
        ))}
      </div>

    </div>
  );
}

export default App;
