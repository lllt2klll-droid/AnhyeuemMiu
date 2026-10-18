import * as THREE from 'three';
import { createMaterials } from './materials.js';
import {
  createSunflower,
  createLily,
  createLilyBud,
  createRose,
  createTulip,
  createSmallDaisy,
  createLeaf,
  createEucalyptus
} from './createFlowers.js';
import { createWrapping } from './createWrapping.js';

/**
 * Assembles the entire 3D flower bouquet according to the reference image
 */
export function createBouquet() {
  const bouquet = new THREE.Group();
  bouquet.name = 'BouquetRoot';

  const materials = createMaterials();

  // 1. Wrapping paper & Ribbon Bow
  const wrapping = createWrapping(materials);
  bouquet.add(wrapping);

  // 2. Eucalyptus Branches (Behind & Peeking Out)
  const euca1 = createEucalyptus(materials, 1.7, 6);
  euca1.position.set(-1.6, 0.95, -0.05);
  euca1.rotation.set(0.12, 0.1, 0.38);
  euca1.scale.set(0.9, 0.9, 0.9);
  bouquet.add(euca1);

  const euca2 = createEucalyptus(materials, 1.5, 5);
  euca2.position.set(-0.48, 1.25, 0.0);
  euca2.rotation.set(0.08, 0, 0.12);
  euca2.scale.set(0.85, 0.85, 0.85);
  bouquet.add(euca2);

  const euca3 = createEucalyptus(materials, 1.6, 5);
  euca3.position.set(1.8, 1.2, 0.05);
  euca3.rotation.set(0.1, -0.12, -0.36);
  euca3.scale.set(0.88, 0.88, 0.88);
  bouquet.add(euca3);

  const euca4 = createEucalyptus(materials, 1.4, 5);
  euca4.position.set(2.05, -0.15, 0.15);
  euca4.rotation.set(0.15, -0.2, -0.68);
  euca4.scale.set(0.82, 0.82, 0.82);
  bouquet.add(euca4);

  // 3. Broad Foliage & Leaves (Back & Outer Framing)
  const leaf1 = createLeaf(materials, 0.52, 1.2, false);
  leaf1.position.set(1.68, 1.15, -0.08);
  leaf1.rotation.set(0.1, -0.25, -0.48);
  bouquet.add(leaf1);

  const leaf2 = createLeaf(materials, 0.55, 1.25, true);
  leaf2.position.set(-1.82, 0.35, 0.18);
  leaf2.rotation.set(0.18, 0.35, 0.82);
  bouquet.add(leaf2);

  const leaf3 = createLeaf(materials, 0.48, 1.1, false);
  leaf3.position.set(-1.05, -0.75, 0.42);
  leaf3.rotation.set(0.3, 0.25, 0.62);
  bouquet.add(leaf3);

  const leaf4 = createLeaf(materials, 0.5, 1.05, false);
  leaf4.position.set(0.1, -0.82, 0.52);
  leaf4.rotation.set(0.38, -0.05, -0.12);
  bouquet.add(leaf4);

  const leaf5 = createLeaf(materials, 0.48, 1.1, true);
  leaf5.position.set(1.22, -0.72, 0.42);
  leaf5.rotation.set(0.32, -0.28, -0.64);
  bouquet.add(leaf5);

  // 4. Closed Lily Bud (Top Right)
  const lilyBud = createLilyBud(materials);
  lilyBud.position.set(1.36, 1.95, 0.12);
  lilyBud.rotation.set(0.12, -0.22, -0.34);
  lilyBud.scale.set(0.86, 0.86, 0.86);
  bouquet.add(lilyBud);

  // 5. White Lilies (Loa kèn trắng)
  // Lily 1: Upper Right Large Lily
  const lilyTop = createLily(materials);
  lilyTop.position.set(0.58, 1.48, 0.38);
  lilyTop.rotation.set(0.24, -0.18, -0.12);
  lilyTop.scale.set(0.96, 0.96, 0.96);
  bouquet.add(lilyTop);

  // Lily 2: Middle-Left Facing Lily
  const lilyLeft = createLily(materials);
  lilyLeft.position.set(-1.26, -0.06, 0.56);
  lilyLeft.rotation.set(0.22, 0.46, 0.2);
  lilyLeft.scale.set(0.86, 0.86, 0.86);
  bouquet.add(lilyLeft);

  // 6. Center Sunflower (Hoa hướng dương)
  const sunflower = createSunflower(materials);
  sunflower.position.set(0.0, 0.16, 0.56);
  sunflower.rotation.set(0.16, -0.06, -0.04);
  sunflower.scale.set(1.06, 1.06, 1.06);
  bouquet.add(sunflower);

  // 7. Red Roses (3 Roses)
  // Rose 1: Upper right between sunflower, lily and blue tulip
  const rose1 = createRose(materials);
  rose1.position.set(1.24, 0.72, 0.44);
  rose1.rotation.set(0.26, -0.32, -0.14);
  rose1.scale.set(0.82, 0.82, 0.82);
  bouquet.add(rose1);

  // Rose 2: Lower-middle-left under sunflower
  const rose2 = createRose(materials);
  rose2.position.set(-0.36, -0.48, 0.66);
  rose2.rotation.set(0.36, 0.12, 0.02);
  rose2.scale.set(0.82, 0.82, 0.82);
  bouquet.add(rose2);

  // Rose 3: Lower-middle-right under sunflower
  const rose3 = createRose(materials);
  rose3.position.set(0.88, -0.34, 0.58);
  rose3.rotation.set(0.32, -0.26, -0.12);
  rose3.scale.set(0.8, 0.8, 0.8);
  bouquet.add(rose3);

  // 8. Blue Tulips (2 Tulips)
  // Blue Tulip 1: Top Left
  const blueTulip1 = createTulip(materials, 'blue');
  blueTulip1.position.set(-0.84, 1.45, 0.22);
  blueTulip1.rotation.set(0.16, 0.22, 0.24);
  blueTulip1.scale.set(0.82, 0.82, 0.82);
  bouquet.add(blueTulip1);

  // Blue Tulip 2: Mid-Far Right
  const blueTulip2 = createTulip(materials, 'blue');
  blueTulip2.position.set(1.88, 0.62, 0.32);
  blueTulip2.rotation.set(0.18, -0.36, -0.28);
  blueTulip2.scale.set(0.78, 0.78, 0.78);
  bouquet.add(blueTulip2);

  // 9. Pink Tulips (2 Tulips)
  // Pink Tulip 1: Upper Left next to blue tulip
  const pinkTulip1 = createTulip(materials, 'pink');
  pinkTulip1.position.set(-1.28, 0.92, 0.42);
  pinkTulip1.rotation.set(0.22, 0.32, 0.26);
  pinkTulip1.scale.set(0.8, 0.8, 0.8);
  bouquet.add(pinkTulip1);

  // Pink Tulip 2: Lower Right under blue tulip
  const pinkTulip2 = createTulip(materials, 'pink');
  pinkTulip2.position.set(1.46, -0.06, 0.52);
  pinkTulip2.rotation.set(0.28, -0.32, -0.22);
  pinkTulip2.scale.set(0.76, 0.76, 0.76);
  bouquet.add(pinkTulip2);

  // 10. Small White Daisies / Chamomiles (Sprinkled throughout)
  const daisyConfigs = [
    { x: -0.18, y: 1.72, z: 0.16, rx: 0.12, ry: 0.05, rz: 0.1, s: 0.85 },
    { x: -0.52, y: 1.48, z: 0.26, rx: 0.16, ry: 0.12, rz: -0.15, s: 0.8 },
    { x: -0.38, y: 0.96, z: 0.58, rx: 0.26, ry: 0.14, rz: 0.2, s: 0.8 },
    { x: 0.96, y: 1.28, z: 0.46, rx: 0.22, ry: -0.2, rz: -0.25, s: 0.78 },
    { x: 1.95, y: 1.15, z: 0.22, rx: 0.16, ry: -0.26, rz: -0.3, s: 0.82 },
    { x: 0.28, y: -0.34, z: 0.72, rx: 0.32, ry: 0.0, rz: 0.1, s: 0.85 },
    { x: 0.42, y: -0.72, z: 0.68, rx: 0.36, ry: -0.1, rz: -0.15, s: 0.82 },
    { x: -0.84, y: -0.82, z: 0.62, rx: 0.35, ry: 0.22, rz: 0.3, s: 0.8 },
    { x: -0.25, y: -0.88, z: 0.65, rx: 0.4, ry: 0.0, rz: 0.05, s: 0.8 },
    { x: 1.62, y: -0.45, z: 0.55, rx: 0.32, ry: -0.3, rz: -0.25, s: 0.78 }
  ];

  daisyConfigs.forEach((cfg) => {
    const daisy = createSmallDaisy(materials);
    daisy.position.set(cfg.x, cfg.y, cfg.z);
    daisy.rotation.set(cfg.rx, cfg.ry, cfg.rz);
    daisy.scale.set(cfg.s, cfg.s, cfg.s);
    bouquet.add(daisy);
  });

  // Center bouquet origin adjustment
  bouquet.position.y = -0.1;

  return bouquet;
}
