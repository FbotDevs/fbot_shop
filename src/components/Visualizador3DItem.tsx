// src/components/Visualizador3DItem.tsx
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls, Environment } from '@react-three/drei';

interface Visualizador3DItemProps {
  modelPath: string;
  autoRotate?: boolean;
  enableControls?: boolean;
  scale?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
}

// Componente do modelo 3D
function Modelo({ modelPath, autoRotate = true, scale = 1.0, position = [0, 0, 0], rotation = [0, 0, 0] }: {
  modelPath: string;
  autoRotate?: boolean;
  scale?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
}) {
  const modelRef = useRef<THREE.Object3D>(null);
  // Carrega o GLTF e mantém uma instância estável do objeto entre re-renders
  const gltf = useGLTF(modelPath);
  const sceneInstance = useMemo(() => gltf.scene.clone(), [gltf.scene]);

  // Animação de rotação automática
  useFrame((state, delta) => {
    // Só gira se autoRotate for explicitamente true
    if (modelRef.current && autoRotate === true) {
      modelRef.current.rotation.y += delta * 0.5;
    }
  });
  
  return <primitive ref={modelRef} object={sceneInstance} scale={scale} position={position} rotation={rotation} />;
}

export function Visualizador3DItem({ 
  modelPath, 
  autoRotate = true, 
  enableControls = true, 
  scale = 1.0,
  position = [0, -2, 0],
  rotation = [0, 0, 0]
}: Visualizador3DItemProps) {
  return (
    <Canvas style={{ background: 'transparent', width: '100%', height: '100%' }}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} />
      <pointLight position={[-10, -10, -10]} intensity={0.3} />
      
      <Modelo 
        modelPath={modelPath}
        autoRotate={autoRotate}
        scale={scale}
  position={position}
  rotation={rotation}
      />

      {enableControls && (
        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          maxDistance={8}
          minDistance={1}
          enableDamping={true}
          dampingFactor={0.1}
        />
      )}
      
      <Environment preset="city" />
    </Canvas>
  );
}

// Preload dos modelos principais
useGLTF.preload('/coca_cola_soda_can.glb');
useGLTF.preload('/doritos_package.glb');
useGLTF.preload('/monster_energy_drink.glb');
