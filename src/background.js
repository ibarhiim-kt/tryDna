import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import fragment from "./shader/fragment.glsl";
import vertex from "./shader/vertex.glsl";
import dnaGlb from './model/dna.glb';

const ThreeScene = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    // Initialize Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setClearColor(0x141414, 1);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    containerRef.current.appendChild(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(
      70,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.001,
      1000
    );
    camera.position.set(-1.5, 3, 4);

    // Background Plane
    const backgroundGeometry = new THREE.PlaneGeometry(100, 100);
    const backgroundMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.DoubleSide });
    const backgroundPlane = new THREE.Mesh(backgroundGeometry, backgroundMaterial);
    backgroundPlane.position.z = -5;
    scene.add(backgroundPlane);

    // GLTF Loader
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/draco/gltf/');
    
    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);

    let dna;
    loader.load(
  dnaGlb,
      (gltf) => {
        const geometry = gltf.scene.children[0].geometry;
        geometry.center();

        const material = new THREE.ShaderMaterial({
          extensions: { derivatives: "#extension GL_OES_standard_derivatives : enable" },
          side: THREE.DoubleSide,
          uniforms: {
            time: { value: 0 },
            uColor1: { value: new THREE.Color(0x0c0317) },
            uColor2: { value: new THREE.Color(0x170624) },
            uColor3: { value: new THREE.Color(0x07112e) },
            resolution: { value: new THREE.Vector4() }
          },
          transparent: true,
          vertexShader: vertex,
          fragmentShader: fragment,
          depthTest: false,
          depthWrite: false,
          blending: THREE.AdditiveBlending
        });

        dna = new THREE.Points(geometry, material);
        scene.add(dna);
      },
      undefined,
      (error) => console.error('An error occurred loading the GLTF model:', error)
    );

    // Stars
    const starsGeometry = new THREE.BufferGeometry();
    const starsCount = 500;
    const posArray = new Float32Array(starsCount * 3);
    for (let i = 0; i < starsCount * 3; i++) {
      posArray[i] = ((Math.random() + 0.5) * 10) - 10;
    }

    const starsMaterial = new THREE.PointsMaterial({ size: 0.006, color: 0xa9a9a9 });
    starsGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const starsMesh = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(starsMesh);

    // Render Loop
    let time = 0;
    const render = () => {
      time += 0.05;
      if (dna) dna.rotation.y += 0.001;
      if (starsMesh) starsMesh.rotation.y = time / 25;
      if (dna?.material) dna.material.uniforms.time.value = time;
      renderer.render(scene, camera);
      requestAnimationFrame(render);
    };

    render();

    // Handle Resize
    const handleResize = () => {
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      containerRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '100vh' }} />;
};

export default ThreeScene;
