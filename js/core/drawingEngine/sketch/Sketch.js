/**
 * Sketch : 화면 스케치의 알고리즘 인터페이스를 제공
 * @type {Abstract Class}
 */
wedump.core.drawingEngine.sketch.Sketch = function(strSketch, arrSketchObj, component) {
	this.strSketch = strSketch; // 스케치 문자열
	this.arrSketchObj = arrSketchObj; // 스케치 문자열과 매칭되는 스케치 객체 배열
	this.component = component; // 컴포넌트 객체
	this.arrSketchComp = new Array(); // 스케치 컴포넌트 객체 배열
	this.originInnerHtml = new Array(); // 원래의 InnerHTML 배열
};

wedump.core.drawingEngine.sketch.Sketch.prototype = {
	/**
	 * (public)
	 * draw : 스케치의 템플릿 메소드(알고리즘 골격)	 	 
	 */	
	draw : function() {
		// 알고리즘 골격 함수 정의
		var sketch = this;
		var algoFuntion = function(arrStrSketch, target) {
			sketch.originInnerHtml[sketch.originInnerHtml.length] = {
				"target"	: target,
				"innerHtml" : jQuery(target).html()
			};

			var lineSketchComp;

			for (var i = 0; i < arrStrSketch.length; i++) {				
				lineSketchComp = sketch.sortAttribute(arrStrSketch[i]);
				lineSketchComp = sketch.sortSketchComponent(lineSketchComp);
				lineSketchComp = sketch.applyCssPattern(lineSketchComp);
				lineSketchComp = sketch.divisionWidth(lineSketchComp);

				sketch.arrSketchComp[i] = lineSketchComp;
			}			

			sketch.arrSketchComp = sketch.rerendering(sketch.arrSketchComp, target);
		};

		this.undo();

		// 파라미터 종류에 따른 처리
		if (typeof this.strSketch == "string") { // 문자열일 때			
			algoFuntion(this.strSketch.split("\n"), "body");

		} else if (typeof this.strSketch == "object") { // JSON일 때
			for (var key in this.strSketch) {
				var value = this.strSketch[key];

				algoFuntion(value.split("\n"), key);
			}
		}
	},	

	/**
	 * (public)
	 * sortAttribute : 셀렉터/속성/그룹/주석 구분
	 * @param {String} 스케치 문자열 한줄
	 * @return {Array} 스케치 컴포넌트 객체 배열
	 */
	sortAttribute : function(strSketch) {
		throw new Error("must override sortAttribute method");	
	},

	/**
	 * (public)
	 * sortSketchComponent : 속성, 그룹을 알맞은 셀렉터에 분류
	 * @param {Array} 스케치 컴포넌트 객체 배열
	 * @return {Array} 스케치 컴포넌트 객체 배열
	 */
	sortSketchComponent : function(arrSektchComp) {
		throw new Error("must override sortSketchComponent method");	
	},

	/**
	 * (public)
	 * applyCss : 분류된 속성에 알맞은 CSS패턴을 적용
	 * @param {Array} 스케치 컴포넌트 객체 배열
	 * @return {Array} 스케치 컴포넌트 객체 배열
	 */
	applyCssPattern : function(arrSektchComp) {
		throw new Error("must override applyCssPattern method");	
	},

	/**
	 * (public)
	 * divisionWidth : 각 셀렉터들에 알맞은 넓이를 분배
	 * @param {Array} 스케치 컴포넌트 객체 배열 
	 * @return {Array} 스케치 컴포넌트 객체 배열
	 */
	divisionWidth : function(arrSektchComp) {
		throw new Error("must override divisionWidth method");	
	},

	/**
	 * (public)
	 * rerendering : 화면에 해당 순서대로 재배치
	 * @param {Array} 스케치 컴포넌트 객체 배열
	 * @param {String} 재렌더링 될 영역 셀렉터
	 * @return {Array} 스케치 컴포넌트 객체 배열
	 */
	rerendering : function(arrSektchComp, target) {
		throw new Error("must override rerendering method");
	},

	/**
	 * (public)
	 * undo : 타겟의 스케치를 하기 전 모습으로 복구	 	 
	 */
	undo : function() {
		for (var i = 0; i < this.originInnerHtml.length; i++) {
			var target = this.originInnerHtml[i].target;
			var innerHtml = this.originInnerHtml[i].innerHtml;

			jQuery(target).html(innerHtml);
		}
	}
};