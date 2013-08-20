var wedump = {};
wedump.core = {};
wedump.core.drawingEngine = {};
wedump.core.drawingEngine.detail = {};

wedump.core.drawingEngine.detail.DetailControl = function() {
	var public = wedump.core.drawingEngine.detail.DetailControl.prototype;

	/**
	 * (public)
	 * up : 해당 엘리먼트를 위로 이동시킨다.
	 * @param {String} jQuery 선택자
	 * @param {int} 단위
	 */
	public.up = function(selector, unit) {
		if (typeof selector == "string") { // 기본형태 파라미터			
			setXY(selector, 0, unit * -1);
		} else if (typeof selector == "object") { // JSON 형태 파라미터
			var selArray = parseJson(selector);

			for (var i = 0; i < selArray.length; i++) {
				var selector = selArray[i].key;
				var unit     = selArray[i].value;

				setXY(selector, 0, unit * -1);
			}
		}
	}

	/**
	 * (public)
	 * down : 해당 엘리먼트를 아래로 이동시킨다.
	 * @param {String} jQuery 선택자
	 * @param {int} 단위
	 */
	public.down = function(selector, unit) {
		if (typeof selector == "string") { // 기본형태 파라미터			
			setXY(selector, 0, unit);
		} else if (typeof selector == "object") { // JSON 형태 파라미터
			var selArray = parseJson(selector);

			for (var i = 0; i < selArray.length; i++) {
				var selector = selArray[i].key;
				var unit     = selArray[i].value;

				setXY(selector, 0, unit);
			}
		}
	}

    /**
	 * (public)
	 * left : 해당 엘리먼트를 왼쪽으로 이동시킨다.
	 * @param {String} jQuery 선택자
	 * @param {int} 단위
	 */
	public.left = function(selector, unit) {
		if (typeof selector == "string") { // 기본형태 파라미터			
			setXY(selector, unit * -1, 0);
		} else if (typeof selector == "object") { // JSON 형태 파라미터
			var selArray = parseJson(selector);

			for (var i = 0; i < selArray.length; i++) {
				var selector = selArray[i].key;
				var unit     = selArray[i].value;

				setXY(selector, unit * -1, 0);
			}
		}
	}

	/**
	 * (public)
	 * right : 해당 엘리먼트를 오른쪽으로 이동시킨다.
	 * @param {String} jQuery 선택자
	 * @param {int} 단위
	 */
	public.right = function(selector, unit) {
		if (typeof selector == "string") { // 기본형태 파라미터			
			setXY(selector, unit, 0);
		} else if (typeof selector == "object") { // JSON 형태 파라미터
			var selArray = parseJson(selector);

			for (var i = 0; i < selArray.length; i++) {
				var selector = selArray[i].key;
				var unit     = selArray[i].value;

				setXY(selector, unit, 0);
			}
		}
	}

    /**
     * (private)
	 * setXY : 해당 엘리먼트의 좌표를 설정한다.
	 * @param {String} jQuery 선택자
	 * @param {int} x 좌표
	 * @param {int} y 좌표
	 */
	var setXY = function(selector, x, y) {
		var element  = jQuery(selector);
		var position = element.css("position");

		// position이 지정되지 않은 경우 relative로 변경
		if (!position || position == "static") {
			element.css("position", "relative");
		}

		// style상의 좌표
		var styleXY = {
			x : element.css("left"),
			y : element.css("top")
		};

		if (isNaN(styleXY.x) || styleXY.x == "auto") {
			styleXY.x = 0;
		}
		if (isNaN(styleXY.y) || styleXY.y == "auto") {
			styleXY.y = 0;
		}

		element.css({
			"left" : x + styleXY.x + "px",
			"top"  : y + styleXY.y + "px"
		});
	}

	/**
     * (private)
	 * parseJson : JSON객체를 [{key, value}] 배열로 파싱한다.
	 * @param {JSON Object} JSON Object
	 */
	var parseJson = function(jsonObject) {
		var result     = new Array();
		var jsonString = JSON.stringify(jsonObject);
		    jsonString = jsonString.substring(1, jsonString.length - 1);

		var braceIndex = jsonString.indexOf("{", 1);
		if (braceIndex > -1) { // 2차원 형태의 JSON
			var split1 = jsonString.split("},");
			for (var i = 0; i < split1.length; i++) {
				var split2 = split1[i].split(":{");
				var key   = split2[0].replace(eval("/\"/gi"), ""); // repalceAll 효과
				var value = jsonStringToArray(split2[1]);

				result[i] = {key : key, value : value};
			}
		} else { // 1차원 형태의 JSON
			result = jsonStringToArray(jsonString);
		}

		return result;
	}

	/**
     * (private)
	 * parseJson : JSON 1차원 형태의 문자열을 [{key, value}] 배열로 파싱한다.
	 * @param {String} JSON형태의 문자열
	 */
	var jsonStringToArray = function(jsonString) {
		var result     = new Array();
		var paramMap   = jsonString.split(",\"");

		for (var i = 0; i < paramMap.length; i++) {
			var key    = paramMap[i].split("\":")[0].replace(eval("/\"/gi"), ""); // repalceAll 효과
			var value  = parseInt(paramMap[i].split("\":")[1]);

			result[i]  = {key : key, value : value};
		}

		return result;
	}
};