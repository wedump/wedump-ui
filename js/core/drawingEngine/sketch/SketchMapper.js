/**
 * SketchMapper : 스케치 속성의 CSS를 얻어오기 위한 Mapper
 * @type {Implementation Class}
 */
wedump.core.drawingEngine.sketch.SketchMapper = function() {};

wedump.core.drawingEngine.sketch.SketchMapper.prototype = {
	/**
	 * (public)
	 * map : 속성 값의 패턴에 해당하는 대응식을 반환
	 * @param {String} 사용자로 부터 넘어온 속성 문자열
	 * @return {String} 대응식
	 */
	map : function(strAttrPattern) {
		var sketchCssPattern = new wedump.core.drawingEngine.sketch.SketchCssPattern();
		var arrPattern = sketchCssPattern.getPatterns();

		for (var i = 0; i < arrPattern.length; i++) {
			var regExp = eval(arrPattern[i].regExp);
			var correspond = arrPattern[i].correspond;

			if (regExp.test(strAttrPattern)) {
				return correspond;
			}
		}

		throw new Error("No mapping CSS pattern");
	}
};