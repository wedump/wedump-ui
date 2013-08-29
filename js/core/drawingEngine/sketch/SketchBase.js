/**
 * SketchBase : 공통으로 사용되는 레이아웃 스케치를 제공
 * @type {Implementation Class}
 */
wedump.core.drawingEngine.sketch.SketchBase = function(strSketch, arrSketchObj) {	
	this.strSketch = strSketch; // 스케치 문자열
	this.arrSketchObj = arrSketchObj; // 스케치 문자열과 매칭되는 스케치 객체 배열
	this.arrSketchComp; // 스케치 컴포넌트 객체 배열

	this.draw();
};

wedump.core.drawingEngine.sketch.SketchBase.prototype = new wedump.core.drawingEngine.sketch.Sketch();

/**
 * (public)
 * sortAttribute : 셀렉터/속성/그룹/주석 구분
 * @param {String} 스케치 문자열 한줄
 * @return {Array} 스케치 컴포넌트 객체 배열
 */
wedump.core.drawingEngine.sketch.SketchBase.prototype.sortAttribute = function(strSketch) {

};

/**
 * (public)
 * sortSketchComponent : 속성, 그룹, 정렬을 알맞은 셀렉터에 분류작업
 * @param {Array} 스케치 컴포넌트 객체 배열
 * @return {Array} 스케치 컴포넌트 객체 배열
 */
wedump.core.drawingEngine.sketch.SketchBase.prototype.sortSketchComponent = function(arrSektchComp) {

};

/**
 * (public)
 * applyCss : 분류된 셀렉터에 알맞은 CSS를 적용
 * @param {Array} 스케치 컴포넌트 객체 배열
 * @return {Array} 스케치 컴포넌트 객체 배열
 */
wedump.core.drawingEngine.sketch.SketchBase.prototype.applyCss = function(arrSektchComp) {

};

/**
 * (public)
 * rerendering : 화면에 해당 순서대로 재배치
 * @param {Array} 스케치 컴포넌트 객체 배열
 */
wedump.core.drawingEngine.sketch.SketchBase.prototype.rerendering = function(arrSektchComp) {

};