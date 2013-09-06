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
	if (typeof strSketch == "undefined") return [];

	var arrSketchComp = new Array();
	var line = String(strSketch).replace(/(^\s*)|(\s*$)/g, ""); // trim 역할

	// 주석 제거
	var commentIndex = line.indexOf("//");
	if (commentIndex > -1) {		
		line = line.substring(0, line.indexOf("//")).replace(/(^\s*)|(\s*$)/g, "");
	}
	
	// 공백기준 분리
	var arrStrComp = line.split(" ");

	// 그룹의 증명인 첫 브레이스를 발견하면,
	// 마지막 브레이스를 발견할 때까지 이 변수에 누적하여 그룹 스케치 문자열을 구한다.
	// 공백 기준 분리이므로 그룹안의 컴포넌트간의 공백때문에 이러한 방법을 사용
	var groupComp = "";

	for (var i = 0; i < arrStrComp.length; i++) {
		if (arrStrComp[i] !== "") {	
			// 컴포넌트 분류	
			if (arrStrComp[i].substr(0, 1) === "(") { // 속성
				var sketchAttribute = new wedump.core.drawingEngine.sketch.SketchAttribute();
				var arrSketchAttribute = arrStrComp[i].substring(1, arrStrComp[i].length - 1).split(" ");

				for (var j = 0; j < arrSketchAttribute.length; j++) {
					if (arrSketchAttribute[j] !== "") {
						sketchAttribute.values[sketchAttribute.values.length] = arrSketchAttribute[j];
					}
				}

				arrSketchComp[arrSketchComp.length] = sketchAttribute;
			} else if (arrStrComp[i].substr(0, 1) === "{") { // 그룹					
				var lastBraceIndex = arrStrComp[i].indexOf("}");
				if (lastBraceIndex < 0) { // 닫기 중괄호가 있을 경우(그룹의 끝)
					arrStrComp[i + 1] = "{" + arrStrComp[i + 1];
					groupComp += arrStrComp[i].replace("{", "") + " ";
				} else {
					groupComp += arrStrComp[i].replace("{", "").replace("}", "");

					var groupAttributeIndex = arrStrComp[i].indexOf(":", lastBraceIndex);
					if (groupAttributeIndex > -1) { // 그룹속성을 포함하는 경우
						groupComp += " (" + arrStrComp[i].substr(groupAttributeIndex) + ")"; // 그룹속성은 그룹의 마지막 열에 존재하며, 콜론(:) 으로 시작된다.
					}

					var arrSubSketchComp = this.sortAttribute(groupComp); // 재귀호출						
					groupComp = "";
					arrSketchComp[arrSketchComp.length] = arrSubSketchComp;
				}					
			} else { // 셀렉터
				var sketchSelector = new wedump.core.drawingEngine.sketch.SketchSelector();
				sketchSelector.strName = arrStrComp[i];

				arrSketchComp[arrSketchComp.length] = sketchSelector;					
			}
		}
	}

	return arrSketchComp;
};

/**
 * (public)
 * sortSketchComponent : 속성, 그룹을 알맞은 셀렉터에 분류
 * @param {Array} 스케치 컴포넌트 객체 배열
 * @return {Array} 스케치 컴포넌트 객체 배열
 */
wedump.core.drawingEngine.sketch.SketchBase.prototype.sortSketchComponent = function(arrSektchComp) {
	if (typeof arrSektchComp == "undefined") return [];

	var sketchPackage = wedump.core.drawingEngine.sketch;

	for (var i = 0; i < arrSektchComp.length; i++) {
		var sketchComp = arrSektchComp[i];

		if (sketchComp instanceof sketchPackage.SketchAttribute) { // 속성
			if (arrSektchComp.length == 1) { // 속성만 있을 경우

			} else {
				if (arrSektchComp[i - 1] instanceof sketchPackage.SketchSelector) { // 왼쪽에 셀렉터가 있을 때
					sketchComp.direction = "right";
					arrSektchComp[i - 1].addSketchAttribute(sketchComp);
				} else if (arrSektchComp[i + 1] instanceof sketchPackage.SketchSelector) { // 왼쪽이 없을 경우 오른쪽 셀렉터
					sketchComp.direction = "left";
					arrSektchComp[i + 1].addSketchAttribute(sketchComp);
				} else if (arrSektchComp[i + 1] instanceof Array) { // 왼쪽이 없을 경우 오른쪽 그룹
					sketchComp.direction = "left";
					arrSektchComp[i + 1][arrSektchComp[i + 1].length] = sketchComp;
				}
			}
		} else if (sketchComp instanceof Array) { // 그룹

		}
	}
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