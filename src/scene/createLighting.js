import * as THREE from 'three';

/**
 * Manages Day/Night lighting and floating atmospheric particles
 */
export function createLighting(scene) {
  const lightingGroup = new THREE.Group();
  scene.add(lightingGroup);

  // 1. Ambient Light
  const ambientLight = new THREE.AmbientLight(0xFFF7EC, 1.25);
  lightingGroup.add(ambientLight);

  // 2. Main Sun / Moon Key Light (Directional with soft shadows)
  const mainLight = new THREE.DirectionalLight(0xFFF0D6, 1.6);
  mainLight.position.set(-4, 7, 5);
  mainLight.castShadow = true;
  mainLight.shadow.mapSize.width = 1024;
  mainLight.shadow.mapSize.height = 1024;
  mainLight.shadow.camera.near = 0.5;
  mainLight.shadow.camera.far = 20;
  mainLight.shadow.camera.left = -4;
  mainLight.shadow.camera.right = 4;
  mainLight.shadow.camera.top = 4;
  mainLight.shadow.camera.bottom = -4;
  mainLight.shadow.bias = -0.0005;
  lightingGroup.add(mainLight);

  // 3. Fill Light (Soft side light to bring out flower contours)
  const fillLight = new THREE.DirectionalLight(0xFFEADB, 0.7);
  fillLight.position.set(4, 2, 4);
  lightingGroup.add(fillLight);

  // 4. Subtle Rim / Back Light (Gives vinyl clearcoat edge highlights)
  const rimLight = new THREE.DirectionalLight(0xFFFFFF, 0.65);
  rimLight.position.set(0, 3, -5);
  lightingGroup.add(rimLight);

  // 5. Floating Dust / Firefly Particles
  const particleCount = 65;
  const particleGeometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const velocities = [];

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 8;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 6;

    velocities.push({
      x: (Math.random() - 0.5) * 0.002,
      y: 0.002 + Math.random() * 0.003,
      z: (Math.random() - 0.5) * 0.002,
      phase: Math.random() * Math.PI * 2
    });
  }

  particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  // Canvas circle texture for particles
  const canvas = document.createElement('canvas');
  canvas.width = 32;
  canvas.height = 32;
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
  gradient.addColorStop(0.3, 'rgba(255, 230, 180, 0.6)');
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 32, 32);

  const particleTexture = new THREE.CanvasTexture(canvas);

  const particleMaterial = new THREE.PointsMaterial({
    size: 0.16,
    map: particleTexture,
    transparent: true,
    opacity: 0.55,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });

  const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
  scene.add(particleSystem);

  // Transition Target State
  const dayTheme = {
    ambientColor: 0xFFF7EC,
    ambientIntensity: 1.25,
    mainColor: 0xFFF0D6,
    mainIntensity: 1.6,
    mainPos: new THREE.Vector3(-4, 7, 5),
    fillColor: 0xFFEADB,
    fillIntensity: 0.7,
    rimColor: 0xFFFFFF,
    rimIntensity: 0.65,
    particleColor: 0xFFE8B8,
    particleSize: 0.14,
    particleOpacity: 0.5
  };

  const nightTheme = {
    ambientColor: 0x223355,
    ambientIntensity: 0.95,
    mainColor: 0xDCE7FF,
    mainIntensity: 1.35,
    mainPos: new THREE.Vector3(4, 6, 4),
    fillColor: 0xF2B37A,
    fillIntensity: 0.55, // warm lantern fill
    rimColor: 0x9BB8FF,
    rimIntensity: 0.85,
    particleColor: 0x99E265, // glowing fireflies
    particleSize: 0.22,
    particleOpacity: 0.8
  };

  let currentProgress = 0; // 0 = day, 1 = night
  let targetProgress = 0;

  function setNightMode(isNight) {
    targetProgress = isNight ? 1 : 0;
  }

  function update(delta, elapsedTime) {
    // Smooth lerp progress
    if (Math.abs(currentProgress - targetProgress) > 0.001) {
      currentProgress += (targetProgress - currentProgress) * Math.min(delta * 2.5, 0.1);
    } else {
      currentProgress = targetProgress;
    }

    const t = currentProgress;

    // Interpolate Lights
    ambientLight.color.lerpColors(
      new THREE.Color(dayTheme.ambientColor),
      new THREE.Color(nightTheme.ambientColor),
      t
    );
    ambientLight.intensity = THREE.MathUtils.lerp(dayTheme.ambientIntensity, nightTheme.ambientIntensity, t);

    mainLight.color.lerpColors(
      new THREE.Color(dayTheme.mainColor),
      new THREE.Color(nightTheme.mainColor),
      t
    );
    mainLight.intensity = THREE.MathUtils.lerp(dayTheme.mainIntensity, nightTheme.mainIntensity, t);
    mainLight.position.lerpVectors(dayTheme.mainPos, nightTheme.mainPos, t);

    fillLight.color.lerpColors(
      new THREE.Color(dayTheme.fillColor),
      new THREE.Color(nightTheme.fillColor),
      t
    );
    fillLight.intensity = THREE.MathUtils.lerp(dayTheme.fillIntensity, nightTheme.fillIntensity, t);

    rimLight.color.lerpColors(
      new THREE.Color(dayTheme.rimColor),
      new THREE.Color(nightTheme.rimColor),
      t
    );
    rimLight.intensity = THREE.MathUtils.lerp(dayTheme.rimIntensity, nightTheme.rimIntensity, t);

    // Particles color & pulse
    particleMaterial.color.lerpColors(
      new THREE.Color(dayTheme.particleColor),
      new THREE.Color(nightTheme.particleColor),
      t
    );
    particleMaterial.size = THREE.MathUtils.lerp(dayTheme.particleSize, nightTheme.particleSize, t);
    
    // Animate particles
    const posAttr = particleGeometry.attributes.position;
    for (let i = 0; i < particleCount; i++) {
      const v = velocities[i];
      let y = posAttr.getY(i) + v.y;
      if (y > 4) y = -4; // wrap around
      posAttr.setY(i, y);

      let x = posAttr.getX(i) + v.x + Math.sin(elapsedTime * 0.8 + v.phase) * 0.0015;
      let z = posAttr.getZ(i) + v.z + Math.cos(elapsedTime * 0.8 + v.phase) * 0.0015;
      posAttr.setX(i, x);
      posAttr.setZ(i, z);
    }
    posAttr.needsUpdate = true;
  }

  return {
    lightingGroup,
    setNightMode,
    update
  };
}
