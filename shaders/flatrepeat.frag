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

#define USE_MATERIAL_ID
#include "lib/Inputs.frag"

#ifdef TEXTURED
#include "lib/Textures.frag"
#endif
#include "lib/Materials.frag"

struct Material {
    lowp vec4 color;
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

const float thickness = 0.05;
const vec3 fill = vec3(0.0, 0.0, 0.0);
const vec3 stroke = vec3(0.5, 0.5, 1.0);

vec4 getStyledWireframe (vec3 barycentric) {
  float d = min(min(barycentric.x, barycentric.y), barycentric.z);
  float positionAlong = max(barycentric.x, barycentric.y);
  if (barycentric.y < barycentric.x && barycentric.y < barycentric.z) {
    positionAlong = 1.0 - positionAlong;
  }
  float computedThickness = thickness;
  float edge = 1.0 - aastep(computedThickness, d);
  vec4 outColor = vec4(0.0);
//   if (seeThrough) {
//     outColor = vec4(stroke, edge);
//     if (insideAltColor && !gl_FrontFacing) {
//       outColor.rgb = fill;
//     }
//   } else {
    vec3 mainStroke = mix(fill, stroke, edge);
    outColor.a = 1.0;
   // if (dualStroke) {
    //   float inner = 1.0 - aastep(secondThickness, d);
    //   vec3 wireColor = mix(fill, stroke, abs(inner - edge));
    //   outColor.rgb = wireColor;
    // } else {
      outColor.rgb = mainStroke;
    //}
 // }

  return outColor;
}

void main() {

#ifdef TEXTURED
    alphaMask(fragMaterialId, fragTextureCoords);
#endif

//   Material mat = decodeMaterial(fragMaterialId);  
//   vec2 gradientX = dFdx(fragTextureCoords*100.0);
//   vec2 gradientY = dFdy(fragTextureCoords*100.0);

// // We take advantage of our knowledge that higher variation means we are likely on an edge.
//    float edgeFactorX = length(gradientX);
//    float edgeFactorY = length(gradientY);

//    // Use these factors to create a smooth step function between edges.
//    float edgeFactor = smoothstep(0.2, 1.0, max(edgeFactorX, edgeFactorY));

//     bool xOdd = (floor(mod(fragTextureCoords.x,2.0)) == 1.0);
//     bool yOdd = (floor(mod(fragTextureCoords.y,2.0)) == 1.0);
               
//     vec2 a = vec2(xOdd ? 0.25 : -0.25, yOdd ? -0.5  :  0.5 );
//     vec2 b = vec2(xOdd ? 0.5  : -0.5 , yOdd ?  0.25 : -0.25 );
//     vec2 c = a * vec2(-1);
//     vec2 d = b * vec2(-1);

//    vec4 frac = 
//     textureAtlas(mat.flatTexture, (fragTextureCoords+a)*100.0) / 4.0 +
//     textureAtlas(mat.flatTexture, (fragTextureCoords+b)*100.0) / 4.0 +
//     textureAtlas(mat.flatTexture, (fragTextureCoords+c)*100.0) / 4.0 +
//     textureAtlas(mat.flatTexture, (fragTextureCoords+d)*100.0) / 4.0;
   
   //vec2 roundedTexCoords = round(fragTextureCoords * 2.0) / 2.0;
   //vec4 frac2 = textureAtlas(mat.flatTexture, (roundedTexCoords)*100.0);
   
   
//outColor = vec4(d.x,d.y,0.0,1.0);
    
   outColor = getStyledWireframe(fragBarycentric);


}

