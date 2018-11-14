class gltest {
	private canvas:HTMLCanvasElement;
	/**
	 * WebGL :WebGLRenderingContext
	 */
	private gl:WebGLRenderingContext = null;


	public constructor(canvas) {
		this.canvas = canvas;
		this.initWebGL(canvas);
	}

	/**
	 * initWebGL 初始webgl
	 * !@param canvas 
	 */
	private initWebGL(canvas:HTMLCanvasElement){
		let msg = "";
		try {
			this.gl = canvas.getContext("webgl");
		} catch (error) {
			msg = "Error creating WebGL Context!: " + error.toString();
			
		}
		
		if (!this.gl){
			alert(msg);
			throw new Error(msg);
		}
	}

	/**
	 * initViewport
	 */
	private initViewport(){
		this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
	}

	/**
	 * initMatrices 初始化投影矩阵和模型 - 视图矩阵
	 */
	private projectionMatrix; private modelViewMatrix;
	private initMatrices()
	{
		// 创建一个模型-视图矩阵，包含一个位于(0, 0, -3.333)的相机
		
		this.modelViewMatrix = mat4.create();
		mat4.translate(modelViewMatrix, modelViewMatrix, [0, 0, -3.333]);

		// 创建一个45度角视野的投影矩阵
		projectionMatrix = mat4.create();
		mat4.perspective(projectionMatrix, Math.PI / 4,
			canvas.width / canvas.height, 1, 10000);
	}

	/**
	 * createSquare 构建用于绘制的正方形顶点数据
	 */
	private createSquare() {
		var vertexBuffer = this.gl.createBuffer();
		//将该缓冲对象绑定为当前的数组缓冲
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertexBuffer);
		var verts = [
			.5,  .5,  0.0,
			-.5,  .5,  0.0,
			.5, -.5,  0.0,
			-.5, -.5,  0.0
		];
		//将缓冲数据添加到当前的数组缓冲中
		this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(verts), this.gl.STATIC_DRAW);
		var square = {buffer:vertexBuffer, vertSize:3, nVerts:4,
			primtype:this.gl.TRIANGLE_STRIP};
		return square;
	}

	
}