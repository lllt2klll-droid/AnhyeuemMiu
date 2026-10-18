import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export function setupCameraAndControls(camera, renderer) {
  // Orbit Controls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.06;
  controls.screenSpacePanning = false;

  // Clamping constraints
  controls.minDistance = 3.2;
  controls.maxDistance = 8.5;
  controls.minPolarAngle = Math.PI * 0.22; // prevent viewing directly from top
  controls.maxPolarAngle = Math.PI * 0.70; // prevent flipping upside-down or viewing from floor
  controls.target.set(0, 0.05, 0);

  // Default camera sweet spot
  const defaultCameraPos = new THREE.Vector3(0, 0.35, 5.2);
  const defaultTarget = new THREE.Vector3(0, 0.05, 0);

  // Camera Animation State (Lerp)
  let isAnimating = false;
  let animProgress = 0;
  const startCameraPos = new THREE.Vector3();
  const targetCameraPos = new THREE.Vector3();
  const startTarget = new THREE.Vector3();
  const targetTarget = new THREE.Vector3();
  let animDuration = 1.2;

  function animateTo(newCamPos, newTarget, duration = 1.2) {
    startCameraPos.copy(camera.position);
    targetCameraPos.copy(newCamPos);
    startTarget.copy(controls.target);
    targetTarget.copy(newTarget);
    animDuration = duration;
    animProgress = 0;
    isAnimating = true;
  }

  function resetView() {
    animateTo(defaultCameraPos, defaultTarget, 1.2);
  }

  function focusObject(worldPos, offsetDistance = 3.8) {
    const dir = new THREE.Vector3().subVectors(camera.position, worldPos).normalize();
    const desiredCamPos = new THREE.Vector3().copy(worldPos).addScaledVector(dir, offsetDistance);
    
    // Keep Y within pleasing height
    desiredCamPos.y = Math.max(0.2, Math.min(desiredCamPos.y, 2.5));

    animateTo(desiredCamPos, worldPos, 1.0);
  }

  function update(delta) {
    if (isAnimating) {
      animProgress += delta / animDuration;
      if (animProgress >= 1) {
        animProgress = 1;
        isAnimating = false;
        camera.position.copy(targetCameraPos);
        controls.target.copy(targetTarget);
      } else {
        // Smooth easeInOutCubic
        const t = animProgress < 0.5
          ? 4 * animProgress * animProgress * animProgress
          : 1 - Math.pow(-2 * animProgress + 2, 3) / 2;

        camera.position.lerpVectors(startCameraPos, targetCameraPos, t);
        controls.target.lerpVectors(startTarget, targetTarget, t);
      }
    }

    controls.update();
  }

  return {
    controls,
    resetView,
    focusObject,
    animateTo,
    update,
    defaultCameraPos,
    defaultTarget
  };
}
