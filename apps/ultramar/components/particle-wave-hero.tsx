"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { SimplexNoise } from "three/addons/math/SimplexNoise.js";

export function ParticleWaveHero() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;

    if (!mount) {
      return;
    }

    const canvas = document.createElement("canvas");
    const context =
      canvas.getContext("webgl2", { alpha: true, antialias: true }) ??
      canvas.getContext("webgl", { alpha: true, antialias: true });

    if (!context) {
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
    const renderer = new THREE.WebGLRenderer({
      canvas,
      context,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    const geometry = new THREE.PlaneGeometry(6, 4, 150, 100);
    const positions = geometry.getAttribute("position") as THREE.BufferAttribute;
    const simplex = new SimplexNoise();
    const material = new THREE.PointsMaterial({
      color: new THREE.Color("#aebbf5"),
      size: 0.018,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.72,
    });
    const waves = new THREE.Points(geometry, material);
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    camera.position.set(4, 2, 8);
    camera.lookAt(scene.position);

    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.domElement.className = "h-full w-full";
    mount.appendChild(renderer.domElement);

    waves.rotation.x = -Math.PI / 2;
    scene.add(waves);

    const resize = () => {
      const bounds = mount.getBoundingClientRect();
      const width = Math.max(bounds.width, 1);
      const height = Math.max(bounds.height, 1);

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };

    const renderWave = (time: number) => {
      const noiseTime = reducedMotionQuery.matches ? 0 : time / 2000;

      for (let i = 0; i < positions.count; i += 1) {
        const x = positions.getX(i);
        const y = positions.getY(i);
        const z = 0.5 * simplex.noise3d(x / 2, y / 2, noiseTime);

        positions.setZ(i, z);
      }

      positions.needsUpdate = true;
      renderer.render(scene, camera);
    };

    renderer.setAnimationLoop(renderWave);
    resize();

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(mount);
    window.addEventListener("resize", resize);

    return () => {
      renderer.setAnimationLoop(null);
      resizeObserver.disconnect();
      window.removeEventListener("resize", resize);
      scene.remove(waves);
      geometry.dispose();
      material.dispose();
      renderer.dispose();

      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    />
  );
}
