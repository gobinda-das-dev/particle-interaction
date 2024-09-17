uniform vec2 uResolution;
uniform float uPointSize;
uniform vec2 uInteraction;
uniform float uStrength;
uniform float uRadius;

varying vec2 vUv;
varying float vInfluence;

void main() {
   vec2 mouseDist = uInteraction - uv.xy;
   float dist = length(mouseDist);
   float influence = exp(-pow(dist / uRadius, 2.0));

   vec3 newPosition = position;
   newPosition.z -= influence * uStrength * (1.0 - distance(uv, vec2(0.5))); // Make it more noticeable at the center based on uv coordinates

   vec4 mvPosition = modelViewMatrix * vec4(newPosition, 1.0);
   gl_PointSize = uPointSize * (uResolution.y / 1080.0) / -mvPosition.z;
   gl_PointSize *= 1.0 - influence;
   gl_Position = projectionMatrix * mvPosition;

   // Varyings
   vUv = uv;
   vInfluence = influence;
}