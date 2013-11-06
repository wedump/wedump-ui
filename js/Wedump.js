/**
 * SketchBase : 공통으로 사용되는 레이아웃 스케치를 제공
 * @type {Implementation Class}
 */
wedump.core.Wedump = function() {
	this.parser;
	this.arrSketch = new Array();
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
				var arrStrSketch = new Array();

				for (var i = 0; i < this.arrSketch.length; i++) {
					arrStrSketch[arrStrSketch.length] = this.arrSketch[i].strSketch;
				}

				return arrStrSketch;
			case 1: // 파라미터가 1개 이상일 때, 스케치 객체를 생성하여 드로잉하고 스케치 객체 반환			
				this.arrSketch[this.arrSketch.length] = new wedump.core.drawingEngine.sketch.SketchBase(arg[0]);
				break;
			case 2:
				this.arrSketch[this.arrSketch.length] = new wedump.core.drawingEngine.sketch.SketchBase(arg[0], arg[1]);
				break;
			default:
				throw new TypeError("undefined is not a function");
		}

		var sketchComp = this.arrSketch[this.arrSketch.length - 1];

		// 화면 리사이즈 시 넓이배분을 다시 하기 위해 이벤트 설정
		jQuery(window).on("resize", function(e) {			
			sketchComp.draw();
			sketchComp.draw(); // 1회 draw 이 후 width를 파악해 컴포넌트들의 width를 재정의하기 위해 1번 더 실행
		}).trigger("resize");
		
		return sketchComp;
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