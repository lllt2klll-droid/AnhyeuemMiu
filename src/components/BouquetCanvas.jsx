import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { createBouquet } from '../scene/createBouquet.js';
import { createLighting } from '../scene/createLighting.js';
import { setupCameraAndControls } from '../scene/cameraControls.js';
import { updateFlowerSway } from '../scene/createFlowers.js';
import { updateRibbonMotion } from '../scene/createWrapping.js';

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
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, window.innerWidth < 768 ? 1.5 : 2));
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
    camera.position.copy(camSetup.defaultCameraPos).add(new THREE.Vector3(0, 0.3, 1.6));
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

      // Allow a little extra movement and time for comfortable touch input.
      if (dist < 12 && dt < 600) {
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
                camSetup.focusObject(worldPos, camera.aspect < 1 ? 5.3 : 4.2);
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

      camSetup.updateViewport(newW / newH);

      renderer.setSize(newW, newH);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, window.innerWidth < 768 ? 1.5 : 2));
    }

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);
    window.addEventListener('resize', handleResize);

    // 9. Animation Loop
    const clock = new THREE.Clock();
    const wrapping = bouquet.getObjectByName('BouquetWrapping');
    let previousAzimuth = camSetup.controls.getAzimuthalAngle();
    let previousPolar = camSetup.controls.getPolarAngle();
    const bouquetSway = {
      x: 0,
      y: 0,
      z: 0,
      velocityX: 0,
      velocityY: 0,
      velocityZ: 0
    };

    function renderLoop() {
      reqIdRef.current = requestAnimationFrame(renderLoop);

      const delta = clock.getDelta();
      const physicsDelta = Math.min(delta, 0.05);
      const elapsedTime = clock.getElapsedTime();

      // Update Lighting & Particles
      lighting.update(delta, elapsedTime);

      // Camera Controls Update
      camSetup.update(delta);

      const azimuth = camSetup.controls.getAzimuthalAngle();
      const polar = camSetup.controls.getPolarAngle();
      const azimuthDelta = Math.atan2(
        Math.sin(azimuth - previousAzimuth),
        Math.cos(azimuth - previousAzimuth)
      );
      const rotationVelocity = {
        yaw: delta > 0 ? THREE.MathUtils.clamp(azimuthDelta / delta, -6, 6) : 0,
        pitch: delta > 0 ? THREE.MathUtils.clamp((polar - previousPolar) / delta, -6, 6) : 0
      };
      previousAzimuth = azimuth;
      previousPolar = polar;
      updateRibbonMotion(wrapping, physicsDelta, rotationVelocity);
      updateFlowerSway(bouquet, physicsDelta, rotationVelocity);

      // Damped spring motion makes the bouquet lag behind camera turns, then settle.
      const spring = 9;
      const damping = 5.2;
      bouquetSway.velocityX += (rotationVelocity.pitch * 0.42 - spring * bouquetSway.x - damping * bouquetSway.velocityX) * physicsDelta;
      bouquetSway.velocityY += (-rotationVelocity.yaw * 0.36 - spring * bouquetSway.y - damping * bouquetSway.velocityY) * physicsDelta;
      bouquetSway.velocityZ += (rotationVelocity.yaw * 0.26 - spring * bouquetSway.z - damping * bouquetSway.velocityZ) * physicsDelta;
      bouquetSway.x = THREE.MathUtils.clamp(bouquetSway.x + bouquetSway.velocityX * physicsDelta, -0.16, 0.16);
      bouquetSway.y = THREE.MathUtils.clamp(bouquetSway.y + bouquetSway.velocityY * physicsDelta, -0.18, 0.18);
      bouquetSway.z = THREE.MathUtils.clamp(bouquetSway.z + bouquetSway.velocityZ * physicsDelta, -0.12, 0.12);

      // Gentle breeze sway remains, layered under the rotation-driven motion.
      if (bouquet) {
        bouquet.rotation.x = bouquetSway.x;
        bouquet.rotation.y = bouquetSway.y + Math.sin(elapsedTime * 0.9) * 0.035;
        bouquet.rotation.z = bouquetSway.z + Math.cos(elapsedTime * 0.7) * 0.015;
        bouquet.position.y = -0.1 + Math.sin(elapsedTime * 1.2) * 0.02;
      }

      renderer.render(scene, camera);
    }

    renderLoop();

    // Cleanup
    return () => {
      if (reqIdRef.current) cancelAnimationFrame(reqIdRef.current);
      resizeObserver.disconnect();
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
