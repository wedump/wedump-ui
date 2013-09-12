/**
 * SketchAttribute : 스케치 컴포넌트 중 속성을 대변
 * @type {Implementation Class}
 */
wedump.core.drawingEngine.sketch.SketchAttribute = function() {
	this.direction; // 속성 적용방향
	this.values = new Array(); // 속성을 채울 값 배열
	this.pattern; // CSS 패턴
};

wedump.core.drawingEngine.sketch.SketchAttribute.prototype = {
	/**
	 * (public)
	 * getCss : 속성의 CSS를 반환
	 * @return {String} 속성의 CSS 문자열
	 */
	getCss : function() {
		if (this.values.length < 1) return "";
		if (typeof this.pattern == "undefined") return "";		

		var strCss  = this.pattern;
		var nValues = new Array();

		if (typeof this.direction != "undefined") {
			nValues[0] = this.direction;
		}

		// 새 배열에 복제
		for (var i = 0; i < this.values.length; i++) {
			nValues[nValues.length] = this.values[i];
		}

		for (var i = 0; i < nValues.length; i++) {
			strCss = strCss.replace(/&+[a-zA-Z0-9]*/, nValues[i]);
		}

		return strCss;
	}
};