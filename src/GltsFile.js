import React, { useEffect, useRef } from 'react';
import { useGLTF } from '@react-three/drei';

export default function GltsFile({ customColors, ...props }) {
  const group = useRef();
  const { nodes, materials } = useGLTF('/assets/model/dna.glb');

  useEffect(() => {
    if (group.current) {
      group.current.rotation.y = Math.PI / 2;
      group.current.rotation.x = 0;
      group.current.rotation.z = 0;
    }
  }, [group]);
                
  return (
    <group ref={group} {...props} dispose={null} scale={1}>
      <mesh
        geometry={nodes.twist1_1.geometry}
        material={materials.material1} // Replace with actual material names
        material-color={customColors.color1}
      />
      <mesh
        geometry={nodes.twist1_2.geometry}
        material={materials.material2} // Replace with actual material names
        material-color={customColors.color2}
      />
      {/* Add more meshes as needed */}
    </group>
  );
}

useGLTF.preload('/assets/model/dna.glb');
