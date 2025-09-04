import React from 'react';

interface PopupPedidoSucessoProps {
  aberto: boolean;
  onClose: () => void;
}

const PopupPedidoSucesso: React.FC<PopupPedidoSucessoProps> = ({ aberto, onClose }) => {
  if (!aberto) return null;
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0,0,0,0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000
    }}>
      <div style={{
        background: '#fff',
        borderRadius: 12,
        padding: '2rem 2.5rem',
        boxShadow: '0 4px 32px rgba(0,0,0,0.18)',
        textAlign: 'center',
        minWidth: 320
      }}>
        <h2 style={{ color: '#28a745', marginBottom: 16 }}>Pedido realizado com sucesso!</h2>
        <p style={{ color: '#222', marginBottom: 24 }}>Seu pedido foi efetuado e está sendo processado.</p>
  <button className="cursor-target" onClick={onClose} style={{
          background: '#fe5000',
          color: '#fff',
          border: 'none',
          borderRadius: 8,
          padding: '0.8rem 2rem',
          fontWeight: 700,
          fontSize: 18,
          cursor: 'pointer',
        }}>OK</button>
      </div>
    </div>
  );
};

export default PopupPedidoSucesso;
