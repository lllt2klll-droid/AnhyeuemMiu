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

  // Default camera sweet spot
  const defaultCameraPos = new THREE.Vector3();
  const defaultTarget = new THREE.Vector3(0, -0.3, 0);
  controls.target.copy(defaultTarget);
  const baseFov = THREE.MathUtils.degToRad(45);

  function updateViewport(aspect) {
    camera.aspect = aspect;
    camera.fov = THREE.MathUtils.radToDeg(
      2 * Math.atan(Math.tan(baseFov / 2) / Math.min(aspect, 1))
    );
    camera.updateProjectionMatrix();

    const isNarrowViewport = aspect < 0.85;
    const defaultDistance = isNarrowViewport ? 8 : 7.6;
    controls.maxDistance = isNarrowViewport ? 10.5 : 8.5;
    defaultCameraPos.set(0, 0, defaultDistance);
  }

  updateViewport(camera.aspect);

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
    updateViewport,
    defaultCameraPos,
    defaultTarget
  };
}
