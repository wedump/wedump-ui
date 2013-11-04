/**
 * SketchMapper : 스케치 속성의 CSS를 얻어오기 위한 Mapper
 * @type {Implementation Class}
 */
wedump.core.drawingEngine.sketch.SketchMapper = function() {
	// [작성 방법]
	// 패턴명 ;; 정규식 ;; 대응식
	// 예) margin ;; /^[0-9]+(px)$/ ;; margin-&direction: &value;
	// 줄의 마지막에는 \n\ 을 붙여주어야 함
	// 대응변수는 &로 시작하며, 들어오는 파라미터가 순차적으로 대입됨
	// 대응변수에 영문 또는 영문과 숫자의 조합
	this.publicPatterns =
	"																	\n\
	margin 		;; /^[0-9]+(px)$/		;; margin-&direction: &value;	\n\
	float 		;; /^(left|right)$/		;; float: &value;				\n\
	";

	this.privatePatterns =
	"																	\n\
	width 		;;						;; width: &value;				\n\
	";
};

wedump.core.drawingEngine.sketch.SketchMapper.prototype = {
	/**
	 * (public)
	 * map : 속성 값의 패턴에 해당하는 대응식을 반환
	 * @param {String} 사용자로 부터 넘어온 속성 문자열
	 * @return {String} 대응식
	 */
	map : function(strAttrPattern, privateFlag) {
		var arrPattern = this.getPatterns(privateFlag);

		for (var i = 0; i < arrPattern.length; i++) {
			var patternName = arrPattern[i].patternName;
			var regExp      = eval(arrPattern[i].regExp);
			var correspond  = arrPattern[i].correspond;

			if (privateFlag) {
				if (patternName == strAttrPattern) {
					return correspond;
				}
			} else {
				if (regExp.test(strAttrPattern)) {
					return correspond;
				}
			}
		}

		throw new Error("No mapping CSS pattern");
	},

	/**
	 * (public)
	 * getPatterns : 패턴 문자열을 배열로 변환하여 반환
	 * @return {Array} 스케치 CSS패턴 배열
	 */
	getPatterns : function(privateFlag) {		
		var result = new Array();
		var arrPatterns = this.publicPatterns.split("\n");
		
		if (privateFlag) {
			arrPatterns = this.privatePatterns.split("\n");
		}
		
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