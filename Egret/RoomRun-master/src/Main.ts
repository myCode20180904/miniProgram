//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////

class Main extends eui.UILayer {


    protected createChildren(): void {
        super.createChildren();
        GameConst.StageW = this.stage.stageWidth;
        GameConst.StageH = this.stage.stageHeight;
        console.info(GameConst.StageW,GameConst.StageH);
        
        egret.lifecycle.addLifecycleListener((context) => {
            // custom lifecycle plugin
        })
        egret.lifecycle.onPause = () => {
            egret.ticker.pause();
        }
        egret.lifecycle.onResume = () => {
            egret.ticker.resume();
        }
        //注入自定义的素材解析器
        let assetAdapter = new AssetAdapter();
        egret.registerImplementation("eui.IAssetAdapter", assetAdapter);
        egret.registerImplementation("eui.IThemeAdapter", new ThemeAdapter());
        this.runGame().catch(e => {
            console.log(e);
        })
    }

    private async runGame() {
        await this.loadResource()
        this.createGameScene();
        const result = await RES.getResAsync("description_json")
        await platform.login();
        const userInfo = await platform.getUserInfo();
        console.log(userInfo);
        await platform.ShowshareMenu();

        

    }

    private async loadResource() {
        try {
            const loadingView = new LoadingUI();
            this.stage.addChild(loadingView);
            await RES.loadConfig("resource/default.res.json", "resource/");
            await RES.getResByUrl("",() => {
                
            },this,RES.ResourceItem.TYPE_IMAGE);
            await this.loadTheme();
            await RES.loadGroup("preload", 0, loadingView);
            this.stage.removeChild(loadingView);
        }
        catch (e) {
            console.error(e);
        }
    }

    private loadTheme() {
        return new Promise((resolve, reject) => {
            // load skin theme configuration file, you can manually modify the file. And replace the default skin.
            //加载皮肤主题配置文件,可以手动修改这个文件。替换默认皮肤。
            let theme = new eui.Theme("resource/default.thm.json", this.stage);
            theme.addEventListener(eui.UIEvent.COMPLETE, () => {
                resolve();
            }, this);

        })
    }
    /**
     * 创建场景界面
     * Create scene interface
     */
    protected createGameScene(): void {

        this.addChild(new GameApp());


        //
        var canvas = document.querySelectorAll(".egret-player")[0]["egret-player"]["canvas"];
        // 获取上下文并初始化画布
        if(canvas){
            this.testGl(canvas);
        }
    }

    //gl test
    private testGl(canvas):void{
        var gl:WebGLRenderingContext = canvas.getContext("webgl");
        gl.viewport(0, 0, canvas.width, canvas.height);
        // 定义清除颜色
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        // 通过COLOR_BUFFER_BIT把颜色清除为gl.clearColor()定义的颜色
        gl.clear(gl.COLOR_BUFFER_BIT); 

        //　着色器源码
        var vertexSource = `
                // 声明一个属性变量 a
                attribute vec3 a;
                void main(){
                    // 顶点在作色器处理后的位置信息
                    gl_Position = vec4(a, 1.0);
                }    
        `;
        var fragmentSource = `
                // 精度限定符, 最小精度为float
                precision mediump float;
                void main(){
                    // 片段颜色
                    gl_FragColor = vec4(1.0, 1.0, 0, 1.0);
                }
        `;
        // 创建定点和片段着色器
        var vertexShader = gl.createShader(gl.VERTEX_SHADER);
        var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
        // 将着色器源码附加到着色器上
        gl.shaderSource(vertexShader, vertexSource);
        gl.shaderSource(fragmentShader, fragmentSource);
        // 编译着色器
        gl.compileShader(vertexShader);
        gl.compileShader(fragmentShader);

        // 创建一个程序对象
        var program = gl.createProgram();
        // 将编译好的着色器附加到程序对象上
        gl.attachShader(program,vertexShader);
        gl.attachShader(program,fragmentShader);
        // 链接程序对象
        gl.linkProgram(program);
        // WebGL引擎使用该程序对象
        gl.useProgram(program);


        // 创建一个WebGLBuffer缓冲对象
        var vertexBuffer = gl.createBuffer();
        // 将该缓冲对象绑定为当前的数组缓冲
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        // 缓冲数据
        var data = [
            0.0 ,  0.5 ,  0.0,
            -0.5 , -0.5 ,  0.0,
            0.5 , -0.5 ,  0.0
        ];
        // 将缓冲数据添加到当前的数组缓冲中
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);

        // 获取着色器源码中属性的引用
        var vertexAttribLocation = gl.getAttribLocation(program, "a"); 
        // 设置属性ａ接收gl.ARRAY_BUFFER的数据
        gl.vertexAttribPointer(vertexAttribLocation, 3, gl.FLOAT, false, 0, 0);
        // 设置通过顶点着色器将缓冲的输入数据转换为一系列顶点数组
        gl.enableVertexAttribArray(vertexAttribLocation);
        // 绘制缓冲数组
        gl.drawArrays(gl.TRIANGLES, 0, 3);

        // let image:HTMLImageElement  = <HTMLImageElement>document.getElementById('');

    }
}