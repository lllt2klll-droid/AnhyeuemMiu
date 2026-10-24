import * as THREE from 'three';

/**
 * Utility functions for creating plump, rounded, chibi-style 3D geometries
 * using Shape + ExtrudeGeometry with bevels and smooth vertex curvature.
 */

/**
 * Creates a plump, beveled petal geometry with rounded edges and curvature
 */
export function createPlumpPetalGeometry({
  width = 0.35,
  length = 0.8,
  depth = 0.06,
  bevel = 0.04,
  curl = 0.15,
  pointiness = 0.7 // 0 = blunt/rounded, 1 = tapered
}) {
  const shape = new THREE.Shape();
  const halfW = width / 2;

  shape.moveTo(0, 0);
  
  // Right side curve up to tip
  shape.bezierCurveTo(
    halfW * 0.9, length * 0.25,
    halfW * 1.1, length * 0.65,
    halfW * (1 - pointiness * 0.6), length * 0.92
  );
  
  // Rounded tip
  shape.bezierCurveTo(
    halfW * 0.2 * (1 - pointiness), length,
    -halfW * 0.2 * (1 - pointiness), length,
    -halfW * (1 - pointiness * 0.6), length * 0.92
  );

  // Left side curve back down to base
  shape.bezierCurveTo(
    -halfW * 1.1, length * 0.65,
    -halfW * 0.9, length * 0.25,
    0, 0
  );

  const extrudeSettings = {
    steps: 1,
    depth: depth,
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelOffset: 0,
    bevelSegments: 4
  };

  const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  geometry.center();

  // Apply gentle organic bend/curl along Z axis based on Y position
  const pos = geometry.attributes.position;
  const minY = -length / 2;
  const maxY = length / 2;
  const spanY = maxY - minY;

  for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i);
    const normalizedY = (y - minY) / spanY; // 0 to 1
    // Arch backward or forward
    const zOffset = Math.sin(normalizedY * Math.PI) * curl + (normalizedY * normalizedY) * (curl * 0.5);
    pos.setZ(i, pos.getZ(i) + zOffset);
  }

  geometry.computeVertexNormals();
  return geometry;
}

/**
 * Creates a curved lily petal geometry (longer, flaring outwards, fluted center)
 */
export function createLilyPetalGeometry({
  width = 0.55,
  length = 1.45,
  depth = 0.05,
  bevel = 0.035,
  curl = 0.38
}) {
  const shape = new THREE.Shape();
  const halfW = width / 2;

  shape.moveTo(0, 0);
  shape.bezierCurveTo(
    halfW * 0.7, length * 0.3,
    halfW * 1.15, length * 0.65,
    halfW * 0.4, length * 0.94
  );
  // Rounded tip
  shape.bezierCurveTo(
    0, length,
    0, length,
    -halfW * 0.4, length * 0.94
  );
  shape.bezierCurveTo(
    -halfW * 1.15, length * 0.65,
    -halfW * 0.7, length * 0.3,
    0, 0
  );

  const extrudeSettings = {
    steps: 1,
    depth: depth,
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments: 4
  };

  const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  geometry.center();

  // Curvature: fluted center channel and curling backwards at the tip
  const pos = geometry.attributes.position;
  const minY = -length / 2;
  const maxY = length / 2;
  const spanY = maxY - minY;

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const normY = THREE.MathUtils.clamp((y - minY) / spanY, 0, 1);

    // Curl backwards at upper tip
    const curlZ = -Math.pow(normY, 1.8) * curl;
    // Central groove
    const fluteZ = (1 - Math.abs(x) / (halfW + 0.01)) * 0.04 * (1 - normY);

    pos.setZ(i, pos.getZ(i) + curlZ + fluteZ);
  }

  geometry.computeVertexNormals();
  return geometry;
}

/**
 * Creates a smooth, rounded leaf geometry with center spine curve
 */
export function createPlumpLeafGeometry({
  width = 0.42,
  length = 0.95,
  depth = 0.04,
  bevel = 0.03,
  curl = 0.12
}) {
  const shape = new THREE.Shape();
  const halfW = width / 2;

  shape.moveTo(0, 0);
  shape.bezierCurveTo(
    halfW * 1.1, length * 0.35,
    halfW * 0.95, length * 0.75,
    0, length
  );
  shape.bezierCurveTo(
    -halfW * 0.95, length * 0.75,
    -halfW * 1.1, length * 0.35,
    0, 0
  );

  const extrudeSettings = {
    steps: 1,
    depth: depth,
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments: 3
  };

  const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  geometry.center();

  const pos = geometry.attributes.position;
  const minY = -length / 2;
  const maxY = length / 2;
  const spanY = maxY - minY;

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const normY = (y - minY) / spanY;
    const archZ = Math.sin(normY * Math.PI) * curl - Math.abs(x) * 0.1;
    pos.setZ(i, pos.getZ(i) + archZ);
  }

  geometry.computeVertexNormals();
  return geometry;
}

/**
 * Creates a coin-shaped eucalyptus leaf geometry
 */
export function createEucalyptusLeafGeometry({ radius = 0.16, thickness = 0.03 }) {
  const geom = new THREE.CylinderGeometry(radius, radius, thickness, 20, 1);
  geom.rotateX(Math.PI / 2);
  geom.scale(1, 0.85, 1); // slightly oval
  return geom;
}
