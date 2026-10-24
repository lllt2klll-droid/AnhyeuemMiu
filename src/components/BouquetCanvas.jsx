import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { createBouquet } from '../scene/createBouquet.js';
import { createLighting } from '../scene/createLighting.js';
import { setupCameraAndControls } from '../scene/cameraControls.js';
import { updateFlowerSway } from '../scene/createFlowers.js';
import { updateRibbonMotion } from '../scene/createWrapping.js';

export function BouquetCanvas({
  isNightMode,
  selectedFlower,
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
  const flowerFocusRef = useRef(null);
  const lightingRef = useRef(null);
  const reqIdRef = useRef(null);

  // Interaction tracking (Distinguish click/tap from drag)
  const pointerDownPos = useRef({ x: 0, y: 0, time: 0 });

  useEffect(() => {
    const scene = sceneRef.current;
    const bouquet = bouquetRef.current;
    const camera = cameraRef.current;
    const camSetup = controlsRef.current;
    if (!scene || !bouquet || !camera || !camSetup) return;

    if (flowerFocusRef.current) {
      const ornaments = flowerFocusRef.current.userData.ornaments;
      ornaments.traverse((object) => {
        if (object.isMesh) {
          object.geometry.dispose();
          object.material.dispose();
        }
      });
      scene.remove(flowerFocusRef.current);
      flowerFocusRef.current = null;
    }

    if (!selectedFlower) {
      bouquet.visible = true;
      camSetup.resetView();
      return;
    }

    bouquet.visible = false;
    const focusGroup = new THREE.Group();
    const flower = selectedFlower.object.clone(true);
    flower.position.set(0, 0, 0);
    flower.rotation.set(0, 0, 0);
    flower.scale.set(1, 1, 1);

    const bounds = new THREE.Box3().setFromObject(flower);
    const center = bounds.getCenter(new THREE.Vector3());
    const size = bounds.getSize(new THREE.Vector3());
    const isNarrowViewport = window.innerWidth / window.innerHeight < 0.85;
    const flowerDisplaySize = isNarrowViewport ? 1.45 : 1.65;
    const flowerScale = flowerDisplaySize / Math.max(size.x, size.y, size.z);
    flower.position.copy(center).multiplyScalar(-flowerScale);
    flower.scale.setScalar(flowerScale);

    const ornaments = new THREE.Group();
    const haloMaterial = new THREE.MeshBasicMaterial({
      color: 0xFFD58A,
      transparent: true,
      opacity: 0.42,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide
    });
    const halo = new THREE.Mesh(new THREE.TorusGeometry(1.28, 0.012, 8, 96), haloMaterial);
    halo.position.z = -0.32;
    ornaments.add(halo);

    const outerHalo = new THREE.Mesh(
      new THREE.TorusGeometry(1.43, 0.006, 6, 96),
      new THREE.MeshBasicMaterial({
        color: 0xF4AFC1,
        transparent: true,
        opacity: 0.28,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      })
    );
    outerHalo.position.z = -0.38;
    ornaments.add(outerHalo);

    const sparkles = [];
    for (let index = 0; index < 10; index++) {
      const angle = (index / 10) * Math.PI * 2;
      const sparkle = new THREE.Mesh(
        new THREE.SphereGeometry(0.025 + (index % 3) * 0.006, 8, 8),
        new THREE.MeshBasicMaterial({
          color: index % 2 === 0 ? 0xFFF1C1 : 0xFFD0DC,
          transparent: true,
          opacity: 0.7,
          blending: THREE.AdditiveBlending,
          depthWrite: false
        })
      );
      sparkle.userData = {
        angle,
        phase: index * 0.73,
        radius: 1.52 + (index % 3) * 0.07
      };
      ornaments.add(sparkle);
      sparkles.push(sparkle);
    }

    focusGroup.add(ornaments);
    focusGroup.add(flower);
    focusGroup.position.set(isNarrowViewport ? 0 : -1.05, isNarrowViewport ? 1.55 : 0, 0);
    focusGroup.userData = {
      ornaments,
      flower,
      sparkles,
      reduceMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      bloomStartedAt: performance.now() / 1000,
      flowerBaseRotation: flower.rotation.clone(),
      baseY: focusGroup.position.y
    };
    focusGroup.scale.setScalar(0.02);
    scene.add(focusGroup);
    flowerFocusRef.current = focusGroup;

    camSetup.animateTo(
      new THREE.Vector3(0, 0.15, 4.8),
      new THREE.Vector3(0, 0, 0),
      0.9
    );
  }, [selectedFlower]);

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
                let flowerObject = curr;
                while (flowerObject.parent && flowerObject.parent !== bouquet) {
                  flowerObject = flowerObject.parent;
                }
                onSelectFlower(flowerId, flowerObject);
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
      if (flowerFocusRef.current) {
        const isNarrowViewport = newW / newH < 0.85;
        const baseY = isNarrowViewport ? 1.55 : 0;
        flowerFocusRef.current.position.set(isNarrowViewport ? 0 : -1.05, baseY, 0);
        flowerFocusRef.current.userData.baseY = baseY;
      }

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

      if (flowerFocusRef.current) {
        const focus = flowerFocusRef.current;
        const bloomProgress = focus.userData.reduceMotion
          ? 1
          : THREE.MathUtils.clamp(
            (performance.now() / 1000 - focus.userData.bloomStartedAt) / 1.15,
            0,
            1
          );
        const overshoot = 1.7;
        const easedBloom = 1 + (overshoot + 1) * Math.pow(bloomProgress - 1, 3)
          + overshoot * Math.pow(bloomProgress - 1, 2);
        const breathing = !focus.userData.reduceMotion && bloomProgress >= 1
          ? 1 + Math.sin(elapsedTime * 1.25) * 0.008
          : 1;
        focus.scale.setScalar(Math.max(0.02, easedBloom * breathing));
        focus.position.y = focus.userData.baseY
          + (focus.userData.reduceMotion ? 0 : Math.sin(elapsedTime * 0.9) * 0.035);
        focus.userData.flower.rotation.y = focus.userData.flowerBaseRotation.y
          + (focus.userData.reduceMotion ? 0 : Math.sin(elapsedTime * 0.55) * 0.025);
        focus.userData.ornaments.children[0].rotation.z = focus.userData.reduceMotion ? 0 : elapsedTime * 0.12;
        focus.userData.ornaments.children[1].rotation.z = focus.userData.reduceMotion ? 0 : -elapsedTime * 0.08;
        focus.userData.sparkles.forEach((sparkle) => {
          const { angle, phase, radius } = sparkle.userData;
          const shimmer = focus.userData.reduceMotion
            ? 0.7
            : 0.5 + (Math.sin(elapsedTime * 2.2 + phase) + 1) * 0.25;
          sparkle.position.set(
            Math.cos(angle + (focus.userData.reduceMotion ? 0 : elapsedTime * 0.08)) * radius,
            Math.sin(angle + (focus.userData.reduceMotion ? 0 : elapsedTime * 0.08)) * radius,
            -0.08 + (focus.userData.reduceMotion ? 0 : Math.sin(elapsedTime * 1.4 + phase) * 0.08)
          );
          sparkle.material.opacity = shimmer;
          sparkle.scale.setScalar(0.7 + shimmer * 0.55);
        });
      }

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
      if (bouquet.visible) {
        updateRibbonMotion(wrapping, physicsDelta, rotationVelocity);
        updateFlowerSway(bouquet, physicsDelta, rotationVelocity);
      }

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
      if (bouquet && bouquet.visible) {
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
      if (flowerFocusRef.current) {
        const ornaments = flowerFocusRef.current.userData.ornaments;
        ornaments.traverse((object) => {
          if (object.isMesh) {
            object.geometry.dispose();
            object.material.dispose();
          }
        });
        scene.remove(flowerFocusRef.current);
        flowerFocusRef.current = null;
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
