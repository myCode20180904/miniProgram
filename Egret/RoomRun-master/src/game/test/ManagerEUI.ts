class ManagerEUI {



	//eui 列表
	private layoutList:Array<eui.Component>;
	//ui根节点
	private rootNode:egret.Sprite;

	public constructor(stage:egret.Stage) {
		this.rootNode = new egret.Sprite();
		stage.addChildAt(this.rootNode,0);

		this.layoutList = new Array();
	}

	/**
	 * !获取根节点
	 * !@return rootNode
	 */
	public getRootNode(){
		return this.rootNode;
	}

	/**
	 * !添加eui
	 * !@param ui 添加的界面
	 * !@param zoder 层级(zoder>=0;替换zoder位置ui;zoder超出layoutList范围则push ui)
	 */
	public addChild(ui:eui.Component,zoder?:number){
		if(zoder&&zoder<this.layoutList.length){
			this.layoutList.splice(zoder,1,ui);
			this.rootNode.addChildAt(ui,zoder);
		}else{
			this.layoutList.push(ui);
			this.rootNode.addChild(ui);
		}

	}
	/**
	 * !移除ui
	 * @param ui 界面
	 */
	public removeChild(ui:eui.Component){
		let index:number = this.layoutList.indexOf(ui);
		if(index>=0){
			this.layoutList.splice(index,1);
			this.rootNode.removeChild(ui);
		}else{
			console.info("not exit at ManagerEUI:",ui);
		}
	}

	/**
	 * !removeAll
	 */
	public removeAll(){
		this.layoutList.splice(0,this.layoutList.length);
		this.rootNode.removeChildren();
	}


}