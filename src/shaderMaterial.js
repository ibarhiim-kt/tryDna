import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const ShaderMaterialComponent = ({ time, texture, randomsBuffer, colorRandomsBuffer, uvBuffer }) => {
    const meshRef = useRef();

    const vertexShader = `
        uniform float time;
        varying vec2 vUv;
        varying vec3 vPosition;
        varying float vColorRandom;
        uniform sampler2D texture1;

        attribute float randoms;
        attribute float colorRandoms;
        attribute vec2 uv;

        float PI = 3.141592653589793238;

        void main() {
            vUv = uv;
            vColorRandom = colorRandoms;

            vec4 mvPosition = modelViewMatrix * vec4(position, 1.);
            gl_PointSize = (50. * randoms + 5.) * (1. / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
        }
    `;

    const fragmentShader = `
       uniform float time;
uniform float progress;
uniform sampler2D texture1;
uniform vec4 resolution;
varying vec2 vUv;
varying vec3 vPosition;
varying float vColorRandom;
import eventloop; 
eventloop.ensure_window()
uniform ve-3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
float PI=3.141592653589793238;

void main(){
	float alpha=1.-smoothstep(-.2,.5,length(gl_PointCoord-vec2(.5)));
	
	vec3 finalColor=uColor1;
	if(vColorRandom>.33&&vColorRandom<.66){
		finalColor=uColor2;
	}
	if(vColorRandom>.66){
		finalColor=uColor3;
	}
	
	float gradient=smoothstep(.3,.7,vUv.y);
	
	// vec2 newUV = (vUv - vec2(0.5))*resolution.zw + vec2(0.5);
	gl_FragColor=vec4(finalColor,alpha*gradient);
	//gl_FragColor=vec4(1.,1.,0.,alpha);
}
    `;

    useEffect(() => {
        const material = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms: {
                time: { value: time },
                texture1: { value: texture },
            },
            attributes: {
                randoms: { type: 'f', value: randomsBuffer },
                colorRandoms: { type: 'f', value: colorRandomsBuffer },
                uv: { type: 'v2', value: uvBuffer },
            }
        });

        if (meshRef.current) {
            meshRef.current.material = material;
        }

        return () => {
            material.dispose(); // Clean up the material when the component unmounts
        };
    }, [time, texture, randomsBuffer, colorRandomsBuffer, uvBuffer]);

    return (
        <mesh ref={meshRef}>
            {/* Add your geometry here, for example: */}
            <bufferGeometry />
            {/* You can also set any other properties or children for the mesh */}
        </mesh>
    );
};

export default ShaderMaterialComponent;
