import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { QUESTS } from '../data/mockData';
import { Quest } from '../types';
import { playClickSound } from '../utils/audio';
import { RotateCw, Compass, ZoomIn, ZoomOut, Sparkles, MapPin } from 'lucide-react';

interface ThreeDistrictViewerProps {
  onSelectQuest: (quest: Quest) => void;
  selectedQuestId?: string;
}

export const ThreeDistrictViewer: React.FC<ThreeDistrictViewerProps> = ({
  onSelectQuest,
  selectedQuestId
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hoveredQuest, setHoveredQuest] = useState<Quest | null>(null);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const isDraggingRef = useRef(false);
  const prevMousePosRef = useRef({ x: 0, y: 0 });
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const worldGroupRef = useRef<THREE.Group | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;

    // 1. Scene Setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0xFFF9F2);
    scene.fog = new THREE.FogExp2(0xFFF9F2, 0.055);

    // 2. Camera Setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 7.5, 9.5);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // 3. Renderer Setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    rendererRef.current = renderer;

    container.appendChild(renderer.domElement);

    // 4. Lighting (Warm Terracotta & Sunset Golden Glow)
    const ambientLight = new THREE.AmbientLight(0xFECE79, 1.2); // Warm Butter/Goldfinch ambient
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xF09367, 2.2); // Apricot direct sunlight
    sunLight.position.set(8, 12, 6);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    sunLight.shadow.bias = -0.001;
    scene.add(sunLight);

    const rimLight = new THREE.DirectionalLight(0x6A1F3A, 0.8); // Burgundy rim light
    rimLight.position.set(-8, 5, -6);
    scene.add(rimLight);

    // 5. World Group
    const worldGroup = new THREE.Group();
    worldGroupRef.current = worldGroup;
    scene.add(worldGroup);

    // Main Floating Island Base (Terracotta layered stone pedestal)
    const baseGeo = new THREE.CylinderGeometry(5.2, 4.4, 0.8, 16);
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0xEAC891, // Sunset cream sandstone
      roughness: 0.85,
      metalness: 0.1
    });
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.position.y = -0.4;
    baseMesh.receiveShadow = true;
    worldGroup.add(baseMesh);

    // Top Sandstone Terrain with warm earth texture
    const topGeo = new THREE.CylinderGeometry(5.0, 5.2, 0.25, 16);
    const topMat = new THREE.MeshStandardMaterial({
      color: 0xD9B552, // Sunshine ochre grass/earth
      roughness: 0.9,
    });
    const topMesh = new THREE.Mesh(topGeo, topMat);
    topMesh.position.y = 0.1;
    topMesh.receiveShadow = true;
    worldGroup.add(topMesh);

    // Water Stepwell (Depression in terrain)
    const stepwellGeo = new THREE.BoxGeometry(1.6, 0.4, 1.6);
    const stepwellMat = new THREE.MeshStandardMaterial({
      color: 0x8A8635, // Olive stone
      roughness: 0.6
    });
    const stepwellMesh = new THREE.Mesh(stepwellGeo, stepwellMat);
    stepwellMesh.position.set(0.2, 0.05, -2.2);
    worldGroup.add(stepwellMesh);

    const waterGeo = new THREE.PlaneGeometry(1.3, 1.3);
    const waterMat = new THREE.MeshStandardMaterial({
      color: 0x3A7280,
      roughness: 0.1,
      metalness: 0.8
    });
    const waterMesh = new THREE.Mesh(waterGeo, waterMat);
    waterMesh.rotation.x = -Math.PI / 2;
    waterMesh.position.set(0.2, 0.12, -2.2);
    worldGroup.add(waterMesh);

    // Heritage Palaces & Domes
    const createDomePavilion = (x: number, z: number, color: number, height: number) => {
      const bGeo = new THREE.CylinderGeometry(0.5, 0.6, height, 8);
      const bMat = new THREE.MeshStandardMaterial({ color: 0xCE5A43, roughness: 0.7 }); // Copper Tulip
      const bMesh = new THREE.Mesh(bGeo, bMat);
      bMesh.position.set(x, height / 2 + 0.2, z);
      bMesh.castShadow = true;
      bMesh.receiveShadow = true;
      worldGroup.add(bMesh);

      const dGeo = new THREE.SphereGeometry(0.55, 12, 12, 0, Math.PI * 2, 0, Math.PI / 2);
      const dMat = new THREE.MeshStandardMaterial({ color: color, roughness: 0.4, metalness: 0.3 });
      const dMesh = new THREE.Mesh(dGeo, dMat);
      dMesh.position.set(x, height + 0.2, z);
      dMesh.castShadow = true;
      worldGroup.add(dMesh);

      const spireGeo = new THREE.ConeGeometry(0.1, 0.5, 6);
      const spireMat = new THREE.MeshStandardMaterial({ color: 0xE6A341, metalness: 0.7 });
      const spire = new THREE.Mesh(spireGeo, spireMat);
      spire.position.set(x, height + 0.7, z);
      worldGroup.add(spire);
    };

    createDomePavilion(0.8, -0.6, 0xD06224, 1.6);
    createDomePavilion(-0.6, -1.2, 0xAB482D, 1.2);
    createDomePavilion(0, 0.4, 0x8C0902, 2.0);

    // Artisan Bazaar Canopies (Apricot, Blush, Mustard)
    const canopyColors = [0xF09367, 0xF0A599, 0xE6A341, 0xCE5A43];
    for (let i = 0; i < 7; i++) {
      const angle = (i / 7) * Math.PI * 1.5 - 0.5;
      const radius = 2.4 + (i % 2) * 0.4;
      const cx = Math.cos(angle) * radius;
      const cz = Math.sin(angle) * radius;

      const stallGeo = new THREE.ConeGeometry(0.4, 0.3, 5);
      const stallMat = new THREE.MeshStandardMaterial({
        color: canopyColors[i % canopyColors.length],
        roughness: 0.6
      });
      const stall = new THREE.Mesh(stallGeo, stallMat);
      stall.position.set(cx, 0.45, cz);
      stall.castShadow = true;
      worldGroup.add(stall);

      const poleGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.35, 4);
      const poleMat = new THREE.MeshStandardMaterial({ color: 0x6A1F3A });
      const pole = new THREE.Mesh(poleGeo, poleMat);
      pole.position.set(cx, 0.2, cz);
      worldGroup.add(pole);
    }

    // Sacred Banyan Tree Foliage
    const trunkGeo = new THREE.CylinderGeometry(0.2, 0.35, 1.0, 6);
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x4A2F1B, roughness: 0.9 });
    const trunk = new THREE.Mesh(trunkGeo, trunkMat);
    trunk.position.set(2.4, 0.6, 1.5);
    worldGroup.add(trunk);

    const foliageGeo = new THREE.DodecahedronGeometry(0.9, 1);
    const foliageMat = new THREE.MeshStandardMaterial({
      color: 0x889063, // Moss green
      roughness: 0.8
    });
    const foliage = new THREE.Mesh(foliageGeo, foliageMat);
    foliage.position.set(2.4, 1.4, 1.5);
    foliage.castShadow = true;
    worldGroup.add(foliage);

    // 6. Interactive 3D Quest Pins
    const pinMeshes: { mesh: THREE.Group; quest: Quest; ringMesh: THREE.Mesh }[] = [];
    const raycastTargets: THREE.Object3D[] = [];

    QUESTS.forEach((quest) => {
      const pinGroup = new THREE.Group();
      pinGroup.position.set(quest.coords3D[0], quest.coords3D[1] + 1.2, quest.coords3D[2]);

      // Gem / Crystal Pin
      const pinHeadGeo = new THREE.OctahedronGeometry(0.26, 0);
      const pinColor = quest.isCrowdBalancingBoosted ? 0xF09367 : 0xCE5A43;
      const pinHeadMat = new THREE.MeshStandardMaterial({
        color: pinColor,
        emissive: pinColor,
        emissiveIntensity: 0.35,
        roughness: 0.2,
        metalness: 0.6
      });
      const pinHead = new THREE.Mesh(pinHeadGeo, pinHeadMat);
      pinHead.castShadow = true;
      pinGroup.add(pinHead);

      // Pin Needle
      const needleGeo = new THREE.ConeGeometry(0.08, 0.4, 6);
      needleGeo.rotateX(Math.PI);
      const needleMat = new THREE.MeshStandardMaterial({ color: 0x210100, metalness: 0.8 });
      const needle = new THREE.Mesh(needleGeo, needleMat);
      needle.position.y = -0.3;
      pinGroup.add(needle);

      // Pulsing Ring at Ground
      const ringGeo = new THREE.RingGeometry(0.2, 0.32, 16);
      const ringMat = new THREE.MeshBasicMaterial({
        color: pinColor,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.7
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = -Math.PI / 2;
      ring.position.set(quest.coords3D[0], 0.25, quest.coords3D[2]);
      worldGroup.add(ring);

      // Invisible hit sphere for easy clicking
      const hitGeo = new THREE.SphereGeometry(0.5, 8, 8);
      const hitMat = new THREE.MeshBasicMaterial({ visible: false });
      const hitSphere = new THREE.Mesh(hitGeo, hitMat);
      hitSphere.userData = { quest };
      pinGroup.add(hitSphere);

      worldGroup.add(pinGroup);
      pinMeshes.push({ mesh: pinGroup, quest, ringMesh: ring });
      raycastTargets.push(hitSphere);
    });

    // 7. Floating Golden Sparkle Particles
    const particleCount = 75;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 8;
      particlePositions[i + 1] = Math.random() * 4 + 0.5;
      particlePositions[i + 2] = (Math.random() - 0.5) * 8;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xFECE79,
      size: 0.14,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    worldGroup.add(particleSystem);

    // 8. Raycaster & Mouse Interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(raycastTargets, true);

      if (intersects.length > 0) {
        const quest = intersects[0].object.userData.quest as Quest;
        setHoveredQuest(quest);
        container.style.cursor = 'pointer';
      } else {
        setHoveredQuest(null);
        container.style.cursor = isDraggingRef.current ? 'grabbing' : 'grab';
      }
    };

    const handlePointerDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      prevMousePosRef.current = { x: e.clientX, y: e.clientY };
    };

    const handlePointerUp = (e: MouseEvent) => {
      if (isDraggingRef.current) {
        const deltaX = Math.abs(e.clientX - prevMousePosRef.current.x);
        const deltaY = Math.abs(e.clientY - prevMousePosRef.current.y);

        // If it was a click, check for raycast
        if (deltaX < 5 && deltaY < 5) {
          const rect = container.getBoundingClientRect();
          mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
          mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
          raycaster.setFromCamera(mouse, camera);
          const intersects = raycaster.intersectObjects(raycastTargets, true);
          if (intersects.length > 0) {
            const quest = intersects[0].object.userData.quest as Quest;
            playClickSound();
            onSelectQuest(quest);
          }
        }
      }
      isDraggingRef.current = false;
    };

    const handleWindowMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const deltaX = e.clientX - prevMousePosRef.current.x;
      const deltaY = e.clientY - prevMousePosRef.current.y;

      worldGroup.rotation.y += deltaX * 0.008;
      camera.position.y = Math.max(3.5, Math.min(12, camera.position.y - deltaY * 0.015));
      camera.lookAt(0, 0.5, 0);

      prevMousePosRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);
    container.addEventListener('mousemove', handlePointerMove);
    container.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('mouseup', handlePointerUp);
    window.addEventListener('mousemove', handleWindowMouseMove);

    // 9. Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Auto-rotation if enabled and not dragging
      if (autoRotate && !isDraggingRef.current) {
        worldGroup.rotation.y += 0.0035;
      }

      // Animate pins floating & bobbing
      pinMeshes.forEach(({ mesh, quest, ringMesh }, idx) => {
        mesh.position.y = quest.coords3D[1] + 1.1 + Math.sin(elapsedTime * 2.5 + idx) * 0.12;
        mesh.rotation.y = elapsedTime * 1.5;

        // Pulse ground ring
        const scale = 1 + Math.sin(elapsedTime * 3 + idx) * 0.25;
        ringMesh.scale.set(scale, scale, 1);
        (ringMesh.material as THREE.MeshBasicMaterial).opacity = 0.3 + Math.sin(elapsedTime * 3 + idx) * 0.3;
      });

      // Float sparkle particles
      const positions = particleGeo.attributes.position.array as Float32Array;
      for (let i = 1; i < particleCount * 3; i += 3) {
        positions[i] += Math.sin(elapsedTime + i) * 0.004;
      }
      particleGeo.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousemove', handlePointerMove);
      container.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('mouseup', handlePointerUp);
      window.removeEventListener('mousemove', handleWindowMouseMove);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [autoRotate, onSelectQuest]);

  const handleZoom = (direction: 'in' | 'out') => {
    if (!cameraRef.current) return;
    const factor = direction === 'in' ? 0.85 : 1.15;
    cameraRef.current.position.multiplyScalar(factor);
    cameraRef.current.position.clampLength(6, 16);
    cameraRef.current.lookAt(0, 0.5, 0);
  };

  const handleReset = () => {
    if (!cameraRef.current || !worldGroupRef.current) return;
    cameraRef.current.position.set(0, 7.5, 9.5);
    cameraRef.current.lookAt(0, 0, 0);
    worldGroupRef.current.rotation.set(0, 0, 0);
  };

  return (
    <div className="relative w-full h-[480px] md:h-[540px] rounded-3xl overflow-hidden bg-gradient-to-b from-[#FFF9F3] via-[#FCEFD9] to-[#FCE6D2] border-2 border-[#FFE4B5]/80 shadow-xl">
      {/* 3D Canvas Mount */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Floating Header Tag */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3.5 py-1.5 bg-[#1C1440]/80 backdrop-blur-md text-[#FFD38A] rounded-full text-xs font-semibold tracking-wide border border-[#E5A532]/30">
        <Sparkles className="w-3.5 h-3.5 text-[#F09367] animate-spin" style={{ animationDuration: '6s' }} />
        <span>3D Cultural District & Artisan Island</span>
      </div>

      {/* 3D Controls overlay */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 bg-white/90 backdrop-blur-md p-1.5 rounded-2xl shadow-md border border-[#FFA6B4]/40">
        <button
          onClick={() => setAutoRotate(!autoRotate)}
          className={`p-2 rounded-xl text-xs font-medium transition-all ${
            autoRotate ? 'bg-[#7A1026] text-white shadow-sm' : 'text-[#E85B70] hover:bg-[#FCEFD9]'
          }`}
          title="Toggle Auto-Rotation"
        >
          <RotateCw className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleZoom('in')}
          className="p-2 rounded-xl text-[#E85B70] hover:bg-[#FCEFD9] transition-all"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleZoom('out')}
          className="p-2 rounded-xl text-[#E85B70] hover:bg-[#FCEFD9] transition-all"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={handleReset}
          className="p-2 rounded-xl text-[#E85B70] hover:bg-[#FCEFD9] transition-all"
          title="Reset Camera View"
        >
          <Compass className="w-4 h-4" />
        </button>
      </div>

      {/* Interactive Hover Tooltip */}
      {hoveredQuest && (
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 w-11/12 max-w-md bg-white/95 backdrop-blur-md p-4 rounded-2xl border-2 border-[#F09367] shadow-2xl transition-all animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-[#FCEFD9] text-[#E85B70] border border-[#F09367]/40">
                  {hoveredQuest.category}
                </span>
                {hoveredQuest.isCrowdBalancingBoosted && (
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-[#7A1026] text-white">
                    ⚡ {hoveredQuest.crowdMultiplier}x XP Boost
                  </span>
                )}
              </div>
              <h4 className="font-bold text-sm text-[#1C1440] line-clamp-1">{hoveredQuest.title}</h4>
              <p className="text-xs text-[#120C2B] mt-0.5 line-clamp-1">{hoveredQuest.tagline}</p>
            </div>
            <button
              onClick={() => {
                playClickSound();
                onSelectQuest(hoveredQuest);
              }}
              className="px-3.5 py-2 bg-[#7A1026] hover:bg-[#E85B70] text-white text-xs font-bold rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-1.5 shrink-0"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Explore</span>
            </button>
          </div>
        </div>
      )}

      {/* Drag helper hint */}
      <div className="absolute bottom-3 right-4 text-[11px] text-[#E85B70]/70 font-medium pointer-events-none hidden sm:block">
        ✦ Drag to rotate • Click pins to launch quests
      </div>
    </div>
  );
};
