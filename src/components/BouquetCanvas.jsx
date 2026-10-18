import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { createBouquet } from '../scene/createBouquet.js';
import { createLighting } from '../scene/createLighting.js';
import { setupCameraAndControls } from '../scene/cameraControls.js';

export function BouquetCanvas({
  isNightMode,
  selectedFlowerId,
  onSelectFlower,
  onOpenLetter,
  resetTrigger
}) {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const bouquetRef = useRef(null);
  const lightingRef = useRef(null);
  const reqIdRef = useRef(null);

  // Interaction tracking (Distinguish click/tap from drag)
  const pointerDownPos = useRef({ x: 0, y: 0, time: 0 });

  // Handle camera reset
  useEffect(() => {
    if (controlsRef.current && resetTrigger > 0) {
      controlsRef.current.resetView();
    }
  }, [resetTrigger]);

  // Handle Day/Night transition
  useEffect(() => {
    if (lightingRef.current) {
      lightingRef.current.setNightMode(isNightMode);
    }
  }, [isNightMode]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    // Initial entrance position (slightly further back for intro animation)
    camera.position.set(0, 0.8, 6.8);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Lighting & Particles
    const lighting = createLighting(scene);
    lightingRef.current = lighting;
    lighting.setNightMode(isNightMode);

    // 5. Bouquet
    const bouquet = createBouquet();
    bouquetRef.current = bouquet;
    scene.add(bouquet);

    // 6. Camera Controls
    const camSetup = setupCameraAndControls(camera, renderer);
    controlsRef.current = camSetup;

    // Smooth Intro Camera Dolly
    camSetup.animateTo(camSetup.defaultCameraPos, camSetup.defaultTarget, 2.0);

    // 7. Raycaster & Pointer Events
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    function onPointerDown(e) {
      pointerDownPos.current = {
        x: e.clientX,
        y: e.clientY,
        time: performance.now()
      };
    }

    function onPointerUp(e) {
      const dx = e.clientX - pointerDownPos.current.x;
      const dy = e.clientY - pointerDownPos.current.y;
      const dt = performance.now() - pointerDownPos.current.time;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Only treat as a click if pointer moved less than 8px and within 450ms
      if (dist < 8 && dt < 450) {
        const rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(bouquet.children, true);

        for (const hit of intersects) {
          let curr = hit.object;
          while (curr && curr !== bouquet) {
            if (curr.userData && curr.userData.isInteractive) {
              const { flowerId, isLetter } = curr.userData;

              if (isLetter) {
                onOpenLetter();
              } else if (flowerId) {
                onSelectFlower(flowerId);
                // Gently focus camera towards clicked flower
                const worldPos = new THREE.Vector3();
                curr.getWorldPosition(worldPos);
                camSetup.focusObject(worldPos, 4.2);
              }
              return;
            }
            curr = curr.parent;
          }
        }
      }
    }

    // Hover cursor indicator
    function onPointerMove(e) {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(bouquet.children, true);

      let foundInteractive = false;
      for (const hit of intersects) {
        let curr = hit.object;
        while (curr && curr !== bouquet) {
          if (curr.userData && curr.userData.isInteractive) {
            foundInteractive = true;
            break;
          }
          curr = curr.parent;
        }
        if (foundInteractive) break;
      }

      renderer.domElement.style.cursor = foundInteractive ? 'pointer' : 'grab';
    }

    const domElement = renderer.domElement;
    domElement.addEventListener('pointerdown', onPointerDown);
    domElement.addEventListener('pointerup', onPointerUp);
    domElement.addEventListener('pointermove', onPointerMove);

    // 8. Resize Handler
    function handleResize() {
      if (!container || !renderer || !camera) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;

      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();

      renderer.setSize(newW, newH);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }

    window.addEventListener('resize', handleResize);

    // 9. Animation Loop
    const clock = new THREE.Clock();

    function renderLoop() {
      reqIdRef.current = requestAnimationFrame(renderLoop);

      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // Update Lighting & Particles
      lighting.update(delta, elapsedTime);

      // Camera Controls Update
      camSetup.update(delta);

      // Gentle Bouquet Swaying (Lifelike gentle breeze)
      if (bouquet) {
        bouquet.rotation.y = Math.sin(elapsedTime * 0.9) * 0.035;
        bouquet.rotation.z = Math.cos(elapsedTime * 0.7) * 0.015;
        bouquet.position.y = -0.1 + Math.sin(elapsedTime * 1.2) * 0.02;
      }

      renderer.render(scene, camera);
    }

    renderLoop();

    // Cleanup
    return () => {
      if (reqIdRef.current) cancelAnimationFrame(reqIdRef.current);
      window.removeEventListener('resize', handleResize);

      domElement.removeEventListener('pointerdown', onPointerDown);
      domElement.removeEventListener('pointerup', onPointerUp);
      domElement.removeEventListener('pointermove', onPointerMove);

      if (container.contains(domElement)) {
        container.removeChild(domElement);
      }

      // Dispose resources
      scene.traverse((obj) => {
        if (obj.isMesh) {
          if (obj.geometry) obj.geometry.dispose();
          if (obj.material) {
            if (Array.isArray(obj.material)) {
              obj.material.forEach((m) => m.dispose());
            } else {
              obj.material.dispose();
            }
          }
        }
      });
      renderer.dispose();
    };
  }, []);

  return <div className="canvas-container" ref={mountRef} />;
}
