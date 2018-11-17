
                function __extends(d, b) {
                    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
                        function __() {
                            this.constructor = d;
                        }
                    __.prototype = b.prototype;
                    d.prototype = new __();
                };
                window.generateEUI = {};
                generateEUI.paths = {};
                generateEUI.styles = undefined;
                generateEUI.skins = {};generateEUI.paths['resource/assets/exml/helloPage.exml'] = window.helloPage = (function (_super) {
	__extends(helloPage, _super);
	function helloPage() {
		_super.call(this);
		this.skinParts = ["bg","icon","hello","logo"];
		
		this.height = 1136;
		this.width = 640;
		this.elementsContent = [this.bg_i(),this.logo_i()];
	}
	var _proto = helloPage.prototype;

	_proto.bg_i = function () {
		var t = new eui.Image();
		this.bg = t;
		t.height = 1136;
		t.horizontalCenter = 0;
		t.source = "resource/assets/textures/sy_bg@2x.png";
		t.verticalCenter = 0;
		t.width = 640;
		return t;
	};
	_proto.logo_i = function () {
		var t = new eui.Group();
		this.logo = t;
		t.height = 1136;
		t.width = 640;
		t.x = 0;
		t.y = 0;
		t.elementsContent = [this.icon_i(),this.hello_i()];
		return t;
	};
	_proto.icon_i = function () {
		var t = new eui.Image();
		this.icon = t;
		t.height = 172;
		t.scaleX = 1;
		t.scaleY = 1;
		t.source = "resource/assets/egret_icon.png";
		t.width = 115;
		t.x = 262.5;
		t.y = 200;
		return t;
	};
	_proto.hello_i = function () {
		var t = new eui.Label();
		this.hello = t;
		t.scaleX = 1;
		t.scaleY = 1;
		t.text = "this is a label";
		t.x = 233;
		t.y = 128;
		return t;
	};
	return helloPage;
})(eui.Skin);