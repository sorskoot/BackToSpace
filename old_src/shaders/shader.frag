varying vec3 vBarycentric;
varying float vEven;
varying vec2 vUv;
varying vec3 vPosition;

uniform float time;
uniform float thickness;
uniform float secondThickness;

uniform float dashRepeats;
uniform float dashLength;
uniform bool dashOverlap;
uniform bool dashEnabled;
uniform bool dashAnimate;

uniform bool seeThrough;
uniform bool insideAltColor;
uniform bool dualStroke;
uniform bool noiseA;
uniform bool noiseB;

uniform bool squeeze;
uniform float squeezeMin;
uniform float squeezeMax;

uniform vec3 stroke;
uniform vec3 fill;

float aastep (float threshold, float dist) {
  float afwidth = fwidth(dist) * 0.5;
  return smoothstep(threshold - afwidth, threshold + afwidth, dist);
}

float computeScreenSpaceWireframe (vec3 barycentric, float lineWidth) {
  vec3 dist = fwidth(barycentric);
  vec3 smoothed = smoothstep(dist * ((lineWidth * 0.5) - 0.5), dist * ((lineWidth * 0.5) + 0.5), barycentric);
  return 1.0 - min(min(smoothed.x, smoothed.y), smoothed.z);
}
vec4 getStyledWireframe (vec3 barycentric) {
  float d = min(min(barycentric.x, barycentric.y), barycentric.z);
  float positionAlong = max(barycentric.x, barycentric.y);
  if (barycentric.y < barycentric.x && barycentric.y < barycentric.z) {
    positionAlong = 1.0 - positionAlong;
  }
  float computedThickness = thickness;
  float edge = 1.0 - aastep(computedThickness, d);
  vec4 outColor = vec4(0.0);
  if (seeThrough) {
    outColor = vec4(stroke, edge);
    if (insideAltColor && !gl_FrontFacing) {
      outColor.rgb = fill;
    }
  } else {
    vec3 mainStroke = mix(fill, stroke, edge);
    outColor.a = 1.0;
    if (dualStroke) {
      float inner = 1.0 - aastep(secondThickness, d);
      vec3 wireColor = mix(fill, stroke, abs(inner - edge));
      outColor.rgb = wireColor;
    } else {
      outColor.rgb = mainStroke;
    }
  }

  return outColor;
}

void main () {
  gl_FragColor = getStyledWireframe(vBarycentric);
}
