/**
 * SketchGroup : 스케치 컴포넌트 중 그룹을 대변
 * @type {Implementation Class}
 */
wedump.core.drawingEngine.sketch.SketchGroup = function() {
	// order에 들어갈 상수값
	this.FIRST = "FIRST";
	this.LAST = "LAST";

	this.strName; // 그룹명(식별자)
	this.order; // 그룹내에서 이 객체의 순번
	this.sketchAttributes = new Array(); // 스체키 컴포넌트 중 속성의 배열		
};

wedump.core.drawingEngine.sketch.SketchGroup.prototype = {
	/**
	 * (public)
	 * addSketchAttribute : 스케치 속성을 배열에 추가
	 * @param {SketchAttribute} 스케치 속성 객체
	 */
	addSketchAttribute : function(sketchAttribute) {
		this.sketchAttributes[this.sketchAttributes.length] = sketchAttribute;
	},

	/**
	 * (public)
	 * getInnerHtml : 그룹의 innerHTML을 반환
	 * @return {String} 그룹의 innerHTML 문자열
	 */
	getInnerHtml : function() {

	}
};