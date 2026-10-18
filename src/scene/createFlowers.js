import * as THREE from 'three';
import {
  createPlumpPetalGeometry,
  createLilyPetalGeometry,
  createPlumpLeafGeometry,
  createEucalyptusLeafGeometry
} from './geometryUtils.js';

/**
 * Tag an Object3D and all its descendants with flower userData for Raycasting
 */
function tagFlower(object, flowerId, flowerType) {
  object.userData = { flowerId, flowerType, isInteractive: true };
  object.traverse((child) => {
    if (child.isMesh) {
      child.userData = { flowerId, flowerType, isInteractive: true };
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
}

/**
 * 1. SUNFLOWER (Hoa hướng dương)
 * Central showpiece: bright yellow petals, domed brown center with beaded texture
 */
export function createSunflower(materials) {
  const group = new THREE.Group();

  // Central Brown Disc
  const discGeom = new THREE.CylinderGeometry(0.55, 0.58, 0.18, 32);
  discGeom.rotateX(Math.PI / 2);
  const centerDisc = new THREE.Mesh(discGeom, materials.sunflowerCenter);
  group.add(centerDisc);

  // Center Dome
  const domeGeom = new THREE.SphereGeometry(0.48, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2.2);
  domeGeom.rotateX(Math.PI / 2);
  domeGeom.scale(1, 1, 0.45);
  const dome = new THREE.Mesh(domeGeom, materials.sunflowerCenter);
  dome.position.z = 0.07;
  group.add(dome);

  // Concentric Beads on Center
  const beadGeom = new THREE.SphereGeometry(0.046, 12, 10);
  beadGeom.scale(1, 1, 0.7);

  // Outer ring: 18 beads
  for (let i = 0; i < 18; i++) {
    const angle = (i / 18) * Math.PI * 2;
    const bead = new THREE.Mesh(beadGeom, materials.sunflowerBead);
    bead.position.set(Math.cos(angle) * 0.42, Math.sin(angle) * 0.42, 0.1);
    group.add(bead);
  }

  // Middle ring: 12 beads
  for (let i = 0; i < 12; i++) {
    const angle = (i / 12) * Math.PI * 2 + (Math.PI / 12);
    const bead = new THREE.Mesh(beadGeom, materials.sunflowerBead);
    bead.position.set(Math.cos(angle) * 0.28, Math.sin(angle) * 0.28, 0.13);
    group.add(bead);
  }

  // Inner ring: 6 beads
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2;
    const bead = new THREE.Mesh(beadGeom, materials.sunflowerBead);
    bead.position.set(Math.cos(angle) * 0.14, Math.sin(angle) * 0.14, 0.15);
    group.add(bead);
  }

  // Petals
  // Outer layer: 16 petals
  const outerPetalGeom = createPlumpPetalGeometry({
    width: 0.38,
    length: 0.82,
    depth: 0.065,
    bevel: 0.045,
    curl: 0.14,
    pointiness: 0.75
  });

  const numPetals = 16;
  for (let i = 0; i < numPetals; i++) {
    const angle = (i / numPetals) * Math.PI * 2;
    const petal = new THREE.Mesh(outerPetalGeom, materials.sunflowerPetal);
    petal.position.set(Math.cos(angle) * 0.78, Math.sin(angle) * 0.78, -0.02);
    petal.rotation.z = angle - Math.PI / 2;
    petal.rotation.x = 0.1; // slight forward flare
    group.add(petal);
  }

  // Inner layer: 16 petals (interleaved, slightly shorter)
  const innerPetalGeom = createPlumpPetalGeometry({
    width: 0.34,
    length: 0.72,
    depth: 0.06,
    bevel: 0.04,
    curl: 0.18,
    pointiness: 0.8
  });

  for (let i = 0; i < numPetals; i++) {
    const angle = (i / numPetals) * Math.PI * 2 + (Math.PI / numPetals);
    const petal = new THREE.Mesh(innerPetalGeom, materials.sunflowerPetal);
    petal.position.set(Math.cos(angle) * 0.74, Math.sin(angle) * 0.74, 0.02);
    petal.rotation.z = angle - Math.PI / 2;
    petal.rotation.x = 0.18; // tilted more forward
    group.add(petal);
  }

  // Back calyx / stem mount
  const calyxGeom = new THREE.CylinderGeometry(0.45, 0.15, 0.25, 16);
  calyxGeom.rotateX(Math.PI / 2);
  const calyx = new THREE.Mesh(calyxGeom, materials.leafGreen);
  calyx.position.z = -0.15;
  group.add(calyx);

  tagFlower(group, 'sunflower', 'sunflower');
  return group;
}

/**
 * 2. WHITE LILY (Hoa loa kèn trắng / Bách hợp)
 * 6 wide flaring curved white petals with prominent golden stamens and green center
 */
export function createLily(materials) {
  const group = new THREE.Group();

  // Central Green Throat / Calyx
  const throatGeom = new THREE.CylinderGeometry(0.2, 0.08, 0.35, 16);
  throatGeom.rotateX(Math.PI / 2);
  const throat = new THREE.Mesh(throatGeom, materials.lilyCenterGreen);
  throat.position.z = -0.15;
  group.add(throat);

  // 6 Petals: 3 outer, 3 inner slightly smaller
  const lilyPetalGeom = createLilyPetalGeometry({
    width: 0.58,
    length: 1.38,
    depth: 0.05,
    bevel: 0.038,
    curl: 0.36
  });

  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2;
    const isInner = i % 2 === 1;
    const petal = new THREE.Mesh(lilyPetalGeom, materials.lilyPetal);
    
    const radiusOffset = isInner ? 0.48 : 0.52;
    petal.position.set(
      Math.cos(angle) * radiusOffset,
      Math.sin(angle) * radiusOffset,
      isInner ? 0.04 : -0.02
    );
    petal.rotation.z = angle - Math.PI / 2;
    petal.rotation.x = isInner ? 0.42 : 0.48; // arch outwards
    if (isInner) {
      petal.scale.set(0.92, 0.94, 0.95);
    }
    group.add(petal);
  }

  // Central Pistil (green)
  const pistilGeom = new THREE.CylinderGeometry(0.028, 0.024, 0.62, 12);
  pistilGeom.rotateX(Math.PI / 2);
  const pistil = new THREE.Mesh(pistilGeom, materials.lilyCenterGreen);
  pistil.position.z = 0.25;
  group.add(pistil);

  // Pistil Stigma (3-lobed tip)
  const stigmaGeom = new THREE.SphereGeometry(0.05, 12, 10);
  stigmaGeom.scale(1.2, 1.2, 0.7);
  const stigma = new THREE.Mesh(stigmaGeom, materials.lilyCenterGreen);
  stigma.position.z = 0.56;
  group.add(stigma);

  // 6 Stamens with golden-orange anthers
  const stamenStemGeom = new THREE.CylinderGeometry(0.016, 0.014, 0.48, 8);
  stamenStemGeom.rotateX(Math.PI / 2);

  const antherGeom = new THREE.CylinderGeometry(0.038, 0.038, 0.16, 10);
  antherGeom.rotateZ(Math.PI / 2);

  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2 + (Math.PI / 6);
    const stamenGroup = new THREE.Group();
    
    const stem = new THREE.Mesh(stamenStemGeom, materials.lilyStamenStem);
    stem.position.z = 0.22;
    stamenGroup.add(stem);

    const anther = new THREE.Mesh(antherGeom, materials.lilyAnther);
    anther.position.z = 0.46;
    stamenGroup.add(anther);

    stamenGroup.rotation.z = angle;
    stamenGroup.rotation.x = 0.28; // flare outward from center
    group.add(stamenGroup);
  }

  tagFlower(group, 'white-lily', 'white-lily');
  return group;
}

/**
 * 2B. CLOSED LILY BUD (Nụ loa kèn)
 * Greenish-yellow sleek bud at top-right
 */
export function createLilyBud(materials) {
  const group = new THREE.Group();

  const budShape = new THREE.Shape();
  budShape.moveTo(0, 0);
  budShape.bezierCurveTo(0.18, 0.35, 0.22, 0.85, 0.04, 1.35);
  budShape.bezierCurveTo(0, 1.42, 0, 1.42, -0.04, 1.35);
  budShape.bezierCurveTo(-0.22, 0.85, -0.18, 0.35, 0, 0);

  const budGeom = new THREE.ExtrudeGeometry(budShape, {
    depth: 0.12,
    bevelEnabled: true,
    bevelSegments: 4,
    bevelSize: 0.08,
    bevelThickness: 0.08
  });
  budGeom.center();

  // Make 3 overlapping swollen segments
  for (let i = 0; i < 3; i++) {
    const segment = new THREE.Mesh(budGeom, materials.lilyBud);
    segment.rotation.y = (i / 3) * Math.PI * 2;
    segment.scale.set(0.85, 1, 0.85);
    group.add(segment);
  }

  // Small stem
  const stemGeom = new THREE.CylinderGeometry(0.04, 0.05, 0.4, 12);
  const stem = new THREE.Mesh(stemGeom, materials.stemGreen);
  stem.position.y = -0.7;
  group.add(stem);

  tagFlower(group, 'green-leaf', 'green-leaf');
  return group;
}

/**
 * 3. RED ROSE (Hoa hồng đỏ)
 * Chibi vinyl layered petals: center tight spiral with overlapping cupped petals
 */
export function createRose(materials) {
  const group = new THREE.Group();

  // Base calyx
  const calyxGeom = new THREE.CylinderGeometry(0.32, 0.12, 0.25, 16);
  calyxGeom.rotateX(Math.PI / 2);
  const calyx = new THREE.Mesh(calyxGeom, materials.leafGreen);
  calyx.position.z = -0.18;
  group.add(calyx);

  // Center spiral bud core
  const centerSphere = new THREE.SphereGeometry(0.24, 20, 16);
  centerSphere.scale(0.8, 0.8, 1.1);
  const center = new THREE.Mesh(centerSphere, materials.rosePetal);
  center.position.z = 0.12;
  group.add(center);

  // Inner spiral petal swirl
  const swirlTorus = new THREE.TorusGeometry(0.14, 0.07, 14, 24, Math.PI * 1.5);
  const swirl = new THREE.Mesh(swirlTorus, materials.rosePetal);
  swirl.position.z = 0.22;
  group.add(swirl);

  // Layer 1 (Tight inner ring: 3 petals)
  const innerPetalGeom = createPlumpPetalGeometry({
    width: 0.42,
    length: 0.52,
    depth: 0.06,
    bevel: 0.04,
    curl: 0.32,
    pointiness: 0.3
  });

  for (let i = 0; i < 3; i++) {
    const angle = (i / 3) * Math.PI * 2;
    const petal = new THREE.Mesh(innerPetalGeom, materials.rosePetal);
    petal.position.set(Math.cos(angle) * 0.24, Math.sin(angle) * 0.24, 0.08);
    petal.rotation.z = angle - Math.PI / 2;
    petal.rotation.x = 0.35; // hug inner core
    group.add(petal);
  }

  // Layer 2 (Mid ring: 4 petals)
  const midPetalGeom = createPlumpPetalGeometry({
    width: 0.54,
    length: 0.65,
    depth: 0.07,
    bevel: 0.045,
    curl: 0.28,
    pointiness: 0.35
  });

  for (let i = 0; i < 4; i++) {
    const angle = (i / 4) * Math.PI * 2 + (Math.PI / 4);
    const petal = new THREE.Mesh(midPetalGeom, materials.rosePetal);
    petal.position.set(Math.cos(angle) * 0.44, Math.sin(angle) * 0.44, 0.02);
    petal.rotation.z = angle - Math.PI / 2;
    petal.rotation.x = 0.52; // opening outward
    group.add(petal);
  }

  // Layer 3 (Outer ring: 5 large cupping petals)
  const outerPetalGeom = createPlumpPetalGeometry({
    width: 0.68,
    length: 0.78,
    depth: 0.075,
    bevel: 0.05,
    curl: 0.24,
    pointiness: 0.4
  });

  for (let i = 0; i < 5; i++) {
    const angle = (i / 5) * Math.PI * 2 + (Math.PI / 5);
    const petal = new THREE.Mesh(outerPetalGeom, materials.rosePetal);
    petal.position.set(Math.cos(angle) * 0.64, Math.sin(angle) * 0.64, -0.06);
    petal.rotation.z = angle - Math.PI / 2;
    petal.rotation.x = 0.72; // flared wide
    group.add(petal);
  }

  tagFlower(group, 'red-rose', 'red-rose');
  return group;
}

/**
 * 4. TULIP (Tulip xanh & Tulip hồng)
 * Plump, smooth egg/goblet shape with 3 outer cupped petals and 3 inner petals
 */
export function createTulip(materials, colorType = 'blue') {
  const group = new THREE.Group();
  const flowerId = colorType === 'blue' ? 'blue-tulip' : 'pink-tulip';
  const mat = colorType === 'blue' ? materials.blueTulip : materials.pinkTulip;

  // Inner core to prevent light passing through center
  const coreGeom = new THREE.SphereGeometry(0.36, 18, 16);
  coreGeom.scale(0.85, 1.25, 0.85);
  const core = new THREE.Mesh(coreGeom, mat);
  core.position.y = 0.38;
  group.add(core);

  // Outer cupping petals: 3 petals arranged in triad
  const outerPetalGeom = createPlumpPetalGeometry({
    width: 0.66,
    length: 0.98,
    depth: 0.065,
    bevel: 0.045,
    curl: 0.34,
    pointiness: 0.25 // rounded top
  });

  for (let i = 0; i < 3; i++) {
    const angle = (i / 3) * Math.PI * 2;
    const petal = new THREE.Mesh(outerPetalGeom, mat);
    petal.position.set(Math.cos(angle) * 0.26, 0.38, Math.sin(angle) * 0.26);
    petal.rotation.y = -angle + Math.PI / 2;
    petal.rotation.z = 0.12; // tilt inward towards top
    group.add(petal);
  }

  // Inner 3 petals interleaved
  const innerPetalGeom = createPlumpPetalGeometry({
    width: 0.62,
    length: 0.94,
    depth: 0.055,
    bevel: 0.04,
    curl: 0.36,
    pointiness: 0.2
  });

  for (let i = 0; i < 3; i++) {
    const angle = (i / 3) * Math.PI * 2 + (Math.PI / 3);
    const petal = new THREE.Mesh(innerPetalGeom, mat);
    petal.position.set(Math.cos(angle) * 0.22, 0.42, Math.sin(angle) * 0.22);
    petal.rotation.y = -angle + Math.PI / 2;
    petal.rotation.z = 0.16;
    group.add(petal);
  }

  // Green stem connector base
  const calyxGeom = new THREE.CylinderGeometry(0.18, 0.08, 0.2, 12);
  const calyx = new THREE.Mesh(calyxGeom, materials.leafGreen);
  calyx.position.y = -0.05;
  group.add(calyx);

  tagFlower(group, flowerId, `${colorType}-tulip`);
  return group;
}

/**
 * 5. SMALL WHITE FLOWER (Hoa trắng nhỏ - Daisy / Chamomile)
 * Bright yellow dome center with 7-8 rounded white petals
 */
export function createSmallDaisy(materials) {
  const group = new THREE.Group();

  // Yellow Center Dome
  const centerGeom = new THREE.SphereGeometry(0.11, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2);
  centerGeom.rotateX(Math.PI / 2);
  const center = new THREE.Mesh(centerGeom, materials.smallWhiteCenter);
  center.position.z = 0.02;
  group.add(center);

  // 8 Rounded Petals
  const petalGeom = createPlumpPetalGeometry({
    width: 0.14,
    length: 0.24,
    depth: 0.035,
    bevel: 0.025,
    curl: 0.06,
    pointiness: 0.2
  });

  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    const petal = new THREE.Mesh(petalGeom, materials.smallWhitePetal);
    petal.position.set(Math.cos(angle) * 0.18, Math.sin(angle) * 0.18, 0);
    petal.rotation.z = angle - Math.PI / 2;
    petal.rotation.x = 0.12;
    group.add(petal);
  }

  tagFlower(group, 'small-white', 'small-white');
  return group;
}

/**
 * 6. GREEN LEAF (Lá xanh)
 * Smooth rounded teardrop leaf with curved spine
 */
export function createLeaf(materials, width = 0.46, length = 1.05, light = false) {
  const group = new THREE.Group();
  const leafGeom = createPlumpLeafGeometry({
    width,
    length,
    depth: 0.04,
    bevel: 0.032,
    curl: 0.14
  });

  const mat = light ? materials.leafLightGreen : materials.leafGreen;
  const mesh = new THREE.Mesh(leafGeom, mat);
  mesh.position.y = length / 2;
  group.add(mesh);

  tagFlower(group, 'green-leaf', 'green-leaf');
  return group;
}

/**
 * 7. EUCALYPTUS SPRIG (Cành lá bạc)
 * Slender green stem with paired rounded coin-like leaves
 */
export function createEucalyptus(materials, length = 1.6, pairs = 5) {
  const group = new THREE.Group();

  // Stem
  const stemGeom = new THREE.CylinderGeometry(0.022, 0.032, length, 10);
  stemGeom.translate(0, length / 2, 0);
  const stem = new THREE.Mesh(stemGeom, materials.stemGreen);
  group.add(stem);

  // Paired coin leaves along stem
  const step = (length * 0.72) / pairs;
  const startY = length * 0.28;

  for (let i = 0; i < pairs; i++) {
    const y = startY + i * step;
    const progress = i / (pairs - 1);
    const radius = 0.18 - progress * 0.04; // taper towards top
    const leafGeom = createEucalyptusLeafGeometry({ radius, thickness: 0.028 });

    // Left leaf
    const leftLeaf = new THREE.Mesh(leafGeom, materials.eucalyptusLeaf);
    leftLeaf.position.set(-radius * 0.9, y, 0);
    leftLeaf.rotation.z = 0.25;
    leftLeaf.rotation.x = (i % 2 === 0 ? 0.2 : -0.2);
    group.add(leftLeaf);

    // Right leaf
    const rightLeaf = new THREE.Mesh(leafGeom, materials.eucalyptusLeaf);
    rightLeaf.position.set(radius * 0.9, y, 0);
    rightLeaf.rotation.z = -0.25;
    rightLeaf.rotation.x = (i % 2 === 0 ? -0.2 : 0.2);
    group.add(rightLeaf);
  }

  // Top leaf
  const topLeafGeom = createEucalyptusLeafGeometry({ radius: 0.12, thickness: 0.025 });
  const topLeaf = new THREE.Mesh(topLeafGeom, materials.eucalyptusLeaf);
  topLeaf.position.set(0, length + 0.05, 0);
  topLeaf.rotation.x = Math.PI / 4;
  group.add(topLeaf);

  tagFlower(group, 'green-leaf', 'green-leaf');
  return group;
}
