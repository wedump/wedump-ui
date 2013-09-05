/**
 * SketchBase : 공통으로 사용되는 레이아웃 스케치를 제공
 * @type {Implementation Class}
 */
wedump.core.drawingEngine.sketch.SketchBase = function(strSketch, arrSketchObj) {	
	this.strSketch = strSketch; // 스케치 문자열
	this.arrSketchObj = arrSketchObj; // 스케치 문자열과 매칭되는 스케치 객체 배열
	this.arrSketchComp = new Array(); // 스케치 컴포넌트 객체 배열

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
	var arrSketchComp = new Array();
	var strSketch = strSketch.replace(/(^\s*)|(\s*$)/g, ""); // trim 역할
	var arrStrSketch = strSketch.split("\n");	

	for (var i = 0; i < arrStrSketch.length; i++) {
		var line = arrStrSketch[i];

		// 주석 제거
		line = line.substring(0, line.indexOf("//")).replace(/(^\s*)|(\s*$)/g, "");

		// 공백기준 분리
		var arrStrComp = line.split(" ");
		for (var j = 0; j < arrStrComp.length; j++) {
			if (arrStrComp[j] !== "") {	
				// 컴포넌트 분류	
				if (arrStrComp[j].substr(0, 1) === "(") { // 속성
					var sketchAttribute = new wedump.core.drawingEngine.sketch.SketchAttribute();
					var arrSketchAttribute = arrStrComp[j].substring(1, arrStrComp[j].length - 1).split(" ");

					for (var strSketchAttribute in arrSketchAttribute) {
						if (strSketchAttribute !== "") {
							sketchAttribute.values[sketchAttribute.values.length] = strSketchAttribute;
						}
					}

					arrSketchComp[arrSketchComp.length] = sketchAttribute;
				} else if (arrStrComp[j].substr(0, 1) === "{") { // 그룹					
					var arrSubSketchComp = sortAttribute(arrStrComp[j].substring(1, arrStrComp[j].length - 1)); // 재귀호출

					arrSketchComp[arrSketchComp.length] = arrSubSketchComp;
				} else { // 셀렉터
					var sketchSelector = new wedump.core.drawingEngine.sketch.SketchSelector();
					sketchSelector.strName = arrStrComp[j];

					arrSektchComp[arrSketchComp.length] = sketchSelector;					
				}
			}
		}
	}

	return arrSketchComp;
};

/**
 * (public)
 * sortSketchComponent : 속성, 그룹을 알맞은 셀렉터에 분류작업
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
 * @return {Array} 스케치 컴포넌트 객체 배열
 */
wedump.core.drawingEngine.sketch.SketchBase.prototype.rerendering = function(arrSektchComp) {

};