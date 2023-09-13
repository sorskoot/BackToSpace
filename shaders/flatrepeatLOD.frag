#include "lib/Compatibility.frag"

#define FEATURE_TEXTURED
#define FEATURE_ALPHA_MASKED
#define FEATURE_VERTEX_COLORS

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
#ifdef TEXTURED
    mediump uint flatTexture;
    mediump uint flatTextureLow;
    mediump uint flatTextureLowest;
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

float fogFactorExp2(float dist, float density) {
    const float LOG2 = -1.442695;
    float d = density * dist;
    return 1.0 - clamp(exp2(d*d*LOG2), 0.0, 1.0);
}

void main() {

#ifdef TEXTURED
    alphaMask(fragMaterialId, fragTextureCoords);
#endif

   Material mat = decodeMaterial(fragMaterialId);  
   
    float dist = gl_FragCoord.z/gl_FragCoord.w;
    float fogFactor = fogFactorExp2(dist, 0.05);
    vec4 t1 =textureAtlas(mat.flatTexture, (fragTextureCoords*48.0)); 
    vec4 t2 =textureAtlas(mat.flatTextureLow, (fragTextureCoords*48.0));
    vec4 t3 =textureAtlas(mat.flatTextureLowest, (fragTextureCoords*48.0));

    
    float t1Threshold = 0.2; // change this to your desired threshold
    float t2Threshold = 0.5; // change this to your desired threshold
    float t3Threshold = 0.99; // change this to your desired threshold

    vec4 theColor;

    if(fogFactor <= t1Threshold) {
        theColor = t1;
    } else if(fogFactor > t1Threshold && fogFactor <= t2Threshold) {
        float normalizedFogFactor = (fogFactor - t1Threshold) / (t2Threshold - t1Threshold); 
        theColor = mix(t1, t2, normalizedFogFactor);
    } else if(fogFactor > t2Threshold && fogFactor < t3Threshold) {
        float normalizedFogFactor = (fogFactor - t2Threshold) / (t3Threshold - t2Threshold); 
        theColor = mix(t2, t3, normalizedFogFactor);
    } else { // fog factor is >= than the last threshold
        theColor = t3;
    }
    
  outColor = theColor;
    
  


}

