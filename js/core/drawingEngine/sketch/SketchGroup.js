/**
 * SketchGroup : 스케치 컴포넌트 중 그룹을 대변
 * @type {Implementation Class}
 */
wedump.core.drawingEngine.sketch.SketchGroup = function() {
	this.strName; // 문자열 셀렉터
	this.order; // 셀렉터의 그룹
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