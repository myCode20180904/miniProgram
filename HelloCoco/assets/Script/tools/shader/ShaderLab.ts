const renderer = cc.renderer.renderEngine.renderer;
export const MVP = `
uniform mat4 viewProj;
attribute vec3 a_position;
attribute vec2 a_uv0;
varying vec2 uv0;
void main () {
    vec4 pos = viewProj * vec4(a_position, 1);
    gl_Position = pos;
    uv0 = a_uv0;
}`;

const ShaderLab = {
    GrayScaling: {
        vert: MVP,
        frag: 
        `
        uniform sampler2D texture;
        uniform vec4 color;
        varying vec2 uv0;
        void main () {
            vec4 c = color * texture2D(texture, uv0);
            float gray = dot(c.rgb, vec3(0.299 * 0.5, 0.587 * 0.5, 0.114 * 0.5));
            gl_FragColor = vec4(gray, gray, gray, c.a * 0.5);
        }
        `
    },
    Stone: {
        vert: MVP,
        frag: 
        `
        uniform sampler2D texture;
        uniform vec4 color;
        varying vec2 uv0;
        void main () {
            vec4 c = color * texture2D(texture, uv0);
            float clrbright = (c.r + c.g + c.b) * (1. / 3.);
            float gray = (0.6) * clrbright;
            gl_FragColor = vec4(gray, gray, gray, c.a);
        }
        `
    },
    Ice: {
        vert: MVP,
        frag: 
        `
        uniform sampler2D texture;
        uniform vec4 color;
        varying vec2 uv0;
        void main () {
            vec4 clrx = color * texture2D(texture, uv0);
            float brightness = (clrx.r + clrx.g + clrx.b) * (1. / 3.);
            float gray = (1.5)*brightness;
            clrx = vec4(gray, gray, gray, clrx.a)*vec4(0.8,1.2,1.5,1);
            gl_FragColor =clrx;
        }
        `
    },
    Frozen: {
        vert: MVP,
        frag: 
        `
        uniform sampler2D texture;
        uniform vec4 color;
        varying vec2 uv0;
        void main () {
            vec4 c = color * texture2D(texture, uv0);
            c *= vec4(0.8, 1, 0.8, 1);
            c.b += c.a * 0.2;
            gl_FragColor = c;
        }
        `
    },
    Mirror: {
        vert: MVP,
        frag: 
        `
        uniform sampler2D texture;
        uniform vec4 color;
        varying vec2 uv0;
        void main () {
            vec4 c = color * texture2D(texture, uv0);
            c.r *= 0.5;
            c.g *= 0.8;
            c.b += c.a * 0.2;
            gl_FragColor = c;
        }
        `
    },
    Poison: {
        vert: MVP,
        frag: 
        `
        uniform sampler2D texture;
        uniform vec4 color;
        varying vec2 uv0;
        void main () {
            vec4 c = color * texture2D(texture, uv0);
            c.r *= 0.8;
            c.r += 0.08 * c.a;
            c.g *= 0.8;
            c.g += 0.2 * c.a;
            c.b *= 0.8;
            gl_FragColor = c;
        }
        `
    },
    Banish: {
        vert: MVP,
        frag: 
        `
        uniform sampler2D texture;
        uniform vec4 color;
        varying vec2 uv0;
        void main () {
            vec4 c = color * texture2D(texture, uv0);
            float gg = (c.r + c.g + c.b) * (1.0 / 3.0);
            c.r = gg * 0.9;
            c.g = gg * 1.2;
            c.b = gg * 0.8;
            c.a *= (gg + 0.1);
            gl_FragColor = c;
        }
        `
    },
    Vanish: {
        vert: MVP,
        frag: 
        `
        uniform sampler2D texture;
        uniform vec4 color;
        varying vec2 uv0;
        void main () {
            vec4 c = color * texture2D(texture, uv0);
            float gray = (c.r + c.g + c.b) * (1. / 3.);
            float rgb = gray * 0.8;
            gl_FragColor = vec4(rgb, rgb, rgb, c.a * (gray + 0.1));
        }
        `
            },
            Invisible: {
                vert: MVP,
                frag: 
        `
        void main () {
            gl_FragColor = vec4(0,0,0,0);
        }
        `
    },
    Blur: {
        vert: MVP,
        frag: 
        `
        uniform sampler2D texture;
        uniform vec4 color;
        uniform float num;
        varying vec2 uv0;
        void main () {
            vec4 sum = vec4(0.0);
            vec2 size = vec2(num,num);
            sum += texture2D(texture, uv0 - 0.4 * size) * 0.05;
            sum += texture2D(texture, uv0 - 0.3 * size) * 0.09;
            sum += texture2D(texture, uv0 - 0.2 * size) * 0.12;
            sum += texture2D(texture, uv0 - 0.1 * size) * 0.15;
            sum += texture2D(texture, uv0             ) * 0.16;
            sum += texture2D(texture, uv0 + 0.1 * size) * 0.15;
            sum += texture2D(texture, uv0 + 0.2 * size) * 0.12;
            sum += texture2D(texture, uv0 + 0.3 * size) * 0.09;
            sum += texture2D(texture, uv0 + 0.4 * size) * 0.05;
            
            vec4 vectemp = vec4(0,0,0,0);
            vec4 substract = vec4(0,0,0,0);
            vectemp = (sum - substract) * color;

            float alpha = texture2D(texture, uv0).a;
            if(alpha < 0.05) { gl_FragColor = vec4(0 , 0 , 0 , 0); }
            else { gl_FragColor = vectemp; }
        }
        `
    },
    GaussBlur: {
        vert: MVP,
        frag: 
        `
        #define repeats 5.
        uniform sampler2D texture;
        uniform vec4 color;
        uniform float num;
        varying vec2 uv0;

        vec4 draw(vec2 uv) {
            return color * texture2D(texture,uv).rgba; 
        }
        float grid(float var, float size) {
            return floor(var*size)/size;
        }
        float rand(vec2 co){
            return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
        }
        void main()
        {
            vec4 blurred_image = vec4(0.);
            for (float i = 0.; i < repeats; i++) { 
                vec2 q = vec2(cos(degrees((i/repeats)*360.)),sin(degrees((i/repeats)*360.))) * (rand(vec2(i,uv0.x+uv0.y))+num); 
                vec2 uv2 = uv0+(q*num);
                blurred_image += draw(uv2)/2.;
                q = vec2(cos(degrees((i/repeats)*360.)),sin(degrees((i/repeats)*360.))) * (rand(vec2(i+2.,uv0.x+uv0.y+24.))+num); 
                uv2 = uv0+(q*num);
                blurred_image += draw(uv2)/2.;
            }
            blurred_image /= repeats;
            gl_FragColor = vec4(blurred_image);
        }
`
    },
    
    Fluxay: {
        vert: MVP,
        frag: 
        `
        uniform sampler2D texture;
        uniform vec4 color;
        uniform float time;
        varying vec2 uv0;

        void main()
        {
            vec4 src_color = color * texture2D(texture, uv0).rgba;

            float width = 0.08;       //流光的宽度范围 (调整该值改变流光的宽度)
            float start = tan(time/1.414);  //流光的起始x坐标
            float strength = 0.008;   //流光增亮强度   (调整该值改变流光的增亮强度)
            float offset = 0.5;      //偏移值         (调整该值改变流光的倾斜程度)
            if(uv0.x < (start - offset * uv0.y) &&  uv0.x > (start - offset * uv0.y - width))
            {
                vec3 improve = strength * vec3(255, 255, 255);
                vec3 result = improve * vec3( src_color.r, src_color.g, src_color.b);
                gl_FragColor = vec4(result, src_color.a);

            }else{
                gl_FragColor = src_color;
            }
        }
        `
    },
    FluxaySuper: {
        vert: MVP,
        frag: 
        `
        #define TAU 6.12
        #define MAX_ITER 5
        uniform sampler2D texture;
        uniform vec4 color;
        uniform float time;
        varying vec2 uv0;

        void main()
        {
            float time = time * .5+5.;
            // uv should be the 0-1 uv of texture...
            vec2 uv = uv0.xy;//fragCoord.xy / iResolution.xy;
            
            vec2 p = mod(uv*TAU, TAU)-250.0;

            vec2 i = vec2(p);
            float c = 1.0;
            float inten = .0045;

            for (int n = 0; n < MAX_ITER; n++) 
            {
                float t =  time * (1.0 - (3.5 / float(n+1)));
                i = p + vec2(cos(t - i.x) + sin(t + i.y), sin(t - i.y) + cos(1.5*t + i.x));
                c += 1.0/length(vec2(p.x / (cos(i.x+t)/inten),p.y / (cos(i.y+t)/inten)));
            }
            c /= float(MAX_ITER);
            c = 1.17-pow(c, 1.4);
            vec4 tex = texture2D(texture,uv);
            vec3 colour = vec3(pow(abs(c), 20.0));
            colour = clamp(colour + vec3(0.0, 0.0, .0), 0.0, tex.a);

            // 混合波光
            float alpha = c*tex[3];  
            tex[0] = tex[0] + colour[0]*alpha; 
            tex[1] = tex[1] + colour[1]*alpha; 
            tex[2] = tex[2] + colour[2]*alpha; 
            gl_FragColor = color * tex;
        }
        `
    },
    Streamer:{//流光
        init:function(material){
            material.uniform(
                'Angle',
                renderer.PARAM_FLOAT,
                45.0
            );
    
            material.uniform(
                'Interval',
                renderer.PARAM_FLOAT,
                2.0
            );
    
            material.uniform(
                'Speed',
                renderer.PARAM_FLOAT,
                2.0
            );
    
            material.uniform(
                'Wight',
                renderer.PARAM_FLOAT,
                0.2
            );
        },
        vert: MVP,
        frag:
        `
        precision lowp float;
        uniform sampler2D texture;
        varying mediump vec2 uv0;
        uniform lowp vec4 color;
        uniform float time;
        uniform float Angle;
        uniform float Interval;
        uniform float Speed;
        uniform float Wight;
        float flash(vec2 uv) {
            float radian = 0.0174444 * Angle;
            float x0 = fract(time / Interval) * Interval * Speed;
            float projection_x = uv.y / tan(radian);
            float xn = x0 - projection_x;
            float mid_luminous = xn;
            float rate = 1.0 - abs(uv.x - mid_luminous) / Wight;
            float brightness = max(rate, 0.0);
            return brightness;
        }
        void main() {
            vec4 tex = color * texture2D(texture, uv0);
            if (tex.w > 0.5) {
                float brightness = flash(uv0);
                gl_FragColor = tex + vec4(1.0, 1.0, 1.0, 1.0) * brightness;
            } else {
                gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
            }
        }
        `
    },
    HighLight:{//高光
        vert: MVP,
        frag:
        `
        uniform sampler2D texture;
        uniform vec4 color;
        uniform float time;
        varying vec2 uv0;
        void main()
        {
            float _time = time/1.0-float(int(time/1.0));
            if(_time>1.0){
                _time--;
            }
            vec4 src_color = color * texture2D(texture, uv0).rgba;
            float gray = dot(src_color.rgb, vec3(0.8, 0.9, 0.85));
            gl_FragColor = vec4(src_color.r+0.08+_time*0.08, src_color.g+0.08+_time*0.08, src_color.b+0.08+_time*0.08, src_color.a+0.015+_time*0.015);
            
        }
        `
    },
    Outline:{//外发光
        init:function(material){
            material.uniform('iResolution',renderer.PARAM_FLOAT2,cc.v2(0, 0));
        },
        vert: MVP,
        frag:
        `
        uniform sampler2D texture;
        varying vec2 uv0;
        uniform vec2 iResolution;
        uniform vec4 color;
        void main()
        {
            vec4 src_color = color * texture2D(texture, uv0).rgba;
            
            vec2 onePixel = vec2(1.0 / iResolution.x, 1.0 / iResolution.y);

            vec4 color = texture2D(texture, uv0.xy);
            vec4 colorRight = texture2D(texture, uv0.xy + vec2(0,onePixel.t));
            vec4 colorBottom = texture2D(texture, uv0.xy + vec2(onePixel.s,0));

            color.r = 3.0* sqrt( (color.r - colorRight.r) * (color.r - colorRight.r) + (color.r - colorBottom.r) * (color.r - colorBottom.r) );
            color.g = 3.0* sqrt( (color.g - colorRight.g) * (color.g - colorRight.g) + (color.g - colorBottom.g) * (color.g - colorBottom.g) );
            color.b = 3.0* sqrt( (color.b - colorRight.b) * (color.b - colorRight.b) + (color.b - colorBottom.b) * (color.b - colorBottom.b) );

            color.r >1.0 ? 1.0 : color.r;
            color.g >1.0 ? 1.0 : color.g;
            color.b >1.0 ? 1.0 : color.b;
            gl_FragColor = vec4(color.rgb, src_color.a);
        }
        `
    },
    OutGlow:{//外发光
        vert: MVP,
        frag:
        `
        uniform sampler2D texture;
        uniform lowp vec4 color;
        varying vec2 uv0;
        void main() {
            float _SampleRange = 7.0;
            vec2 _SampleInterval = vec2(1, 1);
            vec2 _TexSize = vec2(256, 256);
            float _Factor = 1.0;
            vec4 _Color = vec4(0, 1, 0, 1);
            int range = int(_SampleRange);
            float radiusX = _SampleInterval.x / _TexSize.x;
            float radiusY = _SampleInterval.y / _TexSize.y;
            float inner = 0.0;
            float outter = 0.0;
            int count = 0;
            for (int k = -7; k <= 7; ++k) {
                for (int j = -7; j <= 7; ++j) {
                    vec4 m = texture2D(texture, vec2(uv0.x + float(k) * radiusX, uv0.y + float(j) * radiusY));
                    outter += 1.0 - m.a;
                    inner += m.a;
                    count += 1;
                }
            }
            inner /= float(count);
            outter /= float(count);
            vec4 col = texture2D(texture, uv0) * color;
            float out_alpha = max(col.a, inner);
            col.rgb = col.rgb + (1.0 - col.a) * _Factor * _Color.a * _Color.rgb;
            col.a = out_alpha;
            gl_FragColor = col;
        }
        `
    },
    InnerGlow:{//内发光
        vert: MVP,
        frag:
        `
        uniform sampler2D texture;
        uniform lowp vec4 color;
        varying vec2 uv0;
        void main() {
            float _SampleRange = 7.0;
            vec2 _SampleInterval = vec2(1, 1);
            vec2 _TexSize = vec2(256, 256);
            float _Factor = 1.0;
            vec4 _Color = vec4(0, 1, 0, 1);
            int range = int(_SampleRange);
            float radiusX = _SampleInterval.x / _TexSize.x;
            float radiusY = _SampleInterval.y / _TexSize.y;
            float inner = 0.0;
            float outter = 0.0;
            int count = 0;
            for (int k = -7; k <= 7; ++k) {
                for (int j = -7; j <= 7; ++j) {
                    vec4 m = texture2D(texture, vec2(uv0.x + float(k) * radiusX, uv0.y + float(j) * radiusY));
                    outter += 1.0 - m.a;
                    inner += m.a;
                    count += 1;
                }
            }
            inner /= float(count);
            outter /= float(count);
            vec4 col = texture2D(texture, uv0) * color;
            float out_alpha = max(col.a, inner);
            float in_alpha = min(out_alpha, outter);

            col.rgb = col.rgb + in_alpha * _Factor * _Color.a * _Color.rgb;
            gl_FragColor = col;
        }
        `
    },
    RainDot:{//
        vert: MVP,
        frag:
        `

        uniform sampler2D texture;
        uniform vec4 color;
        uniform float time;
        varying vec2 uv0;

        void main()
        {
            vec4 coord = gl_FragCoord;
            gl_FragColor = vec4(coord.x/800.0,coord.y/600.0, 0.0, 1.0);
        }
        `
    },
    Mosaic:{//马赛克
        vert: MVP,
        frag:
        `
        precision highp float;
        uniform sampler2D texture;
        uniform lowp vec4 color;
        varying vec2 uv0;
        void main() {
            float imageWidth = 512.0;
            float imageHeight = 512.0;
            float mosaicSize = 16.0;
            vec2 texSize = vec2(imageWidth, imageHeight);
            // 计算实际图像位置
            vec2 xy = vec2(uv0.x * texSize.x, uv0.y * texSize.y);
            // 计算某一个小mosaic的中心坐标
            vec2 mosaicCenter = vec2(floor(xy.x / mosaicSize) * mosaicSize + 0.5 * mosaicSize,
                floor(xy.y / mosaicSize) * mosaicSize + 0.5 * mosaicSize);
            // 计算距离中心的长度
            vec2 delXY = mosaicCenter - xy;
            float delLength = length(delXY);
            // 换算回纹理坐标系
            vec2 uvMosaic = vec2(mosaicCenter.x / texSize.x, mosaicCenter.y / texSize.y);

            if (delLength < 0.5 * mosaicSize) {
                gl_FragColor = texture2D(texture, uvMosaic);
            } else {
                gl_FragColor = texture2D(texture, uv0);
            }
        }
        `
    },
    Pixel:{//像素化
        vert: MVP,
        frag:
        `
        precision lowp float;
        uniform sampler2D texture;
        uniform lowp vec4 color;
        varying vec2 uv0;
        void main() {     
            float effectFactor = 0.85;
            vec2 pixelSize = (1.0 - effectFactor * 0.95) * vec2(512, 512);
            // float u = round(uv0.x * pixelSize.x) / pixelSize.x;
            // float v = round(uv0.y * pixelSize.y) / pixelSize.y;
            float u = step(0.5, fract(uv0.x * pixelSize.x)) + floor(uv0.x * pixelSize.x);
            float v = step(0.5, fract(uv0.y * pixelSize.y)) + floor(uv0.y * pixelSize.y);
            vec2 uv = vec2(u, v) / pixelSize;
            vec4 c = texture2D(texture, uv);
            c.a *= color.a;
            gl_FragColor = c;
        }
        `
    },
    Shutter:{//百叶窗
        vert: MVP,
        frag:
        `
        uniform sampler2D texture;
        uniform lowp vec4 color;
        varying vec2 uv0;
        uniform float time;
        void main() {
            vec2 _TexSize = vec2(512, 512);
            float _FenceWidth = 30.0;
            float _AnimTime = 1.0;
            float _DelayTime = 0.2;
            float _LoopInterval = 3.0;
            float looptimes = floor(time / _LoopInterval);
            float starttime = looptimes * _LoopInterval; // 本次动画开始时间
            float passtime = time - starttime; //本次动画流逝时间
            if (passtime <= _DelayTime) {
                if (int(mod(looptimes, 2.0)) == 0) {
                    gl_FragColor = vec4(0, 0, 0, 0);
                }else {
                    gl_FragColor = texture2D(texture, uv0);
                }
            }else {
                float progress = (passtime - _DelayTime) / _AnimTime; //底部右边界
                float fence_rate = mod(uv0.x * _TexSize.x, _FenceWidth) / _FenceWidth;
                if (progress < fence_rate) {
                    gl_FragColor = vec4(0, 0, 0, 0);
                } else {
                    gl_FragColor = texture2D(texture, uv0);
                }
            }
        }
        `
    },

    SimpleMovingGrass:{//摇摆Grass
        vert: MVP,
        frag:
        `
        uniform sampler2D texture;
        uniform lowp vec4 color;
        varying vec2 uv0;
        const float speed = 2.0;
        const float bendFactor = 0.2;
        uniform float time;
        void main() {
            float height = 1.0 - uv0.y;
            float offset = pow(height, 2.5);
            offset *= (sin(time * speed) * bendFactor);
            gl_FragColor = texture2D(texture, fract(vec2(uv0.x + offset, uv0.y)));
        }
        `
    },
    
    Emboss:{
        vert: MVP,
        frag:
        `
        uniform sampler2D texture;
        uniform lowp vec4 color;
        varying vec2 uv0;
        uniform float u_time;
        void main() {
            vec2 onePixel = vec2(1.0 / 480.0, 1.0 / 320.0);
            vec4 c = vec4(0.5, 0.5, 0.5, 0.0);
            c -= texture2D(texture, uv0 - onePixel) * 5.0;
            c += texture2D(texture, uv0 + onePixel) * 5.0;
            c.rgb = vec3((c.r + c.g + c.b) / 3.0);
            gl_FragColor = vec4(c.rgb, texture2D(texture, uv0).a);
        }
        `
    },

    Transfer:{
        vert: MVP,
        frag:
        `
        #ifdef GL_ES
        precision lowp float;
        #endif
        
        uniform float time;
        uniform sampler2D texture;
        uniform lowp vec4 color;
        varying vec2 uv0;
        void main()
        {
            vec4 c = color * texture2D(texture, uv0);
            gl_FragColor = c;

            float temp = uv0.x - time;
            if (temp <= 0.0) {
                float temp2 = abs(temp);
                if (temp2 <= 0.2) {
                    gl_FragColor.w = 1.0 - temp2/0.2;
                } else {
                    gl_FragColor.w = 0.0;
                }
            } else {
                gl_FragColor.w = 1.0;
            }
        }
        `
    },

    LightRun:{
        init:function(material){
            material.uniform('iResolution',renderer.PARAM_FLOAT2,cc.v2(material._texture.width, material._texture.height));
        },
        vert: MVP,
        frag:
        `
        
        #ifdef GL_ES
        precision mediump float;
        #endif

        #define PI  3.1415926535

        uniform sampler2D texture;
        uniform float time;
        uniform vec2 iResolution;
        varying vec2 uv0;
        uniform lowp vec4 color;

        void main( void ) {
            vec4 src_c = color * texture2D(texture, uv0);

            // 换成iResolution
            vec2 rs = iResolution.xy;
            vec2 uv= uv0.xy;
            // 换成纹理坐标uv0.xy
            // vec2 p=(gl_FragCoord.xy -.5 * iResolution.xy)/ min(iResolution.x,iResolution.y);
            vec2 p=(uv * rs - .5 * rs) /  min(iResolution.x,iResolution.y);

            vec3 c = vec3(0);
            
            for(int i = 0; i < 10; i++){
                float f=2.* PI * float(i) / 20. ;
                float t =  mod(time,1.0/( 1.0*9.0 /20.0));
                //float x = cos(t) * sin(t);
                float x = -cos(t*f);
                float y = -sin(t*f);
                vec2 o = 0.4 * vec2(x,y);
                    
                float r = fract(t*f);
                float g = 1.-r;
                float b = 1.-r;
                c += 0.005/(length(p-o))*vec3(r,g,1);
            }
            gl_FragColor = vec4(c,texture2D(texture, uv0).a);
        }
        `
    },

    

};

export default ShaderLab;
