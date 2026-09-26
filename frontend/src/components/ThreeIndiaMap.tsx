import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import { ALL_INDIA_STATES, INDIA_ZONES } from '../data/indiaData';
import { IndiaState, IndiaZone } from '../types';
import {
  Compass,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Sparkles,
  MapPin,
  Flame,
  Search,
  ArrowRight,
  ShieldAlert,
  Award,
  ChevronRight,
  Layers,
  Info
} from 'lucide-react';
import { playClickSound } from '../utils/audio';

interface ThreeIndiaMapProps {
  onSelectState: (state: IndiaState) => void;
  selectedStateId?: string;
}

export const ThreeIndiaMap: React.FC<ThreeIndiaMapProps> = ({
  onSelectState,
  selectedStateId
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hoveredState, setHoveredState] = useState<IndiaState | null>(null);
  const [activeState, setActiveState] = useState<IndiaState | null>(
    ALL_INDIA_STATES.find((s) => s.id === selectedStateId) || ALL_INDIA_STATES[0]
  );
  const [selectedZone, setSelectedZone] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [autoRotate, setAutoRotate] = useState<boolean>(true);

  // Scene references for interaction
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const stateMeshesRef = useRef<Map<string, THREE.Group>>(new Map());
  const pinsGroupRef = useRef<THREE.Group | null>(null);
  const animFrameId = useRef<number | null>(null);

  // Filtered states list
  const filteredStates = useMemo(() => {
    return ALL_INDIA_STATES.filter((state) => {
      const matchesZone =
        selectedZone === 'All' ||
        (selectedZone === 'UT' ? state.type === 'Union Territory' : state.zone === selectedZone);
      const matchesSearch =
        state.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        state.capital.toLowerCase().includes(searchQuery.toLowerCase()) ||
        state.culturalHighlights.giCrafts.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase())) ||
        state.tagline.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesZone && matchesSearch;
    });
  }, [selectedZone, searchQuery]);

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // --- 1. SCENE SETUP ---
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Ambient background gradient
    scene.background = new THREE.Color('#1C1440'); // Deep Bistre Brown/Red
    scene.fog = new THREE.FogExp2('#1C1440', 0.04);

    // --- 2. CAMERA ---
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 7.5, 9.5);
    camera.lookAt(0, 0.3, 0);
    cameraRef.current = camera;

    // --- 3. RENDERER ---
    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;
    container.replaceChildren(renderer.domElement);

    // --- 4. LIGHTING: Warm Indian Saffron & Sindoor Theme ---
    const ambientLight = new THREE.AmbientLight('#FFB300', 1.2); // Warm Saffron Haldi
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight('#F4E5D4', 2.2);
    sunLight.position.set(6, 12, 8);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    scene.add(sunLight);

    const vermillionRim = new THREE.DirectionalLight('#E85B70', 1.8);
    vermillionRim.position.set(-8, 6, -6);
    scene.add(vermillionRim);

    const marigoldUnder = new THREE.PointLight('#F59E0B', 2.0, 15);
    marigoldUnder.position.set(0, -1.5, 0);
    scene.add(marigoldUnder);

    // --- 5. BASE PEDESTAL & MANDALA COMPASS ---
    const pedestalGroup = new THREE.Group();
    scene.add(pedestalGroup);

    // Glowing base disc
    const baseGeo = new THREE.CylinderGeometry(5.8, 6.2, 0.35, 64);
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x330606,
      roughness: 0.6,
      metalness: 0.4
    });
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.position.y = -0.3;
    baseMesh.receiveShadow = true;
    pedestalGroup.add(baseMesh);

    // Outer Golden Ring with Engraved Pattern
    const ringGeo = new THREE.RingGeometry(5.8, 6.0, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xE6A341,
      side: THREE.DoubleSide
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = -Math.PI / 2;
    ringMesh.position.y = -0.12;
    pedestalGroup.add(ringMesh);

    // --- 6. 3D INDIA LANDMASS WITH REGIONS ---
    const indiaGroup = new THREE.Group();
    scene.add(indiaGroup);

    // Create realistic geographic continent elevation
    // Custom 2D polygon shape representing the iconic Indian subcontinent silhouette
    const indiaShape = new THREE.Shape();
    // Start at Kashmir top
    indiaShape.moveTo(0, 2.9);
    indiaShape.lineTo(0.5, 2.7); // Ladakh
    indiaShape.lineTo(0.6, 2.3);
    indiaShape.lineTo(1.2, 1.9); // Uttarakhand / Nepal border
    indiaShape.lineTo(1.8, 1.2); // Sikkim / Bhutan
    indiaShape.lineTo(2.8, 0.8); // Arunachal / Assam horn
    indiaShape.lineTo(2.6, 0.2); // Nagaland / Manipur
    indiaShape.lineTo(2.2, -0.1); // Tripura / Mizoram
    indiaShape.lineTo(1.6, 0.1); // Bengal Delta
    indiaShape.lineTo(1.3, -0.6); // Odisha coast
    indiaShape.lineTo(0.5, -1.4); // Andhra coast
    indiaShape.lineTo(-0.2, -2.4); // Tamil Nadu Cape Comorin (South Tip)
    indiaShape.lineTo(-0.7, -2.2); // Kerala coast
    indiaShape.lineTo(-1.2, -1.4); // Karnataka coast
    indiaShape.lineTo(-1.5, -0.6); // Goa / Maharashtra coast
    indiaShape.lineTo(-1.8, 0.1); // Gujarat Kathiawar
    indiaShape.lineTo(-2.4, 0.1); // Kutch peninsula
    indiaShape.lineTo(-2.2, 0.8); // Thar Desert / Rajasthan
    indiaShape.lineTo(-1.4, 1.6); // Punjab
    indiaShape.lineTo(-0.8, 2.4); // Jammu
    indiaShape.closePath();

    const extrudeSettings = {
      steps: 2,
      depth: 0.35,
      bevelEnabled: true,
      bevelThickness: 0.1,
      bevelSize: 0.08,
      bevelSegments: 3
    };

    const landGeo = new THREE.ExtrudeGeometry(indiaShape, extrudeSettings);
    landGeo.rotateX(-Math.PI / 2);
    landGeo.translate(0, 0.1, 0);

    const landMat = new THREE.MeshStandardMaterial({
      color: 0x8C0902, // Rich Indian Garnet
      roughness: 0.65,
      metalness: 0.25
    });

    const landMesh = new THREE.Mesh(landGeo, landMat);
    landMesh.castShadow = true;
    landMesh.receiveShadow = true;
    indiaGroup.add(landMesh);

    // Glowing border outline
    const edgesGeo = new THREE.EdgesGeometry(landGeo);
    const edgesMat = new THREE.LineBasicMaterial({ color: 0xFFB300, linewidth: 2 });
    const edgesLine = new THREE.LineSegments(edgesGeo, edgesMat);
    indiaGroup.add(edgesLine);

    // --- 7. INDIVIDUAL 3D STATE HUBS / PINS & MINIATURE MONUMENTS ---
    const stateMeshes = new Map<string, THREE.Group>();
    stateMeshesRef.current = stateMeshes;

    const pinsGroup = new THREE.Group();
    pinsGroupRef.current = pinsGroup;
    indiaGroup.add(pinsGroup);

    ALL_INDIA_STATES.forEach((state) => {
      const stateGroup = new THREE.Group();
      const [x, y, z] = state.coords3D;

      // Hexagonal plateau for each state
      const statePlateauGeo = new THREE.CylinderGeometry(0.35, 0.42, 0.15, 6);
      const stateMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(state.colorHex),
        roughness: 0.4,
        metalness: 0.3,
        emissive: new THREE.Color(state.colorHex),
        emissiveIntensity: 0.15
      });
      const stateMesh = new THREE.Mesh(statePlateauGeo, stateMat);
      stateMesh.position.set(x, 0.25, -y); // Map 3D coords
      stateMesh.castShadow = true;
      stateMesh.receiveShadow = true;
      stateMesh.userData = { stateId: state.id, stateData: state };

      // Pin Needle
      const pinPoleGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.55, 8);
      const pinPoleMat = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, metalness: 0.8 });
      const pinPole = new THREE.Mesh(pinPoleGeo, pinPoleMat);
      pinPole.position.set(x, 0.5, -y);

      // Pin Head (Pulsing Sphere)
      const pinHeadGeo = new THREE.SphereGeometry(0.12, 16, 16);
      const pinHeadMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(state.colorHex),
        emissive: new THREE.Color(state.colorHex),
        emissiveIntensity: 0.6,
        roughness: 0.2
      });
      const pinHead = new THREE.Mesh(pinHeadGeo, pinHeadMat);
      pinHead.position.set(x, 0.78, -y);
      pinHead.userData = { stateId: state.id, stateData: state, isPin: true };

      // Glowing Aura Ring around pin base
      const auraRingGeo = new THREE.RingGeometry(0.18, 0.24, 16);
      const auraRingMat = new THREE.MeshBasicMaterial({
        color: 0xFECE79,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8
      });
      const auraRing = new THREE.Mesh(auraRingGeo, auraRingMat);
      auraRing.rotation.x = -Math.PI / 2;
      auraRing.position.set(x, 0.34, -y);

      stateGroup.add(stateMesh);
      stateGroup.add(pinPole);
      stateGroup.add(pinHead);
      stateGroup.add(auraRing);

      pinsGroup.add(stateGroup);
      stateMeshes.set(state.id, stateGroup);
    });

    // --- 8. 3D MINIATURE CULTURAL MONUMENT MINIATURES ---
    // Taj Mahal miniature in UP (0.1, 0.8)
    const tajGroup = new THREE.Group();
    tajGroup.position.set(0.1, 0.32, -0.8);
    const tajBase = new THREE.Mesh(
      new THREE.BoxGeometry(0.3, 0.12, 0.3),
      new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.2 })
    );
    const tajDome = new THREE.Mesh(
      new THREE.SphereGeometry(0.14, 16, 16),
      new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.1, metalness: 0.2 })
    );
    tajDome.position.y = 0.16;
    tajDome.scale.set(1, 1.3, 1);
    tajGroup.add(tajBase);
    tajGroup.add(tajDome);
    indiaGroup.add(tajGroup);

    // Hawa Mahal / Fort miniature in Rajasthan (-2.1, 0.4)
    const hawaGroup = new THREE.Group();
    hawaGroup.position.set(-2.0, 0.32, -0.4);
    const hawaWall = new THREE.Mesh(
      new THREE.BoxGeometry(0.35, 0.25, 0.12),
      new THREE.MeshStandardMaterial({ color: 0xD06224, roughness: 0.6 })
    );
    hawaGroup.add(hawaWall);
    indiaGroup.add(hawaGroup);

    // Gateway / Maratha Fort in Maharashtra (-1.4, -0.6)
    const gateGroup = new THREE.Group();
    gateGroup.position.set(-1.4, 0.32, 0.6);
    const gatePillar1 = new THREE.Mesh(
      new THREE.CylinderGeometry(0.05, 0.05, 0.28, 8),
      new THREE.MeshStandardMaterial({ color: 0xD9B552, roughness: 0.5 })
    );
    gatePillar1.position.x = -0.1;
    const gatePillar2 = gatePillar1.clone();
    gatePillar2.position.x = 0.1;
    const gateTop = new THREE.Mesh(
      new THREE.BoxGeometry(0.3, 0.08, 0.12),
      new THREE.MeshStandardMaterial({ color: 0xD9B552, roughness: 0.5 })
    );
    gateTop.position.y = 0.16;
    gateGroup.add(gatePillar1);
    gateGroup.add(gatePillar2);
    gateGroup.add(gateTop);
    indiaGroup.add(gateGroup);

    // Meenakshi Gopuram in Tamil Nadu (-0.4, -2.1)
    const gopuramGroup = new THREE.Group();
    gopuramGroup.position.set(-0.4, 0.32, 2.1);
    const gopuram = new THREE.Mesh(
      new THREE.ConeGeometry(0.18, 0.38, 4),
      new THREE.MeshStandardMaterial({ color: 0xB14A36, roughness: 0.4 })
    );
    gopuram.position.y = 0.19;
    gopuram.rotation.y = Math.PI / 4;
    gopuramGroup.add(gopuram);
    indiaGroup.add(gopuramGroup);

    // Backwaters Boat in Kerala (-0.9, -2.2)
    const boatGroup = new THREE.Group();
    boatGroup.position.set(-0.9, 0.28, 2.2);
    const boat = new THREE.Mesh(
      new THREE.CylinderGeometry(0.06, 0.08, 0.35, 8),
      new THREE.MeshStandardMaterial({ color: 0x6A1F3A, roughness: 0.5 })
    );
    boat.rotation.z = Math.PI / 2;
    boatGroup.add(boat);
    indiaGroup.add(boatGroup);

    // Himalayan Snowy Peak in Kashmir/Ladakh (-0.8, 2.3)
    const mountainGroup = new THREE.Group();
    mountainGroup.position.set(-0.8, 0.32, -2.3);
    const peak = new THREE.Mesh(
      new THREE.ConeGeometry(0.4, 0.5, 6),
      new THREE.MeshStandardMaterial({ color: 0xF5F5F5, roughness: 0.3 })
    );
    peak.position.y = 0.25;
    mountainGroup.add(peak);
    indiaGroup.add(mountainGroup);

    // --- 9. FLOATING SAFFRON & GOLD EMBERS ---
    const particleCount = 200;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePos[i] = (Math.random() - 0.5) * 10;
      particlePos[i + 1] = Math.random() * 4;
      particlePos[i + 2] = (Math.random() - 0.5) * 10;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xFECE79,
      size: 0.06,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // --- 10. INTERACTIVE RAYCASTING ---
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const onPointerMove = (event: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      if (isDragging) {
        const deltaX = event.clientX - previousMousePosition.x;
        const deltaY = event.clientY - previousMousePosition.y;
        indiaGroup.rotation.y += deltaX * 0.006;
        pedestalGroup.rotation.y += deltaX * 0.006;
        camera.position.y = Math.max(3.5, Math.min(11, camera.position.y - deltaY * 0.02));
        camera.lookAt(0, 0.3, 0);
        previousMousePosition = { x: event.clientX, y: event.clientY };
        return;
      }

      // Check hover
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(pinsGroup.children, true);

      if (intersects.length > 0) {
        let currentObj: THREE.Object3D | null = intersects[0].object;
        while (currentObj && !currentObj.userData?.stateData) {
          currentObj = currentObj.parent;
        }
        if (currentObj && currentObj.userData?.stateData) {
          const stateData: IndiaState = currentObj.userData.stateData;
          setHoveredState(stateData);
          renderer.domElement.style.cursor = 'pointer';
          return;
        }
      }
      setHoveredState(null);
      renderer.domElement.style.cursor = 'grab';
    };

    const onPointerDown = (event: PointerEvent) => {
      isDragging = true;
      previousMousePosition = { x: event.clientX, y: event.clientY };
      renderer.domElement.style.cursor = 'grabbing';
    };

    const onPointerUp = (event: PointerEvent) => {
      const dist = Math.hypot(
        event.clientX - previousMousePosition.x,
        event.clientY - previousMousePosition.y
      );
      isDragging = false;
      renderer.domElement.style.cursor = 'grab';

      // Click detection if not dragged
      if (dist < 5) {
        const rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(pinsGroup.children, true);

        if (intersects.length > 0) {
          let currentObj: THREE.Object3D | null = intersects[0].object;
          while (currentObj && !currentObj.userData?.stateData) {
            currentObj = currentObj.parent;
          }
          if (currentObj && currentObj.userData?.stateData) {
            const clickedState: IndiaState = currentObj.userData.stateData;
            playClickSound();
            setActiveState(clickedState);
            onSelectState(clickedState);
          }
        }
      }
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('pointermove', onPointerMove);
    domElement.addEventListener('pointerdown', onPointerDown);
    domElement.addEventListener('pointerup', onPointerUp);

    // --- 11. ANIMATION LOOP ---
    let clock = new THREE.Clock();
    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      // Gentle auto-rotation
      if (autoRotate && !isDragging) {
        indiaGroup.rotation.y = Math.sin(elapsedTime * 0.25) * 0.25;
        pedestalGroup.rotation.y = indiaGroup.rotation.y;
      }

      // Float particle embers
      const positions = particleGeo.attributes.position.array as Float32Array;
      for (let i = 1; i < particleCount * 3; i += 3) {
        positions[i] += Math.sin(elapsedTime + i) * 0.003;
        if (positions[i] > 5) positions[i] = 0;
      }
      particleGeo.attributes.position.needsUpdate = true;

      // Pulse pin heads
      stateMeshes.forEach((group, id) => {
        const isSelected = activeState?.id === id;
        const isHovered = hoveredState?.id === id;
        const pinHead = group.children[2] as THREE.Mesh;
        const auraRing = group.children[3] as THREE.Mesh;

        if (pinHead) {
          const baseScale = isSelected ? 1.6 : isHovered ? 1.4 : 1.0;
          const pulse = Math.sin(elapsedTime * 3.5) * 0.15;
          pinHead.scale.setScalar(baseScale + pulse);
        }

        if (auraRing) {
          auraRing.scale.setScalar(1 + Math.sin(elapsedTime * 2.5) * 0.3);
        }
      });

      renderer.render(scene, camera);
      animFrameId.current = requestAnimationFrame(animate);
    };

    animate();

    // Resize observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width: newWidth, height: newHeight } = entry.contentRect;
        if (newWidth > 0 && newHeight > 0) {
          camera.aspect = newWidth / newHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(newWidth, newHeight);
        }
      }
    });
    resizeObserver.observe(container);

    return () => {
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
      resizeObserver.disconnect();
      domElement.removeEventListener('pointermove', onPointerMove);
      domElement.removeEventListener('pointerdown', onPointerDown);
      domElement.removeEventListener('pointerup', onPointerUp);
      renderer.dispose();
      scene.clear();
    };
  }, [autoRotate, onSelectState, activeState]);

  // Controls
  const handleZoom = (delta: number) => {
    playClickSound();
    if (cameraRef.current) {
      const newY = Math.max(4, Math.min(12, cameraRef.current.position.y + delta));
      const newZ = Math.max(5, Math.min(14, cameraRef.current.position.z + delta));
      cameraRef.current.position.set(cameraRef.current.position.x, newY, newZ);
      cameraRef.current.lookAt(0, 0.3, 0);
    }
  };

  const handleReset = () => {
    playClickSound();
    if (cameraRef.current) {
      cameraRef.current.position.set(0, 7.5, 9.5);
      cameraRef.current.lookAt(0, 0.3, 0);
    }
  };

  const currentDisplayState = hoveredState || activeState;

  return (
    <div className="relative w-full rounded-3xl overflow-hidden border-2 border-[#E5A532] shadow-2xl bg-[#1C1440] text-white">
      {/* Top Bar: Regional Filters & Search Bar */}
      <div className="absolute top-0 inset-x-0 z-20 p-4 sm:p-6 bg-gradient-to-b from-[#1C1440]/95 via-[#1C1440]/80 to-transparent pointer-events-auto">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          
          {/* Header Title & Tag */}
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-widest uppercase bg-[#7A1026] text-white border border-[#FFD38A]">
                Interactive 3D Subcontinent
              </span>
              <span className="text-xs text-[#FFD38A] font-bold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#FFB300]" />
                28 States & 8 Union Territories
              </span>
            </div>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-white mt-1">
              Select an Indian State to Begin Quests
            </h2>
          </div>

          {/* Search State / Craft Input */}
          <div className="flex items-center gap-2">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-[#FFD38A] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search state, craft, city (e.g. Rajasthan, Blue Pottery)..."
                className="w-full pl-9 pr-3 py-2 bg-white/10 hover:bg-white/15 focus:bg-white/20 rounded-xl text-xs font-semibold text-white placeholder-white/50 border border-white/20 focus:outline-none focus:ring-2 focus:ring-[#FFD38A] backdrop-blur-md transition-all"
              />
            </div>
          </div>

        </div>

        {/* Zone Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-3 pb-1 scrollbar-none">
          {INDIA_ZONES.map((zone) => (
            <button
              key={zone.id}
              onClick={() => {
                playClickSound();
                setSelectedZone(zone.id);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedZone === zone.id
                  ? 'bg-gradient-to-r from-[#E85B70] to-[#E65100] text-white shadow-lg border border-[#FFD38A]'
                  : 'bg-white/10 text-white/80 hover:bg-white/20 border border-white/10'
              }`}
            >
              <span>{zone.label}</span>
              {zone.id !== 'All' && (
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/30 text-[#FFD38A]">
                  {
                    ALL_INDIA_STATES.filter((s) =>
                      zone.id === 'UT' ? s.type === 'Union Territory' : s.zone === zone.id
                    ).length
                  }
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 3D WebGL Canvas Viewport */}
      <div
        ref={mountRef}
        className="w-full h-[520px] sm:h-[620px] lg:h-[680px] touch-none cursor-grab active:cursor-grabbing"
      />

      {/* Floating 3D Navigation Controls */}
      <div className="absolute right-4 top-36 z-20 flex flex-col gap-2 pointer-events-auto">
        <button
          onClick={() => handleZoom(-1.2)}
          title="Zoom In"
          className="p-2.5 rounded-xl bg-[#1C1440]/80 hover:bg-[#7A1026] text-white border border-white/20 backdrop-blur-md transition-all shadow-lg"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleZoom(1.2)}
          title="Zoom Out"
          className="p-2.5 rounded-xl bg-[#1C1440]/80 hover:bg-[#7A1026] text-white border border-white/20 backdrop-blur-md transition-all shadow-lg"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={handleReset}
          title="Reset Camera View"
          className="p-2.5 rounded-xl bg-[#1C1440]/80 hover:bg-[#7A1026] text-white border border-white/20 backdrop-blur-md transition-all shadow-lg"
        >
          <Compass className="w-4 h-4" />
        </button>
        <button
          onClick={() => {
            playClickSound();
            setAutoRotate(!autoRotate);
          }}
          title={autoRotate ? 'Pause Rotation' : 'Auto Rotate'}
          className={`p-2.5 rounded-xl border border-white/20 backdrop-blur-md transition-all shadow-lg ${
            autoRotate ? 'bg-[#E85B70] text-white' : 'bg-[#1C1440]/80 text-white/70'
          }`}
        >
          <RotateCw className={`w-4 h-4 ${autoRotate ? 'animate-spin' : ''}`} style={{ animationDuration: '8s' }} />
        </button>
      </div>

      {/* Bottom Floating State Detail Card Overlay */}
      {currentDisplayState && (
        <div className="absolute bottom-4 inset-x-4 sm:inset-x-6 z-20 pointer-events-auto">
          <div className="bg-gradient-to-r from-[#1C1440]/95 via-[#120C2B]/95 to-[#450915]/95 backdrop-blur-xl p-4 sm:p-5 rounded-3xl border-2 border-[#E5A532] shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
            
            {/* Left Info */}
            <div className="flex items-start sm:items-center gap-4">
              <img
                src={currentDisplayState.heroImage}
                alt={currentDisplayState.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-[#FFD38A] shadow-md shrink-0"
              />
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#FFD38A]">
                    {currentDisplayState.zone} Zone • {currentDisplayState.type}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/20 text-white">
                    Capital: {currentDisplayState.capital}
                  </span>
                  {currentDisplayState.crowdAlert?.hasAlert && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-[#F59E0B] text-[#1C1440] flex items-center gap-1">
                      <Flame className="w-3 h-3 text-[#E85B70]" />
                      {currentDisplayState.crowdAlert.multiplier}x Crowd Bonus Active
                    </span>
                  )}
                </div>

                <h3 className="font-display font-black text-xl sm:text-2xl text-white">
                  {currentDisplayState.name}
                </h3>
                <p className="text-xs text-[#FFA6B4] font-medium line-clamp-1 max-w-xl">
                  {currentDisplayState.tagline}
                </p>

                {/* Cultural craft tags */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {currentDisplayState.culturalHighlights.giCrafts.slice(0, 3).map((craft, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-[#FFD38A]/20 text-[#FFD38A] border border-[#FFD38A]/30"
                    >
                      {craft}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Action Button */}
            <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
              <button
                onClick={() => {
                  playClickSound();
                  onSelectState(currentDisplayState);
                }}
                className="w-full md:w-auto px-6 py-3.5 bg-gradient-to-r from-[#E85B70] via-[#E65100] to-[#FFB300] hover:brightness-110 text-white font-black text-xs sm:text-sm rounded-2xl shadow-xl border-2 border-[#FFD38A] flex items-center justify-center gap-2 transition-all transform hover:scale-105"
              >
                <span>Enter {currentDisplayState.name} Quests</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Quick State Chips Horizontal Drawer */}
      <div className="p-3 bg-[#170000] border-t border-[#E5A532]/40 flex items-center gap-2 overflow-x-auto scrollbar-none text-xs">
        <span className="text-[10px] uppercase font-black text-[#FFD38A] whitespace-nowrap pl-2 flex items-center gap-1">
          <MapPin className="w-3 h-3" /> Quick Select:
        </span>
        {filteredStates.map((st) => (
          <button
            key={st.id}
            onClick={() => {
              playClickSound();
              setActiveState(st);
              onSelectState(st);
            }}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all border text-xs flex items-center gap-1.5 ${
              activeState?.id === st.id
                ? 'bg-[#E85B70] text-white border-[#FFD38A] shadow-md'
                : 'bg-white/5 text-white/80 hover:bg-white/15 border-white/10'
            }`}
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: st.colorHex }}
            />
            <span>{st.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
