"use client";

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { 
  Rotate3d, 
  Layers, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Eye, 
  Maximize2, 
  Check, 
  Share2, 
  Smartphone,
  ShieldCheck
} from 'lucide-react';

interface Colorway {
  id: string;
  name: string;
  hex: string;
  bodyColor: number;
  ringColor: number;
  emissiveColor: number;
  roughness: number;
  metalness: number;
}

const COLORWAYS: Colorway[] = [
  {
    id: 'obsidian',
    name: 'Obsidian Black',
    hex: '#18181b',
    bodyColor: 0x18181b,
    ringColor: 0x3f3f46,
    emissiveColor: 0x06b6d4,
    roughness: 0.65,
    metalness: 0.35,
  },
  {
    id: 'titanium',
    name: 'Brushed Titanium',
    hex: '#71717a',
    bodyColor: 0x71717a,
    ringColor: 0xd4d4d8,
    emissiveColor: 0x38bdf8,
    roughness: 0.3,
    metalness: 0.85,
  },
  {
    id: 'neon',
    name: 'Cyberpunk Cyan',
    hex: '#06b6d4',
    bodyColor: 0x082f49,
    ringColor: 0x06b6d4,
    emissiveColor: 0x06b6d4,
    roughness: 0.4,
    metalness: 0.7,
  },
  {
    id: 'gold',
    name: 'Champagne Gold',
    hex: '#eab308',
    bodyColor: 0x27272a,
    ringColor: 0xeab308,
    emissiveColor: 0xf59e0b,
    roughness: 0.25,
    metalness: 0.9,
  },
];

export default function ThreeDProductStudio() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [explosion, setExplosion] = useState<number>(0);
  const [selectedColor, setSelectedColor] = useState<Colorway>(COLORWAYS[0]);
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [showArModal, setShowArModal] = useState<boolean>(false);

  // References to 3D parts to animate
  const partsRef = useRef<{
    cabinet?: THREE.Mesh;
    grille?: THREE.Mesh;
    cone?: THREE.Mesh;
    dustCap?: THREE.Mesh;
    magnet?: THREE.Mesh;
    voiceCoil?: THREE.Mesh;
    ledRing?: THREE.Mesh;
    bassPort?: THREE.Mesh;
  }>({});

  const stateRef = useRef({
    explosion: 0,
    isAudioPlaying: false,
    autoRotate: true,
  });

  useEffect(() => {
    stateRef.current.explosion = explosion;
    stateRef.current.isAudioPlaying = isAudioPlaying;
    stateRef.current.autoRotate = autoRotate;
  }, [explosion, isAudioPlaying, autoRotate]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // SCENE, CAMERA, RENDERER
    const scene = new THREE.Scene();
    scene.background = null; // transparent to blend with dark gradient

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 550;

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 1000);
    camera.position.set(0, 1.2, 5.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // LIGHTING SETUP
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
    keyLight.position.set(4, 5, 4);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    scene.add(keyLight);

    const rimLight = new THREE.PointLight(selectedColor.emissiveColor, 3, 10);
    rimLight.position.set(-4, 3, -3);
    scene.add(rimLight);

    const softFill = new THREE.DirectionalLight(0x38bdf8, 1.2);
    softFill.position.set(0, -3, 2);
    scene.add(softFill);

    // ROOT MODEL GROUP
    const speakerGroup = new THREE.Group();
    scene.add(speakerGroup);

    // MATERIALS
    const cabinetMat = new THREE.MeshStandardMaterial({
      color: selectedColor.bodyColor,
      roughness: selectedColor.roughness,
      metalness: selectedColor.metalness,
    });

    const ringMat = new THREE.MeshStandardMaterial({
      color: selectedColor.ringColor,
      roughness: 0.2,
      metalness: selectedColor.metalness,
    });

    const coneMat = new THREE.MeshStandardMaterial({
      color: 0x1c1917,
      roughness: 0.5,
      metalness: 0.2,
    });

    const copperMat = new THREE.MeshStandardMaterial({
      color: 0xb45309,
      roughness: 0.35,
      metalness: 0.8,
    });

    const magnetMat = new THREE.MeshStandardMaterial({
      color: 0x3f3f46,
      roughness: 0.4,
      metalness: 0.9,
    });

    const ledMat = new THREE.MeshStandardMaterial({
      color: selectedColor.emissiveColor,
      emissive: selectedColor.emissiveColor,
      emissiveIntensity: 1.8,
      roughness: 0.1,
    });

    const grilleMat = new THREE.MeshStandardMaterial({
      color: 0x27272a,
      roughness: 0.6,
      metalness: 0.6,
      wireframe: true,
    });

    // 1. MAIN CABINET HOUSING
    const cabinetGeo = new THREE.CylinderGeometry(1.35, 1.45, 2.5, 48, 1, false);
    const cabinet = new THREE.Mesh(cabinetGeo, cabinetMat);
    cabinet.rotation.x = Math.PI / 2;
    cabinet.castShadow = true;
    cabinet.receiveShadow = true;
    speakerGroup.add(cabinet);
    partsRef.current.cabinet = cabinet;

    // 2. BASS REFLEX DUCT (BACK)
    const portGeo = new THREE.CylinderGeometry(0.35, 0.4, 0.9, 32, 1, true);
    const bassPort = new THREE.Mesh(portGeo, ringMat);
    bassPort.rotation.x = Math.PI / 2;
    bassPort.position.set(0, -0.6, -1.2);
    speakerGroup.add(bassPort);
    partsRef.current.bassPort = bassPort;

    // 3. INTERNAL NEODYMIUM MAGNET
    const magnetGeo = new THREE.CylinderGeometry(0.7, 0.7, 0.5, 32);
    const magnet = new THREE.Mesh(magnetGeo, magnetMat);
    magnet.rotation.x = Math.PI / 2;
    magnet.position.set(0, 0.2, -0.6);
    speakerGroup.add(magnet);
    partsRef.current.magnet = magnet;

    // 4. COPPER VOICE COIL
    const coilGeo = new THREE.CylinderGeometry(0.52, 0.52, 0.4, 32, 1, true);
    const voiceCoil = new THREE.Mesh(coilGeo, copperMat);
    voiceCoil.rotation.x = Math.PI / 2;
    voiceCoil.position.set(0, 0.2, -0.15);
    speakerGroup.add(voiceCoil);
    partsRef.current.voiceCoil = voiceCoil;

    // 5. DIAPHRAGM WOOFER CONE
    const coneGeo = new THREE.ConeGeometry(1.05, 0.65, 36, 1, true);
    const cone = new THREE.Mesh(coneGeo, coneMat);
    cone.rotation.x = -Math.PI / 2;
    cone.position.set(0, 0.2, 0.5);
    speakerGroup.add(cone);
    partsRef.current.cone = cone;

    // 6. DUST CAP (CENTER)
    const dustCapGeo = new THREE.SphereGeometry(0.32, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const dustCap = new THREE.Mesh(dustCapGeo, ringMat);
    dustCap.rotation.x = Math.PI / 2;
    dustCap.position.set(0, 0.2, 0.85);
    speakerGroup.add(dustCap);
    partsRef.current.dustCap = dustCap;

    // 7. RGB GLOW ACCENT RING
    const ringGeo = new THREE.TorusGeometry(1.18, 0.045, 16, 64);
    const ledRing = new THREE.Mesh(ringGeo, ledMat);
    ledRing.position.set(0, 0.2, 1.26);
    speakerGroup.add(ledRing);
    partsRef.current.ledRing = ledRing;

    // 8. HEXAGONAL PROTECTIVE GRILLE (FRONT)
    const grilleGeo = new THREE.CircleGeometry(1.15, 32);
    const grille = new THREE.Mesh(grilleGeo, grilleMat);
    grille.position.set(0, 0.2, 1.32);
    speakerGroup.add(grille);
    partsRef.current.grille = grille;

    // GROUND SHADOW PLANE
    const groundGeo = new THREE.PlaneGeometry(8, 8);
    const groundMat = new THREE.ShadowMaterial({ opacity: 0.4 });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.position.y = -1.6;
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // INTERACTIVE ORBIT CONTROLS
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let targetRotationX = 0.2;
    let targetRotationY = -0.4;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      targetRotationY += deltaX * 0.007;
      targetRotationX += deltaY * 0.007;
      targetRotationX = Math.max(-0.6, Math.min(0.6, targetRotationX));

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    // TOUCH SUPPORT FOR MOBILE
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging = true;
        previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - previousMousePosition.x;
      const deltaY = e.touches[0].clientY - previousMousePosition.y;

      targetRotationY += deltaX * 0.009;
      targetRotationX += deltaY * 0.009;
      targetRotationX = Math.max(-0.6, Math.min(0.6, targetRotationX));

      previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const onTouchEnd = () => {
      isDragging = false;
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    domElement.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

    // ANIMATION LOOP
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth inertia rotation
      if (stateRef.current.autoRotate && !isDragging) {
        targetRotationY += 0.004;
      }
      speakerGroup.rotation.y += (targetRotationY - speakerGroup.rotation.y) * 0.06;
      speakerGroup.rotation.x += (targetRotationX - speakerGroup.rotation.x) * 0.06;

      // Exploded View Part Interpolations
      const exp = stateRef.current.explosion / 100; // 0 to 1

      if (partsRef.current.grille) {
        partsRef.current.grille.position.z = 1.32 + exp * 1.8;
      }
      if (partsRef.current.ledRing) {
        partsRef.current.ledRing.position.z = 1.26 + exp * 1.4;
      }
      if (partsRef.current.dustCap) {
        partsRef.current.dustCap.position.z = 0.85 + exp * 1.1;
      }
      if (partsRef.current.cone) {
        partsRef.current.cone.position.z = 0.5 + exp * 0.75;
      }
      if (partsRef.current.voiceCoil) {
        partsRef.current.voiceCoil.position.z = -0.15 - exp * 0.4;
      }
      if (partsRef.current.magnet) {
        partsRef.current.magnet.position.z = -0.6 - exp * 0.9;
      }
      if (partsRef.current.bassPort) {
        partsRef.current.bassPort.position.z = -1.2 - exp * 0.7;
      }

      // Audio Reactive Bass Pulse simulation
      if (stateRef.current.isAudioPlaying) {
        const pulse = Math.sin(elapsedTime * 28) * 0.07;
        if (partsRef.current.cone) {
          partsRef.current.cone.scale.set(1 + pulse * 0.5, 1 + pulse * 0.5, 1 + pulse * 1.2);
        }
        if (partsRef.current.dustCap) {
          partsRef.current.dustCap.position.z = (0.85 + exp * 1.1) + pulse * 0.12;
        }
        rimLight.intensity = 3 + Math.sin(elapsedTime * 24) * 2;
      } else {
        if (partsRef.current.cone) partsRef.current.cone.scale.set(1, 1, 1);
        rimLight.intensity = 2.5;
      }

      renderer.render(scene, camera);
    };

    animate();

    // RESIZE LISTENER
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      domElement.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      domElement.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [selectedColor]);

  // Audio simulation toggle
  const toggleAudio = () => {
    setIsAudioPlaying(!isAudioPlaying);
  };

  return (
    <div className="relative w-full rounded-3xl bg-gradient-to-b from-neutral-900/90 via-black to-neutral-950 border border-neutral-800/80 shadow-2xl overflow-hidden p-4 md:p-8 backdrop-blur-xl">
      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Rotate3d className="w-3.5 h-3.5 animate-spin-slow" />
            3D WebGL Interactive Studio
          </div>
          <h3 className="text-xl md:text-3xl font-bold text-white tracking-tight flex items-center gap-2">
            Zebronics Thump 800 <span className="text-neutral-500 text-base font-normal">Acoustic Core</span>
          </h3>
          <p className="text-neutral-400 text-xs md:text-sm mt-1">
            Drag to rotate 360° | Zoom to inspect internal voice coil & neodymium magnet
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 border ${
              autoRotate 
                ? 'bg-neutral-800 text-white border-neutral-700 shadow-inner' 
                : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white'
            }`}
          >
            <Rotate3d className="w-3.5 h-3.5" />
            {autoRotate ? 'Auto Orbit On' : 'Orbit Paused'}
          </button>

          <button
            onClick={toggleAudio}
            className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 border ${
              isAudioPlaying 
                ? 'bg-gradient-to-r from-red-600 to-orange-500 text-white border-red-500 shadow-lg shadow-orange-500/20 animate-pulse' 
                : 'bg-neutral-800/90 text-neutral-300 border-neutral-700 hover:text-white'
            }`}
          >
            {isAudioPlaying ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            {isAudioPlaying ? '45Hz Bass Active' : 'Test Sub-Bass'}
          </button>

          <button
            onClick={() => setShowArModal(true)}
            className="px-3.5 py-2 rounded-xl text-xs font-medium bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:brightness-110 transition-all flex items-center gap-1.5 shadow-lg shadow-cyan-500/20"
          >
            <Smartphone className="w-3.5 h-3.5" />
            View in AR (Room)
          </button>
        </div>
      </div>

      {/* 3D CANVAS VIEWPORT */}
      <div className="relative w-full h-[380px] md:h-[500px] cursor-grab active:cursor-grabbing flex items-center justify-center">
        <div ref={mountRef} className="w-full h-full" />

        {/* Floating Part Labels when Exploded */}
        {explosion > 35 && (
          <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4 md:p-8">
            <div className="self-start bg-neutral-900/80 backdrop-blur-md border border-cyan-500/30 px-3 py-1.5 rounded-lg text-[11px] text-cyan-300 animate-fade-in shadow-lg">
              ✨ 1. Acoustic Hex-Grille (Laser Cut)
            </div>
            <div className="self-end bg-neutral-900/80 backdrop-blur-md border border-cyan-500/30 px-3 py-1.5 rounded-lg text-[11px] text-cyan-300 animate-fade-in shadow-lg">
              ⚡ 2. Kevlar Diaphragm & High-Temp Voice Coil
            </div>
            <div className="self-center bg-neutral-900/80 backdrop-blur-md border border-cyan-500/30 px-3 py-1.5 rounded-lg text-[11px] text-cyan-300 animate-fade-in shadow-lg">
              🧲 3. Heavy Double Neodymium Magnet Core
            </div>
          </div>
        )}
      </div>

      {/* CONTROLS BAR: EXPLODED VIEW + COLORWAYS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-neutral-950/80 border border-neutral-800/80 p-5 rounded-2xl">
        {/* EXPLODED VIEW SLIDER */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-medium">
            <span className="text-neutral-300 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-cyan-400" />
              Exploded Architecture View
            </span>
            <span className="text-cyan-400 font-mono font-semibold">{explosion}% Separated</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={explosion}
            onChange={(e) => setExplosion(Number(e.target.value))}
            className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-cyan-500 transition-all"
          />
          <div className="flex justify-between text-[10px] text-neutral-500">
            <span>Assembled Chassis</span>
            <span>Engineering Component Breakdown</span>
          </div>
        </div>

        {/* PBR COLORWAY SELECTOR */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-medium">
            <span className="text-neutral-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Finish & PBR Material Configurator
            </span>
            <span className="text-neutral-400 text-xs">{selectedColor.name}</span>
          </div>
          <div className="flex items-center gap-3">
            {COLORWAYS.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedColor(c)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs transition-all ${
                  selectedColor.id === c.id
                    ? 'border-cyan-500 bg-cyan-500/10 text-white shadow-md'
                    : 'border-neutral-800 bg-neutral-900/50 text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <span
                  className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-sm"
                  style={{ backgroundColor: c.hex }}
                />
                <span className="hidden sm:inline">{c.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* AR QUICK LOOK MODAL */}
      {showArModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto text-cyan-400">
              <Smartphone className="w-8 h-8 animate-bounce" />
            </div>
            <h4 className="text-xl font-bold text-white">Augmented Reality (AR) Preview</h4>
            <p className="text-neutral-400 text-xs md:text-sm">
              Place this 70W party trolley speaker in your showroom or living room to check physical size and lighting!
            </p>
            <div className="p-4 bg-white rounded-2xl w-48 h-48 mx-auto flex items-center justify-center shadow-lg">
              {/* QR Code placeholder for WebXR model */}
              <div className="text-black text-center text-xs font-mono">
                <div className="w-36 h-36 bg-neutral-900 rounded-lg flex items-center justify-center text-white text-[11px] p-2">
                  Point Camera at Mobile Screen to launch WebXR
                </div>
              </div>
            </div>
            <p className="text-[11px] text-neutral-500">
              Supported on iOS Quick Look (Safari) and Android Chrome (SceneViewer).
            </p>
            <button
              onClick={() => setShowArModal(false)}
              className="w-full py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-sm font-medium transition-colors"
            >
              Close AR Preview
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
