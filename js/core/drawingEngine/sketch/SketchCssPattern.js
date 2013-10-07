/**
 * SketchCssPattern : 스케치 CSS패턴을 가지고있는 참조용 클래스
 * @type {Implementation Class}
 */
wedump.core.drawingEngine.sketch.SketchCssPattern = function() {
	// [작성 방법]
	// 패턴명 ;; 정규식 ;; 대응식
	// 예) margin ;; /^[0-9]+(px)$/ ;; margin-&direction: &value;
	// 줄의 마지막에는 \n\ 을 붙여주어야 함
	// 대응변수는 &로 시작하며, 들어오는 파라미터가 순차적으로 대입됨
	// 대응변수에 영문 또는 영문과 숫자의 조합
	this.patterns =
	"															  	   \n\
	margin		;; /^[0-9]+(px)$/		 ;; margin-&direction: &value; \n\
	float		;; /^(left|right)$/		 ;; float: &value;		       \n\
	width		;; /^[0-9]+(.[0-9]+)?%$/ ;; width: &value;			   \n\
	";
};

wedump.core.drawingEngine.sketch.SketchCssPattern.prototype = {
	/**
	 * (public)
	 * getPatterns : 패턴 문자열을 배열로 변환하여 반환
	 * @return {Array} 스케치 CSS패턴 배열
	 */
	getPatterns : function() {		
		var result = new Array();
		var arrPatterns = this.patterns.split("\n");
		
		for (var i = 0; i < arrPatterns.length; i++) {
			var pattern = arrPatterns[i].replace(/(^\s*)|(\s*$)/gi, "");
			
			if (pattern !== "") {
				var patternSplit = pattern.split(";;");				
				var patternName  = patternSplit[0].replace(/(^\s*)|(\s*$)/gi, ""); // 패턴명
				var regExp		 = patternSplit[1].replace(/(^\s*)|(\s*$)/gi, ""); // 정규식
				var correspond   = patternSplit[2].replace(/(^\s*)|(\s*$)/gi, ""); // 대응식

				result[result.length] = {
					"patternName" : patternName,
					"regExp"	  : regExp,
					"correspond"  : correspond
				};				
			}
		}

		return result;
	}
};