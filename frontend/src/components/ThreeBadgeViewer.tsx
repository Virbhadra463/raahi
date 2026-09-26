import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ThreeBadgeViewerProps {
  colorHex?: string;
  badgeName: string;
  isUnlocked: boolean;
}

export const ThreeBadgeViewer: React.FC<ThreeBadgeViewerProps> = ({
  colorHex = '#F09367',
  badgeName,
  isUnlocked = true
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 240;
    const height = container.clientHeight || 240;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 4.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    container.appendChild(renderer.domElement);

    // Warm Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xFFFFFF, 1.2);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xFECE79, 2.5);
    keyLight.position.set(3, 4, 3);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xF0A599, 1.5);
    fillLight.position.set(-3, -2, 2);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xD9B552, 2.0);
    rimLight.position.set(0, -3, -2);
    scene.add(rimLight);

    // 3D Medallion Group
    const medalGroup = new THREE.Group();
    scene.add(medalGroup);

    const parsedColor = new THREE.Color(isUnlocked ? colorHex : '#A0A0A0');

    // Outer Beveled Golden Coin Body
    const coinGeo = new THREE.CylinderGeometry(1.2, 1.2, 0.18, 32);
    const coinMat = new THREE.MeshStandardMaterial({
      color: isUnlocked ? 0xE6A341 : 0x888888,
      metalness: isUnlocked ? 0.85 : 0.2,
      roughness: isUnlocked ? 0.25 : 0.7
    });
    const coinMesh = new THREE.Mesh(coinGeo, coinMat);
    coinMesh.rotation.x = Math.PI / 2;
    medalGroup.add(coinMesh);

    // Inner Gem Inlay
    const gemGeo = new THREE.CylinderGeometry(0.9, 0.9, 0.22, 16);
    const gemMat = new THREE.MeshStandardMaterial({
      color: parsedColor,
      metalness: isUnlocked ? 0.5 : 0.1,
      roughness: isUnlocked ? 0.15 : 0.8,
      emissive: isUnlocked ? parsedColor : new THREE.Color(0x000000),
      emissiveIntensity: isUnlocked ? 0.25 : 0
    });
    const gemMesh = new THREE.Mesh(gemGeo, gemMat);
    gemMesh.rotation.x = Math.PI / 2;
    medalGroup.add(gemMesh);

    // Center Star / Diamond Emblem
    const starGeo = new THREE.OctahedronGeometry(0.48, 0);
    const starMat = new THREE.MeshStandardMaterial({
      color: isUnlocked ? 0xFFF9F2 : 0xCCCCCC,
      metalness: 0.9,
      roughness: 0.1
    });
    const starMesh = new THREE.Mesh(starGeo, starMat);
    starMesh.position.z = 0.14;
    medalGroup.add(starMesh);

    // Sparkle Particles around Medallion
    const sparkleCount = isUnlocked ? 30 : 0;
    const sparkleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(sparkleCount * 3);

    for (let i = 0; i < sparkleCount * 3; i += 3) {
      const theta = Math.random() * Math.PI * 2;
      const radius = 1.4 + Math.random() * 0.4;
      positions[i] = Math.cos(theta) * radius;
      positions[i + 1] = Math.sin(theta) * radius;
      positions[i + 2] = (Math.random() - 0.5) * 0.5;
    }
    sparkleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const sparkleMat = new THREE.PointsMaterial({
      color: 0xFECE79,
      size: 0.08,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending
    });
    const sparkles = new THREE.Points(sparkleGeo, sparkleMat);
    medalGroup.add(sparkles);

    let frameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      medalGroup.rotation.y = elapsed * 0.9;
      medalGroup.rotation.x = Math.sin(elapsed * 1.2) * 0.15;
      starMesh.rotation.z = elapsed * 1.5;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(frameId);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [colorHex, badgeName, isUnlocked]);

  return (
    <div className="flex flex-col items-center justify-center p-3">
      <div ref={mountRef} className="w-[180px] h-[180px] cursor-pointer hover:scale-105 transition-transform" />
      <span className="mt-2 text-xs font-bold text-[#120C2B] tracking-wide text-center">
        {badgeName}
      </span>
      {!isUnlocked && (
        <span className="text-[10px] text-gray-500 font-medium">Locked Quest Reward</span>
      )}
    </div>
  );
};
