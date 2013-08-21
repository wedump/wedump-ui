var wedump = {};
wedump.core = {};
wedump.core.drawingEngine = {};
wedump.core.drawingEngine.detail = {};

/**
 * DetailControl : Sketch 후 위치에 대한 상세제어를 제공
 * @type {Class}
 */
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
			for (var key in selector) {
				var value = selector[key];

				setXY(key, 0, value * -1);
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
			for (var key in selector) {
				var value = selector[key];

				setXY(key, 0, value);
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
			for (var key in selector) {
				var value = selector[key];

				setXY(key, value * -1, 0);
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
			for (var key in selector) {
				var value = selector[key];

				setXY(key, value, 0);
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
};