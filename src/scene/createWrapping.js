import * as THREE from 'three';

/**
 * Creates the wrapping paper layers and the interactive satin ribbon bow
 */
export function createWrapping(materials) {
  const wrappingGroup = new THREE.Group();

  // 1. Back fan paper sheets (layers framing the bouquet like a crown)
  const backPaperGroup = new THREE.Group();

  // We create 5-7 angled trapezoidal folded paper planes in the back
  const sheetWidth = 1.35;
  const sheetHeight = 3.6;
  const sheetGeom = new THREE.BoxGeometry(sheetWidth, sheetHeight, 0.05);

  const backSheetConfigs = [
    { x: 0, y: 0.85, z: -0.65, rotZ: 0, rotX: -0.12, scaleY: 1.15 },
    { x: -0.85, y: 0.8, z: -0.55, rotZ: 0.16, rotX: -0.1, scaleY: 1.1 },
    { x: 0.85, y: 0.8, z: -0.55, rotZ: -0.16, rotX: -0.1, scaleY: 1.1 },
    { x: -1.6, y: 0.65, z: -0.4, rotZ: 0.32, rotX: -0.08, scaleY: 1.0 },
    { x: 1.6, y: 0.65, z: -0.4, rotZ: -0.32, rotX: -0.08, scaleY: 1.0 },
    { x: -2.15, y: 0.45, z: -0.22, rotZ: 0.45, rotX: -0.05, scaleY: 0.9 },
    { x: 2.15, y: 0.45, z: -0.22, rotZ: -0.45, rotX: -0.05, scaleY: 0.9 }
  ];

  backSheetConfigs.forEach((cfg) => {
    const sheet = new THREE.Mesh(sheetGeom, materials.wrappingPaperBack);
    sheet.position.set(cfg.x, cfg.y, cfg.z);
    sheet.rotation.set(cfg.rotX, 0, cfg.rotZ);
    sheet.scale.set(1, cfg.scaleY, 1);
    sheet.castShadow = true;
    sheet.receiveShadow = true;
    backPaperGroup.add(sheet);
  });

  wrappingGroup.add(backPaperGroup);

  // 2. Side and Front Collar Wrapping (Hugging the flowers)
  const frontWrapGroup = new THREE.Group();

  // Left wrapping flap
  const flapShapeLeft = new THREE.Shape();
  flapShapeLeft.moveTo(0, 0);
  flapShapeLeft.bezierCurveTo(-0.6, 0.4, -1.8, 1.2, -2.4, 2.0);
  flapShapeLeft.lineTo(-1.8, 2.5);
  flapShapeLeft.bezierCurveTo(-1.2, 1.8, -0.4, 0.9, 0, 0);

  const flapGeomLeft = new THREE.ExtrudeGeometry(flapShapeLeft, {
    depth: 0.04,
    bevelEnabled: true,
    bevelSegments: 3,
    bevelSize: 0.03,
    bevelThickness: 0.03
  });
  const leftFlap = new THREE.Mesh(flapGeomLeft, materials.wrappingPaper);
  leftFlap.position.set(-0.2, -1.3, 0.45);
  leftFlap.rotation.set(0.1, 0.25, 0.05);
  leftFlap.castShadow = true;
  frontWrapGroup.add(leftFlap);

  // Right wrapping flap (mirrored)
  const flapShapeRight = new THREE.Shape();
  flapShapeRight.moveTo(0, 0);
  flapShapeRight.bezierCurveTo(0.6, 0.4, 1.8, 1.2, 2.4, 2.0);
  flapShapeRight.lineTo(1.8, 2.5);
  flapShapeRight.bezierCurveTo(1.2, 1.8, 0.4, 0.9, 0, 0);

  const flapGeomRight = new THREE.ExtrudeGeometry(flapShapeRight, {
    depth: 0.04,
    bevelEnabled: true,
    bevelSegments: 3,
    bevelSize: 0.03,
    bevelThickness: 0.03
  });
  const rightFlap = new THREE.Mesh(flapGeomRight, materials.wrappingPaper);
  rightFlap.position.set(0.2, -1.3, 0.45);
  rightFlap.rotation.set(0.1, -0.25, -0.05);
  rightFlap.castShadow = true;
  frontWrapGroup.add(rightFlap);

  // Lower Front Curved Collar Wrap
  const frontCollarShape = new THREE.Shape();
  frontCollarShape.moveTo(-1.6, 0.7);
  frontCollarShape.bezierCurveTo(-0.8, -0.1, 0.8, -0.1, 1.6, 0.7);
  frontCollarShape.bezierCurveTo(1.1, 0.1, -1.1, 0.1, -1.6, 0.7);

  const frontCollarGeom = new THREE.ExtrudeGeometry(frontCollarShape, {
    depth: 0.06,
    bevelEnabled: true,
    bevelSegments: 3,
    bevelSize: 0.04,
    bevelThickness: 0.04
  });
  const frontCollar = new THREE.Mesh(frontCollarGeom, materials.wrappingPaper);
  frontCollar.position.set(0, -1.1, 0.75);
  frontCollar.rotation.x = 0.28;
  frontCollar.castShadow = true;
  frontWrapGroup.add(frontCollar);

  wrappingGroup.add(frontWrapGroup);

  // 3. Lower pleated skirt / flare below ribbon
  const skirtGroup = new THREE.Group();
  const skirtHeight = 1.45;
  const numPleats = 10;
  
  // Create a stylized pleated cone using multiple beveled wedge folds
  for (let i = 0; i < numPleats; i++) {
    const angle = (i / (numPleats - 1) - 0.5) * Math.PI * 0.95; // fan from front-left to front-right
    const pleatWidthTop = 0.14;
    const pleatWidthBottom = 0.38;

    const pleatShape = new THREE.Shape();
    pleatShape.moveTo(-pleatWidthTop / 2, 0);
    pleatShape.lineTo(pleatWidthTop / 2, 0);
    pleatShape.lineTo(pleatWidthBottom / 2, -skirtHeight);
    pleatShape.lineTo(-pleatWidthBottom / 2, -skirtHeight);
    pleatShape.closePath();

    const pleatGeom = new THREE.ExtrudeGeometry(pleatShape, {
      depth: 0.05,
      bevelEnabled: true,
      bevelSegments: 3,
      bevelSize: 0.035,
      bevelThickness: 0.035
    });

    const pleat = new THREE.Mesh(pleatGeom, materials.wrappingPaper);
    const radiusTop = 0.42;
    pleat.position.set(
      Math.sin(angle) * radiusTop,
      -1.4,
      Math.cos(angle) * (radiusTop * 0.7) - 0.1
    );
    pleat.rotation.y = angle;
    pleat.rotation.x = -0.16; // flare outwards at bottom
    pleat.castShadow = true;
    pleat.receiveShadow = true;
    skirtGroup.add(pleat);
  }

  // Inside bottom stem bundle plug
  const bottomBundleGeom = new THREE.CylinderGeometry(0.35, 0.48, skirtHeight, 16);
  const bottomBundle = new THREE.Mesh(bottomBundleGeom, materials.stemBundle);
  bottomBundle.position.set(0, -1.4 - skirtHeight / 2, -0.1);
  skirtGroup.add(bottomBundle);

  wrappingGroup.add(skirtGroup);

  // 4. Interactive Ribbon Bow & Tails (Chiếc nơ ruy băng)
  const bowGroup = createRibbonBow(materials);
  bowGroup.position.set(0, -1.42, 0.65);
  wrappingGroup.add(bowGroup);

  return wrappingGroup;
}

/**
 * Creates the plump, cute satin ribbon bow that opens the love letter
 */
export function createRibbonBow(materials) {
  const bowGroup = new THREE.Group();

  // Central Knot (Plump rounded cushion)
  const knotGeom = new THREE.CylinderGeometry(0.18, 0.18, 0.24, 20);
  knotGeom.scale(1.2, 1, 0.95);
  const knot = new THREE.Mesh(knotGeom, materials.ribbonKnot);
  knot.castShadow = true;
  bowGroup.add(knot);

  // Left Loop (Puffed curved loop)
  const loopGeomLeft = createBowLoopGeometry({ isLeft: true });
  const leftLoop = new THREE.Mesh(loopGeomLeft, materials.ribbonSatin);
  leftLoop.position.set(-0.52, 0.05, 0.04);
  leftLoop.rotation.set(0.05, 0.15, 0.12);
  leftLoop.castShadow = true;
  bowGroup.add(leftLoop);

  // Right Loop (Puffed curved loop)
  const loopGeomRight = createBowLoopGeometry({ isLeft: false });
  const rightLoop = new THREE.Mesh(loopGeomRight, materials.ribbonSatin);
  rightLoop.position.set(0.52, 0.05, 0.04);
  rightLoop.rotation.set(0.05, -0.15, -0.12);
  rightLoop.castShadow = true;
  bowGroup.add(rightLoop);

  // Ribbon Tails (Hanging down gracefully with diagonal cut ends)
  const tailWidth = 0.28;
  const tailLength = 0.95;

  // Left Tail
  const leftTailGeom = createBowTailGeometry({ width: tailWidth, length: tailLength, slant: 0.1 });
  const leftTail = new THREE.Mesh(leftTailGeom, materials.ribbonSatin);
  leftTail.position.set(-0.25, -0.58, 0.08);
  leftTail.rotation.set(-0.15, 0.12, 0.22);
  leftTail.castShadow = true;
  bowGroup.add(leftTail);

  // Right Tail
  const rightTailGeom = createBowTailGeometry({ width: tailWidth, length: tailLength, slant: -0.1 });
  const rightTail = new THREE.Mesh(rightTailGeom, materials.ribbonSatin);
  rightTail.position.set(0.25, -0.58, 0.08);
  rightTail.rotation.set(-0.15, -0.12, -0.22);
  rightTail.castShadow = true;
  bowGroup.add(rightTail);

  // Tag with love letter interaction metadata
  bowGroup.userData = {
    flowerId: 'ribbon-bow',
    flowerType: 'ribbon-bow',
    isInteractive: true,
    isLetter: true
  };

  bowGroup.traverse((child) => {
    if (child.isMesh) {
      child.userData = {
        flowerId: 'ribbon-bow',
        flowerType: 'ribbon-bow',
        isInteractive: true,
        isLetter: true
      };
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  return bowGroup;
}

/**
 * Creates a smooth puffed ribbon loop
 */
function createBowLoopGeometry({ isLeft = true }) {
  const shape = new THREE.Shape();
  const dir = isLeft ? -1 : 1;
  const loopW = 0.58 * dir;
  const loopH = 0.32;

  shape.moveTo(0, 0);
  shape.bezierCurveTo(loopW * 0.4, loopH * 0.9, loopW * 0.9, loopH * 0.7, loopW, 0);
  shape.bezierCurveTo(loopW * 0.9, -loopH * 0.7, loopW * 0.4, -loopH * 0.9, 0, 0);

  const extrudeSettings = {
    depth: 0.16,
    bevelEnabled: true,
    bevelSegments: 4,
    bevelSize: 0.05,
    bevelThickness: 0.05
  };

  const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  geom.center();
  return geom;
}

/**
 * Creates a curved ribbon tail with an angled cut end
 */
function createBowTailGeometry({ width = 0.28, length = 0.95, slant = 0.1 }) {
  const shape = new THREE.Shape();
  const halfW = width / 2;

  shape.moveTo(-halfW, 0);
  shape.lineTo(halfW, 0);
  shape.lineTo(halfW + slant, -length);
  shape.lineTo(0, -length + 0.12); // chevron notch
  shape.lineTo(-halfW + slant, -length);
  shape.closePath();

  const geom = new THREE.ExtrudeGeometry(shape, {
    depth: 0.03,
    bevelEnabled: true,
    bevelSegments: 3,
    bevelSize: 0.02,
    bevelThickness: 0.02
  });

  // Curve along length
  const pos = geom.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i);
    const progress = Math.abs(y) / length;
    const curveZ = Math.sin(progress * Math.PI * 0.8) * 0.08;
    pos.setZ(i, pos.getZ(i) + curveZ);
  }
  geom.computeVertexNormals();

  return geom;
}
