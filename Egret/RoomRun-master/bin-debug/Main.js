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
var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var Main = (function (_super) {
    __extends(Main, _super);
    function Main() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Main.prototype.createChildren = function () {
        _super.prototype.createChildren.call(this);
        GameConst.StageW = this.stage.stageWidth;
        GameConst.StageH = this.stage.stageHeight;
        console.info(GameConst.StageW, GameConst.StageH);
        egret.lifecycle.addLifecycleListener(function (context) {
            // custom lifecycle plugin
        });
        egret.lifecycle.onPause = function () {
            egret.ticker.pause();
        };
        egret.lifecycle.onResume = function () {
            egret.ticker.resume();
        };
        //注入自定义的素材解析器
        var assetAdapter = new AssetAdapter();
        egret.registerImplementation("eui.IAssetAdapter", assetAdapter);
        egret.registerImplementation("eui.IThemeAdapter", new ThemeAdapter());
        this.runGame().catch(function (e) {
            console.log(e);
        });
    };
    Main.prototype.runGame = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result, userInfo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.loadResource()];
                    case 1:
                        _a.sent();
                        this.createGameScene();
                        return [4 /*yield*/, RES.getResAsync("description_json")];
                    case 2:
                        result = _a.sent();
                        return [4 /*yield*/, platform.login()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, platform.getUserInfo()];
                    case 4:
                        userInfo = _a.sent();
                        console.log(userInfo);
                        return [4 /*yield*/, platform.ShowshareMenu()];
                    case 5:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Main.prototype.loadResource = function () {
        return __awaiter(this, void 0, void 0, function () {
            var loadingView, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        loadingView = new LoadingUI();
                        this.stage.addChild(loadingView);
                        return [4 /*yield*/, RES.loadConfig("resource/default.res.json", "resource/")];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, RES.getResByUrl("", function () {
                            }, this, RES.ResourceItem.TYPE_IMAGE)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.loadTheme()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, RES.loadGroup("preload", 0, loadingView)];
                    case 4:
                        _a.sent();
                        this.stage.removeChild(loadingView);
                        return [3 /*break*/, 6];
                    case 5:
                        e_1 = _a.sent();
                        console.error(e_1);
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    Main.prototype.loadTheme = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            // load skin theme configuration file, you can manually modify the file. And replace the default skin.
            //加载皮肤主题配置文件,可以手动修改这个文件。替换默认皮肤。
            var theme = new eui.Theme("resource/default.thm.json", _this.stage);
            theme.addEventListener(eui.UIEvent.COMPLETE, function () {
                resolve();
            }, _this);
        });
    };
    /**
     * 创建场景界面
     * Create scene interface
     */
    Main.prototype.createGameScene = function () {
        this.addChild(new GameApp());
        // //
        // var canvas = document.querySelectorAll(".egret-player")[0]["egret-player"]["canvas"];
        // // 获取上下文并初始化画布
        // if(canvas){
        //     this.testGl(canvas);
        // }
    };
    //gl test
    Main.prototype.testGl = function (canvas) {
        var gl = canvas.getContext("webgl");
        gl.viewport(0, 0, canvas.width, canvas.height);
        // 定义清除颜色
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        // 通过COLOR_BUFFER_BIT把颜色清除为gl.clearColor()定义的颜色
        gl.clear(gl.COLOR_BUFFER_BIT);
        //　着色器源码
        var vertexSource = "\n                // \u58F0\u660E\u4E00\u4E2A\u5C5E\u6027\u53D8\u91CF a\n                attribute vec3 a;\n                void main(){\n                    // \u9876\u70B9\u5728\u4F5C\u8272\u5668\u5904\u7406\u540E\u7684\u4F4D\u7F6E\u4FE1\u606F\n                    gl_Position = vec4(a, 1.0);\n                }    \n        ";
        var fragmentSource = "\n                // \u7CBE\u5EA6\u9650\u5B9A\u7B26, \u6700\u5C0F\u7CBE\u5EA6\u4E3Afloat\n                precision mediump float;\n                void main(){\n                    // \u7247\u6BB5\u989C\u8272\n                    gl_FragColor = vec4(1.0, 1.0, 0, 1.0);\n                }\n        ";
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
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
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
            0.0, 0.5, 0.0,
            -0.5, -0.5, 0.0,
            0.5, -0.5, 0.0
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
    };
    return Main;
}(eui.UILayer));
__reflect(Main.prototype, "Main");
//# sourceMappingURL=Main.js.map