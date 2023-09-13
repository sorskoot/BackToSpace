/* Flat Repeat Shader - Sorskoot */

#include "lib/Compatibility.frag"

#define FEATURE_TEXTURED
#define FEATURE_ALPHA_MASKED
#define FEATURE_VERTEX_COLORS
#define USE_BARYCENTRIC

#ifdef TEXTURED
#define USE_TEXTURE_COORDS
#endif
#ifdef VERTEX_COLORS
#define USE_COLOR
#endif

#include "lib/Uniforms.glsl"

#define USE_MATERIAL_ID
#include "lib/Inputs.frag"

#ifdef TEXTURED
#include "lib/Textures.frag"
#endif
#include "lib/Materials.frag"

struct Material {
    lowp vec4 color;
    lowp vec4 fillColor;
    lowp vec4 strokeColor;
    
#ifdef TEXTURED
    mediump uint flatTexture;
#endif
    

};

Material decodeMaterial(uint matIndex) {
    {{decoder}}
    return mat;
}
#define PI 3.14159265359

highp float rand( const in vec2 uv ) {
    const highp float a = 12.9898, b = 78.233, c = 43758.5453;
    highp float dt = dot( uv.xy, vec2( a, b ) ), sn = mod( dt, PI );
    return fract(sin(sn) * c);
}

vec3 dithering( vec3 color ) {
        float grid_position = rand( gl_FragCoord.xy );
        vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
        dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
        return color + dither_shift_RGB;
    }

float aastep (float threshold, float dist) {
  float afwidth = fwidth(dist) * 0.5;
  return smoothstep(threshold - afwidth, threshold + afwidth, dist);
}

float computeScreenSpaceWireframe (vec3 barycentric, float lineWidth) {
  vec3 dist = fwidth(barycentric);
  vec3 smoothed = smoothstep(dist * ((lineWidth * 0.5) - 0.5), dist * ((lineWidth * 0.5) + 0.5), barycentric);
  return 1.0 - min(min(smoothed.x, smoothed.y), smoothed.z);
}

vec4 getStyledWireframe (vec3 barycentric, float thickness, vec3 fill, vec3 stroke) {
  float d = min(min(barycentric.x, barycentric.y), barycentric.z);
  float positionAlong = max(barycentric.x, barycentric.y);
  if (barycentric.y < barycentric.x && barycentric.y < barycentric.z) {
    positionAlong = 1.0 - positionAlong;
  }
  float computedThickness = thickness;
  float edge = 1.0 - aastep(computedThickness, d);
  vec4 outColor = vec4(0.0);
  vec3 mainStroke = mix(fill, stroke, edge);
  outColor.a = 1.0;
  outColor.rgb = mainStroke;

  return outColor;
}

void main() {

#ifdef TEXTURED
    alphaMask(fragMaterialId, fragTextureCoords);
#endif


Material mat = decodeMaterial(fragMaterialId);
    
float thickness = 0.05;
vec3 fill = mat.fillColor.rgb;
vec3 stroke = mat.strokeColor.rgb;


  
   outColor = getStyledWireframe(fragBarycentric,thickness,fill,stroke);


}

