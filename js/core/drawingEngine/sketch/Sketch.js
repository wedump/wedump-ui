/**
 * Sketch : 화면 스케치의 알고리즘 인터페이스를 제공
 * @type {Abstract Class}
 */
wedump.core.drawingEngine.sketch.Sketch = function(strSketch, arrSketchObj, component) {	
	this.strSketch = strSketch; // 스케치 문자열
	this.arrSketchObj = arrSketchObj; // 스케치 문자열과 매칭되는 스케치 객체 배열
	this.component = component; // 컴포넌트 객체
	this.arrSketchComp; // 스케치 컴포넌트 객체 배열
};

wedump.core.drawingEngine.sketch.Sketch.prototype = {
	/**
	 * (public)
	 * draw : 스케치의 템플릿 메소드(알고리즘 골격)	 	 
	 */
	draw : function() {		
		this.arrSketchComp = this.sortAttribute(this.strSketch);
		this.arrSketchComp = this.sortSketchComponent(this.arrSketchComp);
		this.arrSketchComp = this.applyCss(this.arrSketchComp);
		this.arrSketchComp = this.rerendering(this.arrSketchComp);
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
	 * sortSketchComponent : 속성, 그룹, 정렬을 알맞은 셀렉터에 분류작업
	 * @param {Array} 스케치 컴포넌트 객체 배열
	 * @return {Array} 스케치 컴포넌트 객체 배열
	 */
	sortSketchComponent : function(arrSektchComp) {
		throw new Error("must override sortSketchComponent method");	
	},

	/**
	 * (public)
	 * applyCss : 분류된 셀렉터에 알맞은 CSS를 적용
	 * @param {Array} 스케치 컴포넌트 객체 배열
	 * @return {Array} 스케치 컴포넌트 객체 배열
	 */
	applyCss : function(arrSektchComp) {
		throw new Error("must override getCss method");	
	},

	/**
	 * (public)
	 * rerendering : 화면에 해당 순서대로 재배치
	 * @param {Array} 스케치 컴포넌트 객체 배열
	 * @return {Array} 스케치 컴포넌트 객체 배열
	 */
	rerendering : function(arrSektchComp) {
		throw new Error("must override rerendering method");	
	}
};