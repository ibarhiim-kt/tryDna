
import React from 'react'
import { useGLTF } from '@react-three/drei'

export default function Model(props) {
  const { nodes, materials } = useGLTF('/dna.gltf')
  return (
    <group {...props} dispose={null}>
      <mesh geometry={nodes.twist1_1.geometry} material={materials['Material.002']} />
    </group>
  )
}

useGLTF.preload('/dna.gltf')
