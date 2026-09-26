import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import * as d3geo from 'd3-geo';
import gsap from 'gsap';
import { ALL_INDIA_STATES } from '../data/indiaData';
import { IndiaState } from '../types';
import {
  MapPin, RotateCcw, ZoomIn, ZoomOut, Sparkles, Info,
  Compass, Globe2, ChevronRight
} from 'lucide-react';
import { playClickSound } from '../utils/audio';

interface IndiaMap3DProps {
  onSelectState: (state: IndiaState) => void;
  selectedStateId?: string;
}

// GeoJSON NAME_1 → app state id
const GEO_TO_APP: Record<string, string> = {
  'Andaman and Nicobar':    'andaman-nicobar',
  'Andhra Pradesh':         'andhra-pradesh',
  'Arunachal Pradesh':      'arunachal-pradesh',
  'Assam':                  'assam',
  'Bihar':                  'bihar',
  'Chandigarh':             'chandigarh',
  'Chhattisgarh':           'chhattisgarh',
  'Dadra and Nagar Haveli': 'dadra-nagar-haveli',
  'Daman and Diu':          'daman-diu',
  'Delhi':                  'delhi',
  'Goa':                    'goa',
  'Gujarat':                'gujarat',
  'Haryana':                'haryana',
  'Himachal Pradesh':       'himachal-pradesh',
  'Jammu and Kashmir':      'jammu-kashmir',
  'Ladakh':                 'ladakh',
  'Jharkhand':              'jharkhand',
  'Karnataka':              'karnataka',
  'Kerala':                 'kerala',
  'Lakshadweep':            'lakshadweep',
  'Madhya Pradesh':         'madhya-pradesh',
  'Maharashtra':            'maharashtra',
  'Manipur':                'manipur',
  'Meghalaya':              'meghalaya',
  'Mizoram':                'mizoram',
  'Nagaland':               'nagaland',
  'Orissa':                 'odisha',
  'Puducherry':             'puducherry',
  'Punjab':                 'punjab',
  'Rajasthan':              'rajasthan',
  'Sikkim':                 'sikkim',
  'Tamil Nadu':             'tamil-nadu',
  'Telangana':              'telangana',
  'Tripura':                'tripura',
  'Uttar Pradesh':          'uttar-pradesh',
  'Uttaranchal':            'uttarakhand',
  'West Bengal':            'west-bengal',
};

// Zone base colors (terracotta palette)
const ZONE_COLORS: Record<string, number> = {
  'North':      0xCE5A43,
  'South':      0x9B3A2A,
  'East':       0xAB482D,
  'West':       0xD06224,
  'Central':    0xB84A1E,
  'North-East': 0x7A2018,
  'UT':         0x6A1F3A,
  'Himalayan':  0x8B4513, // Ladakh + HP
};

const COLOR_HOVER    = new THREE.Color(0xF09367);
const COLOR_SELECTED = new THREE.Color(0xFECE79);
const EXTRUDE_DEPTH  = 0.28;
const HOVER_Y        = 0.42;
const SELECT_Y       = 0.65;

// ─── Polygon → Three.js shape (project with d3) ─────────────────────────────
function ringToShape(
  ring: number[][],
  projection: d3geo.GeoProjection
): THREE.Vector2[] {
  return ring.map(([lng, lat]) => {
    const [px, py] = projection([lng, lat]) ?? [0, 0];
    return new THREE.Vector2(px, -py); // flip Y so north is positive
  });
}

function buildMeshesFromGeoJSON(
  features: any[],
  projection: d3geo.GeoProjection
): Map<string, THREE.Mesh> {
  const meshMap = new Map<string, THREE.Mesh>();

  features.forEach(feat => {
    const geoName = feat.properties?.NAME_1 as string;
    const stateId = GEO_TO_APP[geoName];
    const appState = ALL_INDIA_STATES.find(s => s.id === stateId);
    const zone = appState?.zone ?? 'UT';
    const baseColor = ZONE_COLORS[zone] ?? 0xCE5A43;

    const geom = feat.geometry;
    const polygons: number[][][][] =
      geom.type === 'Polygon'
        ? [geom.coordinates]
        : geom.coordinates; // MultiPolygon

    const group = new THREE.Group();
    group.userData = { stateId, geoName };

    polygons.forEach(poly => {
      const [exterior, ...holes] = poly;
      if (exterior.length < 3) return;

      const shape = new THREE.Shape(ringToShape(exterior, projection));
      holes.forEach(h => {
        if (h.length >= 3) {
          const path = new THREE.Path(ringToShape(h, projection));
          shape.holes.push(path);
        }
      });

      const geo = new THREE.ExtrudeGeometry(shape, {
        depth: EXTRUDE_DEPTH,
        bevelEnabled: true,
        bevelThickness: 0.015,
        bevelSize: 0.015,
        bevelSegments: 1,
      });
      geo.rotateX(-Math.PI / 2);

      const mat = new THREE.MeshPhongMaterial({
        color: baseColor,
        emissive: 0x000000,
        emissiveIntensity: 0,
        shininess: 40,
        specular: 0x331100,
      });

      const mesh = new THREE.Mesh(geo, mat);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.userData = { stateId, geoName, baseColor, zone };

      // Edge lines
      const edgesGeo = new THREE.EdgesGeometry(geo, 20);
      const edgesMat = new THREE.LineBasicMaterial({
        color: 0xFFF8F2,
        transparent: true,
        opacity: 0.35,
      });
      const edges = new THREE.LineSegments(edgesGeo, edgesMat);
      mesh.add(edges);

      group.add(mesh);
    });

    // Store primary mesh (first child) for raycasting
    if (group.children.length > 0) {
      const primaryMesh = group.children[0] as THREE.Mesh;
      primaryMesh.userData = { stateId, geoName, baseColor, zone, isStateMesh: true };
      meshMap.set(geoName, primaryMesh);
    }
  });

  return meshMap;
}

// ── Particle starfield ───────────────────────────────────────────────────────
function createStarfield(): THREE.Points {
  const count = 600;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3]     = (Math.random() - 0.5) * 40;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 20 + 5;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 40;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const mat = new THREE.PointsMaterial({ color: 0xFFEDD8, size: 0.06, transparent: true, opacity: 0.7 });
  return new THREE.Points(geo, mat);
}

// ── Ocean plane ──────────────────────────────────────────────────────────────
function createOcean(): THREE.Mesh {
  const geo = new THREE.PlaneGeometry(18, 18);
  const mat = new THREE.MeshPhongMaterial({
    color: 0x0A1628,
    emissive: 0x0A1628,
    emissiveIntensity: 0.3,
    shininess: 80,
    specular: 0x1A3060,
    transparent: true,
    opacity: 0.9,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.y = -0.05;
  mesh.receiveShadow = true;
  return mesh;
}

// ── Floating quest pin ───────────────────────────────────────────────────────
function createQuestPin(color: number): THREE.Group {
  const group = new THREE.Group();
  // Stem
  const stemGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.4, 6);
  const stemMat = new THREE.MeshPhongMaterial({ color: 0xFECE79, emissive: 0xFECE79, emissiveIntensity: 0.4 });
  const stem = new THREE.Mesh(stemGeo, stemMat);
  stem.position.y = 0.2;
  group.add(stem);
  // Head
  const headGeo = new THREE.SphereGeometry(0.1, 8, 8);
  const headMat = new THREE.MeshPhongMaterial({ color, emissive: color, emissiveIntensity: 0.6, shininess: 80 });
  const head = new THREE.Mesh(headGeo, headMat);
  head.position.y = 0.5;
  group.add(head);
  // Glow ring
  const ringGeo = new THREE.RingGeometry(0.12, 0.18, 12);
  const ringMat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.4, side: THREE.DoubleSide });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.rotation.x = -Math.PI / 2;
  ring.position.y = 0.01;
  group.add(ring);
  return group;
}

// ════════════════════════════════════════════════════════════════════════════
export const IndiaMap3D: React.FC<IndiaMap3DProps> = ({ onSelectState, selectedStateId }) => {
  const mountRef   = useRef<HTMLDivElement>(null);
  const sceneRef   = useRef<THREE.Scene | null>(null);
  const cameraRef  = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const mapGroupRef = useRef<THREE.Group | null>(null);
  const stateMeshesRef = useRef<Map<string, THREE.Mesh>>(new Map());
  const rafRef     = useRef<number | null>(null);
  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseRef   = useRef(new THREE.Vector2());
  const isDragging = useRef(false);
  const lastMouse  = useRef({ x: 0, y: 0 });
  const hoveredRef = useRef<string | null>(null);
  const selectedRef = useRef<string | null>(selectedStateId ?? null);
  const animRef    = useRef<Map<string, gsap.core.Tween>>(new Map());
  const pinsRef    = useRef<{ pin: THREE.Group; phase: number }[]>([]);

  const [loaded,       setLoaded]       = useState(false);
  const [hoveredState, setHoveredState] = useState<IndiaState | null>(null);
  const [activeState,  setActiveState]  = useState<IndiaState | null>(
    ALL_INDIA_STATES.find(s => s.id === selectedStateId) ?? ALL_INDIA_STATES[0]
  );
  const [autoRotate,   setAutoRotate]   = useState(true);

  // ── Animate a state mesh ──────────────────────────────────────────────────
  const animateMesh = useCallback((
    mesh: THREE.Mesh,
    targetY: number,
    targetColor: THREE.Color,
    emissiveIntensity: number
  ) => {
    const mat = mesh.material as THREE.MeshPhongMaterial;
    const key = mesh.userData.geoName;

    // Kill previous tween
    animRef.current.get(key)?.kill();

    const state = { y: mesh.position.y, r: mat.color.r, g: mat.color.g, b: mat.color.b, ei: mat.emissiveIntensity };
    const tween = gsap.to(state, {
      duration: 0.35,
      ease: 'power2.out',
      y: targetY,
      r: targetColor.r,
      g: targetColor.g,
      b: targetColor.b,
      ei: emissiveIntensity,
      onUpdate: () => {
        mesh.position.y = state.y;
        mat.color.setRGB(state.r, state.g, state.b);
        mat.emissiveIntensity = state.ei;
        mat.emissive.setRGB(state.r * 0.5, state.g * 0.3, state.b * 0.1);
      },
    });

    animRef.current.set(key, tween);
  }, []);

  const resetMesh = useCallback((mesh: THREE.Mesh) => {
    const base = new THREE.Color(mesh.userData.baseColor);
    animateMesh(mesh, 0, base, 0);
  }, [animateMesh]);

  // ── Main Three.js setup ───────────────────────────────────────────────────
  useEffect(() => {
    const container = mountRef.current!;
    const W = container.clientWidth;
    const H = Math.round(W * 0.72);

    // ── Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0C0101);
    scene.fog = new THREE.FogExp2(0x0C0101, 0.045);
    sceneRef.current = scene;

    // ── Camera
    const camera = new THREE.PerspectiveCamera(38, W / H, 0.1, 100);
    camera.position.set(0, 9.5, 8.5);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // ── Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    rendererRef.current = renderer;
    container.appendChild(renderer.domElement);

    // ── Lighting
    const ambient = new THREE.AmbientLight(0xFFB347, 0.9);
    scene.add(ambient);

    const sun = new THREE.DirectionalLight(0xFFE0B2, 2.2);
    sun.position.set(5, 12, 8);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    scene.add(sun);

    const rim = new THREE.DirectionalLight(0xD32F2F, 0.8);
    rim.position.set(-8, 4, -6);
    scene.add(rim);

    const underGlow = new THREE.PointLight(0xFF6F00, 1.0, 12);
    underGlow.position.set(0, -1.5, 0);
    scene.add(underGlow);

    // ── Starfield + Ocean
    scene.add(createStarfield());
    scene.add(createOcean());

    // ── Decorative base ring
    const ringGeo = new THREE.RingGeometry(5.2, 5.5, 64);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xE6A341, side: THREE.DoubleSide, transparent: true, opacity: 0.25 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = -0.04;
    scene.add(ring);

    // ── India Map Group
    const mapGroup = new THREE.Group();
    mapGroup.rotation.x = 0;
    scene.add(mapGroup);
    mapGroupRef.current = mapGroup;

    // ── Load GeoJSON and build meshes
    fetch('/india-states-patched.geojson')
      .then(r => r.json())
      .then((data: { features: any[] }) => {
        // Fit projection to a reasonable 3D space
        const projection = d3geo.geoMercator()
          .fitExtent([[-4.2, -5.0], [4.2, 4.5]], data as any);

        const meshMap = buildMeshesFromGeoJSON(data.features, projection);
        stateMeshesRef.current = meshMap;

        // Add all meshes to scene
        meshMap.forEach((mesh) => {
          mapGroup.add(mesh);
        });

        // Add quest pins above states that have quests
        const questStates = ALL_INDIA_STATES.filter(s => s.activeQuestsCount > 0).slice(0, 10);
        questStates.forEach(s => {
          // Place pin at state centroid (approx via bounding box center)
          const mesh = [...meshMap.values()].find(m => m.userData.stateId === s.id);
          if (!mesh) return;
          mesh.geometry.computeBoundingBox();
          const center = new THREE.Vector3();
          mesh.geometry.boundingBox!.getCenter(center);

          const pinColor = ZONE_COLORS[s.zone] ?? 0xCE5A43;
          const pin = createQuestPin(pinColor);
          pin.position.set(center.x, EXTRUDE_DEPTH + 0.1, center.z);
          mapGroup.add(pin);
          pinsRef.current.push({ pin, phase: Math.random() * Math.PI * 2 });
        });

        // Apply initial selection
        if (selectedRef.current) {
          const initMesh = [...meshMap.values()].find(m => m.userData.stateId === selectedRef.current);
          if (initMesh) {
            initMesh.position.y = SELECT_Y;
            (initMesh.material as THREE.MeshPhongMaterial).color.set(COLOR_SELECTED);
            (initMesh.material as THREE.MeshPhongMaterial).emissiveIntensity = 0.3;
          }
        }

        setLoaded(true);
      });

    // ── Render loop
    let time = 0;
    const animate = () => {
      rafRef.current = requestAnimationFrame(animate);
      time += 0.016;

      // Auto-rotate
      if (autoRotate && !isDragging.current) {
        mapGroup.rotation.y += 0.002;
      }

      // Animate quest pins (float up/down)
      pinsRef.current.forEach(({ pin, phase }) => {
        pin.position.y = EXTRUDE_DEPTH + 0.1 + Math.sin(time * 2 + phase) * 0.12;
        pin.rotation.y = time * 0.5 + phase;
      });

      // Pulse ring
      ring.material.opacity = 0.15 + Math.sin(time * 1.5) * 0.1;

      renderer.render(scene, camera);
    };
    animate();

    // ── Resize handler
    const onResize = () => {
      const w = container.clientWidth;
      const h = Math.round(w * 0.72);
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(container);

    // ── Mouse events
    const canvas = renderer.domElement;

    const onMouseMove = (e: MouseEvent) => {
      if (!stateMeshesRef.current.size) return;

      const rect = canvas.getBoundingClientRect();
      mouseRef.current.set(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      );

      // Drag rotation
      if (isDragging.current) {
        const dx = (e.clientX - lastMouse.current.x) * 0.008;
        const dy = (e.clientY - lastMouse.current.y) * 0.005;
        mapGroup.rotation.y += dx;
        mapGroup.rotation.x = Math.max(-0.6, Math.min(0.6, mapGroup.rotation.x + dy));
        lastMouse.current = { x: e.clientX, y: e.clientY };
        return;
      }

      // Raycasting
      raycasterRef.current.setFromCamera(mouseRef.current, camera);
      const meshes = [...stateMeshesRef.current.values()];
      const hits = raycasterRef.current.intersectObjects(meshes, false);

      const newHov = hits.length > 0 ? hits[0].object.userData.stateId as string : null;

      if (newHov !== hoveredRef.current) {
        // Un-hover previous (if not selected)
        if (hoveredRef.current && hoveredRef.current !== selectedRef.current) {
          const prev = meshes.find(m => m.userData.stateId === hoveredRef.current);
          if (prev) resetMesh(prev);
        }
        // Hover new (if not selected)
        if (newHov && newHov !== selectedRef.current) {
          const next = meshes.find(m => m.userData.stateId === newHov);
          if (next) animateMesh(next, HOVER_Y, COLOR_HOVER, 0.2);
        }
        hoveredRef.current = newHov;
        canvas.style.cursor = newHov ? 'pointer' : 'grab';
        setHoveredState(newHov ? (ALL_INDIA_STATES.find(s => s.id === newHov) ?? null) : null);
      }
    };

    const onMouseDown = (e: MouseEvent) => {
      isDragging.current = true;
      lastMouse.current = { x: e.clientX, y: e.clientY };
      canvas.style.cursor = 'grabbing';
    };

    const onMouseUp = (e: MouseEvent) => {
      const dx = Math.abs(e.clientX - lastMouse.current.x);
      const dy = Math.abs(e.clientY - lastMouse.current.y);
      isDragging.current = false;
      canvas.style.cursor = hoveredRef.current ? 'pointer' : 'grab';

      // If barely moved = click
      if (dx < 5 && dy < 5 && hoveredRef.current) {
        const meshes = [...stateMeshesRef.current.values()];
        const newSelId = hoveredRef.current;
        const appState = ALL_INDIA_STATES.find(s => s.id === newSelId);

        // Deselect old
        if (selectedRef.current && selectedRef.current !== newSelId) {
          const old = meshes.find(m => m.userData.stateId === selectedRef.current);
          if (old) resetMesh(old);
        }

        // Select new
        const newMesh = meshes.find(m => m.userData.stateId === newSelId);
        if (newMesh) animateMesh(newMesh, SELECT_Y, COLOR_SELECTED, 0.35);

        selectedRef.current = newSelId;
        if (appState) {
          setActiveState(appState);
          playClickSound();
        }
      }
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY * 0.01;
      camera.position.y = Math.max(4, Math.min(18, camera.position.y + delta));
      camera.position.z = Math.max(3, Math.min(16, camera.position.z + delta * 0.7));
      camera.lookAt(0, 0, 0);
    };

    const onMouseLeave = () => {
      isDragging.current = false;
      canvas.style.cursor = 'grab';
    };

    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('wheel', onWheel, { passive: false });
    canvas.addEventListener('mouseleave', onMouseLeave);
    canvas.style.cursor = 'grab';

    return () => {
      ro.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('mousedown', onMouseDown);
      canvas.removeEventListener('mouseup', onMouseUp);
      canvas.removeEventListener('wheel', onWheel);
      canvas.removeEventListener('mouseleave', onMouseLeave);
      renderer.dispose();
      container.removeChild(renderer.domElement);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Sync external selectedStateId changes ─────────────────────────────────
  useEffect(() => {
    if (!loaded) return;
    const meshes = [...stateMeshesRef.current.values()];

    if (selectedRef.current && selectedRef.current !== selectedStateId) {
      const old = meshes.find(m => m.userData.stateId === selectedRef.current);
      if (old) resetMesh(old);
    }
    if (selectedStateId) {
      const nxt = meshes.find(m => m.userData.stateId === selectedStateId);
      if (nxt) animateMesh(nxt, SELECT_Y, COLOR_SELECTED, 0.35);
      selectedRef.current = selectedStateId;
      setActiveState(ALL_INDIA_STATES.find(s => s.id === selectedStateId) ?? null);
    }
  }, [selectedStateId, loaded, resetMesh, animateMesh]);

  // ── Camera reset ──────────────────────────────────────────────────────────
  const resetCamera = useCallback(() => {
    const cam = cameraRef.current!;
    gsap.to(cam.position, { duration: 0.8, x: 0, y: 9.5, z: 8.5, ease: 'power2.out', onUpdate: () => cam.lookAt(0, 0, 0) });
    const group = mapGroupRef.current!;
    gsap.to(group.rotation, { duration: 0.8, x: 0, y: 0, ease: 'power2.out' });
  }, []);

  const zoomIn  = () => { const c = cameraRef.current!; c.position.y = Math.max(4, c.position.y - 1.5); c.position.z = Math.max(3, c.position.z - 1); c.lookAt(0, 0, 0); };
  const zoomOut = () => { const c = cameraRef.current!; c.position.y = Math.min(18, c.position.y + 1.5); c.position.z = Math.min(16, c.position.z + 1); c.lookAt(0, 0, 0); };

  // ── JSX ───────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start w-full">

      {/* ─── 3D CANVAS COLUMN ─── */}
      <div className="relative w-full lg:w-[58%] rounded-2xl overflow-hidden"
        style={{ boxShadow: '0 8px 40px rgba(206,90,67,0.25), 0 0 0 1.5px rgba(240,165,153,0.2)' }}
      >
        {/* Loading overlay */}
        {!loaded && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#0C0101] rounded-2xl gap-3">
            <div className="relative">
              <div className="w-14 h-14 rounded-full border-2 border-[#7A1026]/30 border-t-[#FFD38A] animate-spin" />
              <Globe2 className="w-5 h-5 text-[#F09367] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
            <p className="text-[12px] font-semibold text-[#FFA6B4]/80 tracking-wide">Building 3D India Map…</p>
          </div>
        )}

        {/* Three.js mount */}
        <div ref={mountRef} className="w-full" />

        {/* Controls overlay */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-10">
          <button onClick={zoomIn}
            className="w-8 h-8 bg-black/50 backdrop-blur-sm border border-white/10 rounded-lg flex items-center justify-center text-white/70 hover:text-[#FFD38A] hover:border-[#FFD38A]/40 transition-all"
            title="Zoom In">
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button onClick={zoomOut}
            className="w-8 h-8 bg-black/50 backdrop-blur-sm border border-white/10 rounded-lg flex items-center justify-center text-white/70 hover:text-[#FFD38A] hover:border-[#FFD38A]/40 transition-all"
            title="Zoom Out">
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button onClick={resetCamera}
            className="w-8 h-8 bg-black/50 backdrop-blur-sm border border-white/10 rounded-lg flex items-center justify-center text-white/70 hover:text-[#FFD38A] hover:border-[#FFD38A]/40 transition-all"
            title="Reset View">
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setAutoRotate(r => !r)}
            className={`w-8 h-8 backdrop-blur-sm border rounded-lg flex items-center justify-center transition-all ${
              autoRotate ? 'bg-[#7A1026]/60 border-[#7A1026] text-[#FFD38A]' : 'bg-black/50 border-white/10 text-white/40'
            }`}
            title="Toggle Auto-Rotate">
            <Compass className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Zone legend */}
        <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-sm rounded-xl px-3 py-2 border border-white/10 z-10">
          <div className="flex flex-wrap gap-x-3 gap-y-1">
            {Object.entries({
              'North': '#7A1026', 'South': '#9B3A2A', 'East': '#E85B70',
              'West': '#F59E0B', 'NE': '#7A2018', 'Central': '#B84A1E', 'UT': '#120C2B'
            }).map(([zone, color]) => (
              <span key={zone} className="flex items-center gap-1 text-[9px] font-semibold text-white/70">
                <span className="w-2 h-2 rounded-sm" style={{ background: color }} />
                {zone}
              </span>
            ))}
            <span className="flex items-center gap-1 text-[9px] font-semibold text-white/70">
              <span className="w-2 h-2 rounded-sm bg-[#FFD38A]" />
              Selected
            </span>
          </div>
        </div>

        {/* Instruction hint */}
        <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-sm rounded-xl px-2.5 py-1.5 border border-white/10 z-10">
          <p className="text-[9px] text-white/50 font-medium">Drag to rotate · Scroll to zoom · Click state</p>
        </div>

        {/* Hover tooltip */}
        {hoveredState && loaded && (
          <div className="absolute top-3 left-3 bg-[#1C1440]/90 backdrop-blur-md text-white rounded-xl px-3 py-2 border border-[#F09367]/30 z-10 animate-float-up pointer-events-none">
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#F09367] shrink-0" />
              <span className="font-bold text-sm">{hoveredState.name}</span>
              <span className="text-[10px] text-[#FFD38A] font-semibold">{hoveredState.zone}</span>
            </div>
            <p className="text-[10px] text-white/60 mt-0.5 max-w-[180px] truncate">{hoveredState.tagline}</p>
          </div>
        )}
      </div>

      {/* ─── SIDEBAR ─── */}
      <div className="flex-1 space-y-4 min-w-0">
        {/* Header */}
        <div>
          <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-[#7A1026] mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            Select an Indian State to Begin Quests
          </div>
          <h2 className="font-[Poppins] font-black text-xl text-[#1C1440] leading-tight">
            Interactive <span className="text-[#7A1026]">3D India</span> Explorer
          </h2>
          <p className="text-[11px] text-[#120C2B] mt-1 leading-relaxed">
            Drag to rotate · Click any state · Scroll to zoom
          </p>
        </div>

        {/* Active state card */}
        {activeState && (
          <div className="rounded-2xl overflow-hidden border-2 border-[#7A1026] animate-float-up"
            style={{ boxShadow: '4px 4px 0px rgba(139,9,2,0.25)' }}
          >
            <div className="relative h-32 overflow-hidden">
              <img src={activeState.heroImage} alt={activeState.name}
                className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1C1440]/85 via-transparent to-transparent" />
              <span className="absolute top-2.5 left-3 stamp-badge bg-[#7A1026] text-white border-[#E85B70]">
                {activeState.zone} Zone
              </span>
              <div className="absolute bottom-2.5 left-3 right-3 text-white">
                <h3 className="font-[Poppins] font-black text-lg leading-tight">{activeState.name}</h3>
                <p className="text-[9px] text-[#FFD38A] font-medium">{activeState.capital}</p>
              </div>
            </div>

            <div className="bg-white p-3.5 space-y-2.5">
              <p className="text-[11px] text-[#120C2B] leading-relaxed italic line-clamp-2">{activeState.tagline}</p>

              <div className="flex flex-wrap gap-1.5">
                {activeState.culturalHighlights.giCrafts.slice(0, 3).map(c => (
                  <span key={c} className="stamp-badge text-[#7A1026] border-[#7A1026] bg-[#FFF9F3]">{c}</span>
                ))}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#FFA6B4]/20">
                <span className="text-[10px] font-bold text-[#8A8635] flex items-center gap-1">
                  <Info className="w-3 h-3" />
                  {activeState.activeQuestsCount} quests
                </span>
                <button
                  onClick={() => { playClickSound(); onSelectState(activeState); }}
                  className="btn-terracotta text-[11px] py-1.5 px-3 rounded-lg"
                >
                  Enter Quests <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Quick stat row */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { v: 28,    l: 'States' },
            { v: 8,     l: 'UTs' },
            { v: '200+',l: 'GI Crafts' },
          ].map(({ v, l }) => (
            <div key={l} className="text-center bg-white rounded-xl border border-[#FFA6B4]/30 p-2"
              style={{ boxShadow: '0 1px 6px rgba(33,1,0,0.05)' }}>
              <div className="font-black text-base text-[#7A1026]">{v}</div>
              <div className="text-[9px] font-semibold text-[#120C2B] uppercase tracking-wide leading-tight">{l}</div>
            </div>
          ))}
        </div>

        {/* Hovered quick peek */}
        {hoveredState && hoveredState.id !== activeState?.id && (
          <div className="flex items-center gap-2.5 bg-[#FFF9F3] rounded-xl border border-[#FFA6B4]/30 px-3 py-2 animate-float-up">
            <MapPin className="w-3.5 h-3.5 text-[#7A1026] shrink-0" />
            <div className="min-w-0">
              <p className="font-bold text-sm text-[#1C1440] truncate">{hoveredState.name}</p>
              <p className="text-[10px] text-[#120C2B] truncate">{hoveredState.capital} · {hoveredState.zone}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
