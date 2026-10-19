import * as THREE from 'three';

const PAPER_THICKNESS = 0.12;

/**
 * Creates the wrapping paper layers and the interactive satin ribbon bow
 */
export function createWrapping(materials) {
  const wrappingGroup = new THREE.Group();
  wrappingGroup.name = 'BouquetWrapping';

  // 1. Overlapping fan sheets gathered behind the flower stems
  const backPaperGroup = new THREE.Group();
  const sheetGeom = createFanSheetGeometry(PAPER_THICKNESS);

  const fanOffsets = [-6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6];
  fanOffsets.forEach((fanOffset, index) => {
    const sheetMaterial = index % 2 === 0 ? materials.wrappingPaperBack : materials.wrappingPaper;
    const sheet = new THREE.Mesh(sheetGeom, sheetMaterial);
    sheet.position.set(0, -1.68, 0.18);
    sheet.rotation.set(
      THREE.MathUtils.degToRad(-20),
      fanOffset * 0.06,
      fanOffset * 0.1
    );
    sheet.scale.set(1.05, 1 - Math.abs(fanOffset) * 0.025, 1);
    sheet.castShadow = true;
    sheet.receiveShadow = true;
    backPaperGroup.add(sheet);
  });

  wrappingGroup.add(backPaperGroup);

  // 2. Curved collar wraps around the stems and meets the gathered skirt
  const collar = new THREE.Mesh(createCollarGeometry(), materials.wrappingPaper);
  collar.position.y = 0.66;
  collar.position.z = 0.3;
  collar.castShadow = true;
  collar.receiveShadow = true;
  wrappingGroup.add(collar);

  // 3. Continuous pleated skirt gathered under the collar
  const skirtGroup = new THREE.Group();
  skirtGroup.position.z = 0.3;
  const skirtHeight = 1.86;
  const skirtTopY = -1;
  const skirtGeom = createPleatedWrapGeometry(skirtHeight, PAPER_THICKNESS);
  const skirt = new THREE.Mesh(skirtGeom, materials.wrappingPaper);
  skirt.position.y = skirtTopY;
  skirt.castShadow = true;
  skirt.receiveShadow = true;
  skirtGroup.add(skirt);

  const coneSlope = (0.82 - 0.44) / skirtHeight;
  const normalLength = Math.hypot(1, coneSlope);
  const innerBottomRadius = 0.82 - PAPER_THICKNESS / normalLength;
  const underside = new THREE.Mesh(
    new THREE.CircleGeometry(innerBottomRadius, 96),
    materials.wrappingPaper
  );
  underside.rotation.x = Math.PI / 2;
  underside.position.set(
    0,
    skirtTopY - skirtHeight - PAPER_THICKNESS * coneSlope / normalLength - 0.003,
    0
  );
  underside.receiveShadow = true;
  skirtGroup.add(underside);

  // Layer folded paper panels over the front of the skirt to define its pleats.
  const panelCenters = [-1.08, -0.54, 0, 0.54, 1.08];
  panelCenters.forEach((centerAngle, index) => {
    const panel = new THREE.Mesh(
      createFoldedPaperPanelGeometry(skirtHeight, centerAngle, 0.68),
      index % 2 === 0 ? materials.wrappingPaper : materials.wrappingPaperBack
    );
    panel.position.y = skirtTopY;
    panel.castShadow = true;
    panel.receiveShadow = true;
    skirtGroup.add(panel);
  });

  // Inside bottom stem bundle plug
  const bottomBundleGeom = new THREE.CylinderGeometry(0.35, 0.48, skirtHeight, 16);
  const bottomBundle = new THREE.Mesh(bottomBundleGeom, materials.stemBundle);
  bottomBundle.position.set(0, skirtTopY - skirtHeight / 2, 0);
  skirtGroup.add(bottomBundle);

  const waistBand = new THREE.Mesh(
    createRibbonBandGeometry(skirtHeight, 0.32, 0.16),
    materials.wrappingRibbon
  );
  waistBand.position.set(0, skirtTopY - 0.32, 0);
  waistBand.castShadow = true;
  waistBand.receiveShadow = true;
  skirtGroup.add(waistBand);

  wrappingGroup.add(skirtGroup);

  // 4. Interactive Ribbon Bow & Tails (Chiếc nơ ruy băng)
  const bowGroup = createRibbonBow(materials);
  bowGroup.position.set(0, skirtTopY, 0.9);
  bowGroup.scale.set(0.92, 0.82, 1);
  wrappingGroup.add(bowGroup);
  wrappingGroup.userData.ribbonTails = bowGroup.userData.ribbonTails;

  return wrappingGroup;
}

export function updateRibbonMotion(wrappingGroup, delta, rotationVelocity) {
  const tails = wrappingGroup.userData.ribbonTails;
  if (!tails) return;

  for (const tail of tails) {
    const state = tail.userData.motion;
    const side = tail.userData.side;
    const damping = Math.exp(-5.5 * delta);
    const spring = 18;

    state.velocityX += (-spring * state.angleX + rotationVelocity.pitch * 0.34) * delta;
    state.velocityZ += (-spring * state.angleZ - rotationVelocity.yaw * side * 0.42) * delta;
    state.velocityX *= damping;
    state.velocityZ *= damping;
    state.angleX += state.velocityX * delta;
    state.angleZ += state.velocityZ * delta;

    tail.rotation.x = -0.1 + THREE.MathUtils.clamp(state.angleX, -0.42, 0.42);
    tail.rotation.z = side * 0.06 + THREE.MathUtils.clamp(state.angleZ, -0.48, 0.48);
  }
}

function createRibbonBandGeometry(skirtHeight, centerDepth, height) {
  const segments = 96;
  const frontPositions = [];
  const innerPositions = [];
  const thickness = PAPER_THICKNESS;

  for (let index = 0; index <= segments; index++) {
    const angle = (index / segments) * Math.PI * 2;
    const pleat = Math.cos(angle * 12) * 0.012;
    for (const verticalOffset of [-height / 2, height / 2]) {
      const depth = centerDepth - verticalOffset;
      const progress = depth / skirtHeight;
      const paperRadius = THREE.MathUtils.lerp(0.44, 0.82, progress);
      const bandRadius = paperRadius + 0.105 + pleat;
      frontPositions.push(
        Math.cos(angle) * bandRadius,
        verticalOffset,
        Math.sin(angle) * bandRadius
      );
      innerPositions.push(
        Math.cos(angle) * (bandRadius - thickness),
        verticalOffset,
        Math.sin(angle) * (bandRadius - thickness)
      );
    }
  }

  return createSolidGridGeometry(frontPositions, innerPositions, segments + 1, 2);
}

function createCollarGeometry() {
  const radialSegments = 64;
  const frontPositions = [];
  const innerPositions = [];
  const maxAngle = 1.2;

  for (let index = 0; index <= radialSegments; index++) {
    const angle = (index / radialSegments - 0.5) * maxAngle * 2;
    const spread = Math.abs(angle) / maxAngle;
    const radius = 0.55 + spread * 0.72;
    const upperY = -1.35 + spread * 0.36;

    for (let edge = 0; edge <= 1; edge++) {
      const y = upperY - edge * 0.34;
      for (const radiusOffset of [PAPER_THICKNESS / 2, -PAPER_THICKNESS / 2]) {
        const layerRadius = radius + radiusOffset;
        const positions = radiusOffset > 0 ? frontPositions : innerPositions;
        positions.push(
          Math.sin(angle) * layerRadius,
          y,
          Math.cos(angle) * layerRadius + 0.05
        );
      }
    }
  }

  const frontGrid = [];
  const innerGrid = [];
  for (let index = 0; index <= radialSegments; index++) {
    for (let edge = 0; edge <= 1; edge++) {
      const start = (index * 2 + edge) * 3;
      frontGrid.push(...frontPositions.slice(start, start + 3));
      innerGrid.push(...innerPositions.slice(start, start + 3));
    }
  }

  return createSolidGridGeometry(frontGrid, innerGrid, radialSegments + 1, 2);
}

function createFanSheetGeometry(thickness) {
  const height = 3.8;
  const bevelThickness = Math.min(0.025, thickness / 2);
  const shape = new THREE.Shape();
  shape.moveTo(-0.38, 0);
  shape.bezierCurveTo(-0.43, height * 0.25, -0.56, height * 0.65, -0.62, height * 0.88);
  shape.bezierCurveTo(-0.65, height * 0.97, -0.33, height, 0, height);
  shape.bezierCurveTo(0.33, height, 0.65, height * 0.97, 0.62, height * 0.88);
  shape.bezierCurveTo(0.56, height * 0.65, 0.43, height * 0.25, 0.38, 0);
  shape.bezierCurveTo(0.25, 0.06, -0.25, 0.06, -0.38, 0);

  return new THREE.ExtrudeGeometry(shape, {
    depth: thickness - bevelThickness * 2,
    bevelEnabled: true,
    bevelSegments: 4,
    bevelSize: 0.02,
    bevelThickness,
    curveSegments: 16
  });
}

function createPleatedWrapGeometry(height, thickness) {
  const radialSegments = 96;
  const heightSegments = 12;
  const pleatCount = 12;
  const positions = [];
  const indices = [];
  const rowSize = radialSegments + 1;
  const shellSize = (heightSegments + 1) * rowSize;
  const coneSlope = (0.82 - 0.44) / height;
  const normalLength = Math.hypot(1, coneSlope);
  const radialInset = thickness / normalLength;
  const verticalInset = thickness * coneSlope / normalLength;

  for (const inner of [false, true]) {
    for (let yIndex = 0; yIndex <= heightSegments; yIndex++) {
      const progress = yIndex / heightSegments;
      const radius = THREE.MathUtils.lerp(0.44, 0.82, progress) - (inner ? radialInset : 0);
      const foldStrength = Math.sin(progress * Math.PI) * 0.045;

      for (let radialIndex = 0; radialIndex <= radialSegments; radialIndex++) {
        const angle = (radialIndex / radialSegments) * Math.PI * 2;
        const pleatedRadius = radius + Math.cos(angle * pleatCount) * foldStrength;
        positions.push(
          Math.cos(angle) * pleatedRadius,
          -progress * height - (inner ? verticalInset : 0),
          Math.sin(angle) * pleatedRadius
        );
      }
    }
  }

  for (const inner of [false, true]) {
    const shellOffset = inner ? shellSize : 0;
    for (let yIndex = 0; yIndex < heightSegments; yIndex++) {
      for (let radialIndex = 0; radialIndex < radialSegments; radialIndex++) {
        const current = shellOffset + yIndex * rowSize + radialIndex;
        const nextRow = current + rowSize;
        if (inner) {
          indices.push(current, nextRow + 1, current + 1, current, nextRow, nextRow + 1);
        } else {
          indices.push(current, current + 1, nextRow + 1, current, nextRow + 1, nextRow);
        }
      }
    }
  }

  for (let radialIndex = 0; radialIndex < radialSegments; radialIndex++) {
    const topOuter = radialIndex;
    const topInner = shellSize + radialIndex;
    const bottomOuter = heightSegments * rowSize + radialIndex;
    const bottomInner = shellSize + heightSegments * rowSize + radialIndex;
    indices.push(topOuter, topInner + 1, topOuter + 1, topOuter, topInner, topInner + 1);
    indices.push(bottomOuter, bottomOuter + 1, bottomInner + 1, bottomOuter, bottomInner + 1, bottomInner);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

function createFoldedPaperPanelGeometry(height, centerAngle, panelWidth) {
  const angleSegments = 8;
  const heightSegments = 12;
  const frontPositions = [];
  const innerPositions = [];

  for (let yIndex = 0; yIndex <= heightSegments; yIndex++) {
    const progress = yIndex / heightSegments;
    const radius = THREE.MathUtils.lerp(0.44, 0.82, progress);

    for (let angleIndex = 0; angleIndex <= angleSegments; angleIndex++) {
      const across = angleIndex / angleSegments;
      const localAngle = (across - 0.5) * panelWidth;
      const fold = Math.sin(across * Math.PI);
      const angle = centerAngle + localAngle;
      const foldedRadius = radius + 0.025 + fold * 0.055;

      frontPositions.push(
        Math.sin(angle) * foldedRadius,
        -progress * height,
        Math.cos(angle) * foldedRadius
      );
      innerPositions.push(
        Math.sin(angle) * (foldedRadius - PAPER_THICKNESS),
        -progress * height,
        Math.cos(angle) * (foldedRadius - PAPER_THICKNESS)
      );
    }
  }

  return createSolidGridGeometry(
    frontPositions,
    innerPositions,
    heightSegments + 1,
    angleSegments + 1
  );
}

function createSolidGridGeometry(frontPositions, innerPositions, rowCount, columnCount) {
  const shellSize = frontPositions.length / 3;
  const positions = [...frontPositions, ...innerPositions];
  const indices = [];

  for (let row = 0; row < rowCount - 1; row++) {
    for (let column = 0; column < columnCount - 1; column++) {
      const current = row * columnCount + column;
      const nextRow = current + columnCount;
      indices.push(current, current + 1, nextRow + 1, current, nextRow + 1, nextRow);
      indices.push(
        shellSize + current,
        shellSize + nextRow + 1,
        shellSize + current + 1,
        shellSize + current,
        shellSize + nextRow,
        shellSize + nextRow + 1
      );
    }
  }

  const perimeter = [];
  for (let column = 0; column < columnCount; column++) perimeter.push(column);
  for (let row = 1; row < rowCount; row++) perimeter.push(row * columnCount + columnCount - 1);
  for (let column = columnCount - 2; column >= 0; column--) perimeter.push((rowCount - 1) * columnCount + column);
  for (let row = rowCount - 2; row > 0; row--) perimeter.push(row * columnCount);

  perimeter.forEach((current, index) => {
    const next = perimeter[(index + 1) % perimeter.length];
    indices.push(current, shellSize + current, shellSize + next, current, shellSize + next, next);
  });

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
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
  const leftTailPivot = new THREE.Group();
  leftTailPivot.position.set(-0.25, -0.12, 0.08);
  leftTailPivot.userData = {
    side: -1,
    motion: { angleX: 0, angleZ: 0, velocityX: 0, velocityZ: 0 }
  };
  const leftTail = new THREE.Mesh(leftTailGeom, materials.ribbonSatin);
  leftTail.castShadow = true;
  leftTailPivot.add(leftTail);
  bowGroup.add(leftTailPivot);

  // Right Tail
  const rightTailGeom = createBowTailGeometry({ width: tailWidth, length: tailLength, slant: -0.1 });
  const rightTailPivot = new THREE.Group();
  rightTailPivot.position.set(0.25, -0.12, 0.08);
  rightTailPivot.userData = {
    side: 1,
    motion: { angleX: 0, angleZ: 0, velocityX: 0, velocityZ: 0 }
  };
  const rightTail = new THREE.Mesh(rightTailGeom, materials.ribbonSatin);
  rightTail.castShadow = true;
  rightTailPivot.add(rightTail);
  bowGroup.add(rightTailPivot);

  // Tag with love letter interaction metadata
  bowGroup.userData = {
    flowerId: 'ribbon-bow',
    flowerType: 'ribbon-bow',
    isInteractive: true,
    isLetter: true,
    ribbonTails: [leftTailPivot, rightTailPivot]
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
    depth: 0.05,
    bevelEnabled: true,
    bevelSegments: 3,
    bevelSize: 0.025,
    bevelThickness: 0.025
  });

  // Curve along length
  const pos = geom.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i);
    const progress = Math.abs(y) / length;
    const curveZ = Math.sin(progress * Math.PI * 0.8) * 0.08;
    pos.setZ(i, pos.getZ(i) + curveZ);
  }
  geom.translate(0, 0, -0.015);
  geom.computeVertexNormals();

  return geom;
}
