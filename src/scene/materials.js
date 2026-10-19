import * as THREE from 'three';

/**
 * Shared MeshPhysicalMaterials with stylized vinyl/chibi toy aesthetics:
 * - Smooth velvety finish with soft clearcoat
 * - Warm, vibrant, gentle colors matching the reference photo
 */

export function createMaterials() {
  return {
    // Sunflower
    sunflowerPetal: new THREE.MeshPhysicalMaterial({
      color: 0xFFC928,
      emissive: 0x442200,
      emissiveIntensity: 0.05,
      roughness: 0.38,
      metalness: 0.02,
      clearcoat: 0.3,
      clearcoatRoughness: 0.3,
      side: THREE.DoubleSide
    }),
    sunflowerCenter: new THREE.MeshPhysicalMaterial({
      color: 0x5C381E,
      roughness: 0.75,
      metalness: 0.0,
      clearcoat: 0.15,
      clearcoatRoughness: 0.5
    }),
    sunflowerBead: new THREE.MeshPhysicalMaterial({
      color: 0x7A4C2A,
      roughness: 0.6,
      metalness: 0.0,
      clearcoat: 0.2
    }),

    // Lilies (Loa kèn trắng)
    lilyPetal: new THREE.MeshPhysicalMaterial({
      color: 0xFFFDF8,
      roughness: 0.32,
      metalness: 0.02,
      clearcoat: 0.4,
      clearcoatRoughness: 0.25,
      side: THREE.DoubleSide
    }),
    lilyCenterGreen: new THREE.MeshPhysicalMaterial({
      color: 0xCFE7B0,
      roughness: 0.45,
      clearcoat: 0.25
    }),
    lilyStamenStem: new THREE.MeshPhysicalMaterial({
      color: 0xDCE8A0,
      roughness: 0.4
    }),
    lilyAnther: new THREE.MeshPhysicalMaterial({
      color: 0xC87B16,
      roughness: 0.45,
      metalness: 0.05
    }),
    lilyBud: new THREE.MeshPhysicalMaterial({
      color: 0xA1CD43,
      roughness: 0.35,
      clearcoat: 0.35
    }),

    // Red Roses
    rosePetal: new THREE.MeshPhysicalMaterial({
      color: 0xE82E40,
      emissive: 0x50050E,
      emissiveIntensity: 0.08,
      roughness: 0.35,
      metalness: 0.02,
      clearcoat: 0.38,
      clearcoatRoughness: 0.22,
      side: THREE.DoubleSide
    }),

    // Tulips
    blueTulip: new THREE.MeshPhysicalMaterial({
      color: 0x4FA4EC,
      emissive: 0x0E2A52,
      emissiveIntensity: 0.06,
      roughness: 0.32,
      metalness: 0.02,
      clearcoat: 0.4,
      clearcoatRoughness: 0.25,
      side: THREE.DoubleSide
    }),
    pinkTulip: new THREE.MeshPhysicalMaterial({
      color: 0xF792AC,
      emissive: 0x4D1A27,
      emissiveIntensity: 0.05,
      roughness: 0.32,
      metalness: 0.02,
      clearcoat: 0.4,
      clearcoatRoughness: 0.25,
      side: THREE.DoubleSide
    }),

    // Small White Flowers (Daisies)
    smallWhitePetal: new THREE.MeshPhysicalMaterial({
      color: 0xFFFFFF,
      roughness: 0.28,
      clearcoat: 0.45,
      clearcoatRoughness: 0.2,
      side: THREE.DoubleSide
    }),
    smallWhiteCenter: new THREE.MeshPhysicalMaterial({
      color: 0xFFBC1F,
      roughness: 0.4,
      clearcoat: 0.3
    }),

    // Foliage & Leaves
    leafGreen: new THREE.MeshPhysicalMaterial({
      color: 0x58914B,
      roughness: 0.38,
      metalness: 0.02,
      clearcoat: 0.35,
      clearcoatRoughness: 0.3,
      side: THREE.DoubleSide
    }),
    leafLightGreen: new THREE.MeshPhysicalMaterial({
      color: 0x76B357,
      roughness: 0.4,
      clearcoat: 0.3,
      side: THREE.DoubleSide
    }),
    eucalyptusLeaf: new THREE.MeshPhysicalMaterial({
      color: 0x4E8972,
      roughness: 0.45,
      metalness: 0.0,
      clearcoat: 0.25,
      clearcoatRoughness: 0.4,
      side: THREE.DoubleSide
    }),
    stemGreen: new THREE.MeshPhysicalMaterial({
      color: 0x41703A,
      roughness: 0.5
    }),

    // Paper Wrapping
    wrappingPaper: new THREE.MeshPhysicalMaterial({
      color: 0xF9F1F7,
      roughness: 0.82,
      metalness: 0.0,
      clearcoat: 0.04,
      clearcoatRoughness: 0.85,
      sheen: 0.08,
      sheenRoughness: 0.9,
      side: THREE.DoubleSide
    }),
    wrappingPaperBack: new THREE.MeshPhysicalMaterial({
      color: 0xF4EAF4,
      roughness: 0.82,
      clearcoat: 0.04,
      clearcoatRoughness: 0.85,
      sheen: 0.08,
      sheenRoughness: 0.9,
      side: THREE.DoubleSide
    }),

    // Satin Ribbon & Bow
    ribbonSatin: new THREE.MeshPhysicalMaterial({
      color: 0xFFF9EE,
      roughness: 0.28,
      metalness: 0.04,
      clearcoat: 0.55,
      clearcoatRoughness: 0.2,
      side: THREE.DoubleSide
    }),
    ribbonKnot: new THREE.MeshPhysicalMaterial({
      color: 0xFDF4E3,
      roughness: 0.32,
      clearcoat: 0.45
    }),
    wrappingRibbon: new THREE.MeshPhysicalMaterial({
      color: 0xE9CC9F,
      roughness: 0.3,
      clearcoat: 0.5,
      clearcoatRoughness: 0.2,
      side: THREE.DoubleSide
    }),

    // Stem Bottom Bundle
    stemBundle: new THREE.MeshStandardMaterial({
      color: 0x3E6938,
      roughness: 0.7
    })
  };
}
