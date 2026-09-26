import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { CulturalAccessory, StateCulturalFashion } from '../../data/culturalFashionData';

interface ThreeCulturalCharacterProps {
  stateData: StateCulturalFashion;
  selectedAccessoryId: string | null;
  onSelectAccessory?: (acc: CulturalAccessory) => void;
}

export const ThreeCulturalCharacter: React.FC<ThreeCulturalCharacterProps> = ({
  stateData,
  selectedAccessoryId,
  onSelectAccessory,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // --- Scene, Camera, Renderer ---
    const width = container.clientWidth || 600;
    const height = container.clientHeight || 750;

    const scene = new THREE.Scene();
    scene.background = null; // Transparent canvas to sit on editorial parchment

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0.1, 4.4);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // --- Lighting (Museum / Studio Lighting) ---
    const ambientLight = new THREE.AmbientLight(0xfff8ee, 1.1);
    scene.add(ambientLight);

    // Warm directional key light
    const keyLight = new THREE.DirectionalLight(0xfff3db, 1.4);
    keyLight.position.set(3, 5, 4);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.001;
    scene.add(keyLight);

    // Soft cool fill light
    const fillLight = new THREE.DirectionalLight(0xe8edf5, 0.5);
    fillLight.position.set(-3, 2, 3);
    scene.add(fillLight);

    // Subtle golden rim light
    const rimLight = new THREE.DirectionalLight(0xffd38a, 0.8);
    rimLight.position.set(0, 4, -3);
    scene.add(rimLight);

    // --- Collectible Group (moves with mouse / idle) ---
    const characterGroup = new THREE.Group();
    scene.add(characterGroup);

    // --- 3D Collectible Plinth / Pedestal ---
    let pedestalColor = 0xd9a066;
    if (stateData.id === 'maharashtra') pedestalColor = 0x3d3838;
    else if (stateData.id === 'tamil-nadu') pedestalColor = 0x544c48;
    else if (stateData.id === 'gujarat') pedestalColor = 0x7c4320;

    // Outer cylindrical step
    const baseGeo = new THREE.CylinderGeometry(1.2, 1.3, 0.15, 48);
    const baseMat = new THREE.MeshStandardMaterial({
      color: pedestalColor,
      roughness: 0.85,
      metalness: 0.1,
    });
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.position.y = -1.6;
    baseMesh.receiveShadow = true;
    characterGroup.add(baseMesh);

    // Upper carved plinth ring
    const topPlinthGeo = new THREE.CylinderGeometry(1.05, 1.15, 0.12, 48);
    const topPlinthMat = new THREE.MeshStandardMaterial({
      color: pedestalColor,
      roughness: 0.75,
      metalness: 0.15,
    });
    const topPlinthMesh = new THREE.Mesh(topPlinthGeo, topPlinthMat);
    topPlinthMesh.position.y = -1.48;
    topPlinthMesh.receiveShadow = true;
    characterGroup.add(topPlinthMesh);

    // Brass engraved trim ring
    const brassTrimGeo = new THREE.TorusGeometry(1.16, 0.02, 16, 64);
    const brassMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.85,
      roughness: 0.25,
    });
    const brassTrimMesh = new THREE.Mesh(brassTrimGeo, brassMat);
    brassTrimMesh.rotation.x = Math.PI / 2;
    brassTrimMesh.position.y = -1.54;
    characterGroup.add(brassTrimMesh);

    // Soft Contact Shadow Plane on ground
    const shadowGeo = new THREE.PlaneGeometry(3.5, 3.5);
    const canvasShadow = document.createElement('canvas');
    canvasShadow.width = 256;
    canvasShadow.height = 256;
    const shadowCtx = canvasShadow.getContext('2d');
    if (shadowCtx) {
      const grad = shadowCtx.createRadialGradient(128, 128, 20, 128, 128, 120);
      grad.addColorStop(0, 'rgba(28, 20, 64, 0.45)');
      grad.addColorStop(0.5, 'rgba(28, 20, 64, 0.18)');
      grad.addColorStop(1, 'rgba(28, 20, 64, 0)');
      shadowCtx.fillStyle = grad;
      shadowCtx.fillRect(0, 0, 256, 256);
    }
    const shadowTexture = new THREE.CanvasTexture(canvasShadow);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTexture,
      transparent: true,
      depthWrite: false,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -1.68;
    scene.add(shadowMesh);

    // --- Texture Loading for Character ---
    const textureLoader = new THREE.TextureLoader();
    setLoading(true);

    textureLoader.load(
      stateData.characterImage,
      (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        // UV crop: use the left ~62% of the poster containing the full character
        texture.repeat.set(stateData.cropRatio, 1);
        texture.offset.set(0, 0);

        // Aspect ratio of the cropped portion:
        // Original is ~1214 x 1295. Cropped width is 1214 * 0.62 = ~752.
        const aspect = (1214 * stateData.cropRatio) / 1295;
        const charHeight = 2.85;
        const charWidth = charHeight * aspect;

        const charGeo = new THREE.PlaneGeometry(charWidth, charHeight, 32, 32);
        
        // Material with subtle sheen so embroidery and jewellery catch light
        const charMat = new THREE.MeshStandardMaterial({
          map: texture,
          transparent: true,
          alphaTest: 0.05,
          roughness: 0.65,
          metalness: 0.12,
          side: THREE.DoubleSide,
        });

        const charMesh = new THREE.Mesh(charGeo, charMat);
        charMesh.position.set(0, 0.05, 0);
        charMesh.castShadow = true;
        charMesh.receiveShadow = true;
        characterGroup.add(charMesh);

        // Secondary subtle background relief plate behind character
        const bgPlaneGeo = new THREE.PlaneGeometry(charWidth * 1.05, charHeight * 1.05);
        const bgPlaneMat = new THREE.MeshBasicMaterial({
          map: texture,
          transparent: true,
          opacity: 0.12,
          depthWrite: false,
        });
        const bgMesh = new THREE.Mesh(bgPlaneGeo, bgPlaneMat);
        bgMesh.position.set(0, 0.05, -0.15);
        characterGroup.add(bgMesh);

        setLoading(false);
      },
      undefined,
      (err) => {
        console.error('Failed to load character texture', err);
        setLoading(false);
      }
    );

    // --- Interaction & Mouse Parallax ---
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      const clientY = e.clientY - rect.top;
      mouse.targetX = (clientX / rect.width) * 2 - 1;
      mouse.targetY = -(clientY / rect.height) * 2 + 1;
    };

    container.addEventListener('mousemove', onMouseMove);

    // Touch support for mobile
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const rect = container.getBoundingClientRect();
        const clientX = e.touches[0].clientX - rect.left;
        const clientY = e.touches[0].clientY - rect.top;
        mouse.targetX = (clientX / rect.width) * 2 - 1;
        mouse.targetY = -(clientY / rect.height) * 2 + 1;
      }
    };
    container.addEventListener('touchmove', onTouchMove);

    // --- Animation Loop ---
    let animationFrameId: number;
    let clock = new THREE.Clock();

    // Target camera position
    const cameraTarget = { y: 0.1, z: 4.4 };

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse interpolation
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      // Subtle, controlled idle sway + mouse parallax (NO wild spinning!)
      const idleSway = Math.sin(elapsedTime * 0.8) * 0.02;
      characterGroup.rotation.y = mouse.x * 0.2 + idleSway;
      characterGroup.rotation.x = -mouse.y * 0.08;

      // Smooth camera transition when accessory is selected
      const currentAcc = stateData.accessories.find((a) => a.id === selectedAccessoryId);
      if (currentAcc) {
        cameraTarget.y = (currentAcc.cameraFocus.y - 0.1) * 0.6;
        cameraTarget.z = 4.4 / currentAcc.cameraFocus.zoom;
      } else {
        cameraTarget.y = 0.1;
        cameraTarget.z = 4.4;
      }

      camera.position.y += (cameraTarget.y - camera.position.y) * 0.06;
      camera.position.z += (cameraTarget.z - camera.position.z) * 0.06;

      renderer.render(scene, camera);
    };

    animate();

    // --- Resize Handler ---
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousemove', onMouseMove);
      container.removeEventListener('touchmove', onTouchMove);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [stateData, selectedAccessoryId]);

  return (
    <div className="relative w-full h-full min-h-[460px] sm:min-h-[580px] md:min-h-[640px] flex items-center justify-center">
      {/* 3D Canvas Mount Point */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Loading Indicator */}
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#FDF6E9]/70 backdrop-blur-xs z-20">
          <div className="w-8 h-8 rounded-full border-2 border-[#7A1026] border-t-transparent animate-spin mb-2" />
          <span className="font-heading font-black text-xs text-[#1C1440] uppercase tracking-wider">
            Rendering Collectible 3D Figure...
          </span>
        </div>
      )}
    </div>
  );
};
