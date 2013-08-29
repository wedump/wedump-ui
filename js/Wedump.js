/**
 * SketchBase : 공통으로 사용되는 레이아웃 스케치를 제공
 * @type {Implementation Class}
 */
wedump.core.Wedump = function() {
	this.parser;
	this.sketch;
	this.detailControl = new wedump.core.drawingEngine.detail.DetailControl();
};

wedump.core.Wedump.prototype = {

	/**
	 * (public)
	 * load : 컴포넌트 및 객체 초기화
	 */
	load : function() {

	},

	/**
	 * (public)
	 * sketch : 레이아웃 스케치
	 * @param {String} 스케치 문자열(option)
	 * @param {Array} 스케치 문자열과 매칭되는 스케치 객체배열(option)
	 * @return {String or Sketch} 스케치 문자열 or 스케치 객체
	 */
	sketch : function() {
		var arg = arguments;

		switch (arg.length) {
			case 0: // 파라미터가 0개일 때, 스케치 문자열 반환
				if (typeof this.sketch == "undefined") {
					return "";
				} else {
					return this.sketch.strSketch;
				}
				break;
			case 1: // 파라미터가 1개 이상일 때, 스케치 객체를 생성하여 드로잉하고 스케치 객체 반환
				this.sketch = new wedump.core.drawingEngine.sketch.SketchBase(arg[0]);
				return this.sketch;				
			case 2:
				this.sketch = new wedump.core.drawingEngine.sketch.SketchBase(arg[0], arg[1]);
				return this.sketch;				
			default:
				throw new TypeError("undefined is not a function");
		}
	},

	/**
	 * (public)
	 * up : 해당 엘리먼트를 위로 이동
	 */
	up : function(selector, unit) {
		this.detailControl.up(selector, unit);
	},

	/**
	 * (public)
	 * down : 해당 엘리먼트를 아래로 이동
	 */
	down : function(selector, unit) {
		this.detailControl.down(selector, unit);
	},

	/**
	 * (public)
	 * left : 해당 엘리먼트를 왼쪽으로 이동
	 */
	left : function(selector, unit) {
		this.detailControl.left(selector, unit);
	},

	/**
	 * (public)
	 * right : 해당 엘리먼트를 오른쪽으로 이동
	 */
	right : function(selector, unit) {
		this.detailControl.right(selector, unit);
	}
};

var Wedump = new wedump.core.Wedump();