// src/components/Visualizador3D.tsx

import { useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls, Environment } from '@react-three/drei';

// O modelo 3D deve estar na pasta /public
const caminhoDoModelo = '/coca_cola_soda_can.glb'; 

// O componente Modelo agora aceita 'props' (como a posição inicial)
function Modelo(props) {
  const { scene } = useGLTF(caminhoDoModelo);
  const modelRef = useRef<THREE.Object3D>(); 

  // Hook para animar a cada frame
  useFrame((state, delta) => {
    if (modelRef.current) {
      // Animação de rotação contínua no eixo Y
      modelRef.current.rotation.y += delta * 0.5;
    }
  });
  
  // A 'position' e outras props são aplicadas diretamente ao objeto
  return <primitive ref={modelRef} object={scene} scale={1.0} {...props} />;
}

export function Visualizador3D() {
  return (
    <Canvas style={{ background: '#101010', borderRadius: '10px' }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      
      {/* Aqui definimos a posição inicial do modelo: [x, y, z] */}
      {/* Exemplo: [0, -1, 0] move o objeto 1 unidade para baixo */}
      <Modelo position={[0, -2, 0]} /> 

      <OrbitControls enableZoom={false} enablePan={false} />
      <Environment preset="sunset" />
    </Canvas>
  );
}
