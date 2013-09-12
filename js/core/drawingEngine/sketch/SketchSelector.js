/**
 * SketchSelector : 스케치 컴포넌트 중 셀렉터를 대변
 * @type {Implementation Class}
 */
wedump.core.drawingEngine.sketch.SketchSelector = function() {
	this.strName; // 문자열 셀렉터
	this.sketchGroup; // 셀렉터의 그룹
	this.sketchAttributes = new Array(); // 스체키 컴포넌트 중 속성의 배열	
};

wedump.core.drawingEngine.sketch.SketchSelector.prototype = {
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
	 * getInnerHtml : 셀렉터의 innerHTML을 반환
	 * @return {String} 셀렉터의 innerHTML 문자열
	 */
	getInnerHtml : function() {
		if (typeof jQuery(this.strName) == "undefined") return "";

		var style  = "";		
		var html   = "";		

		if (typeof jQuery(this.strName).attr("style") != "undefined") {
			style = jQuery(this.strName).attr("style").replace(/^\s*|\s*$/gi, "");

			if (style.substr(style.length - 1) != ";") { // 끝에 세미콜론이 없으면 추가
				style += ";";
			}
		}

		jQuery(this.strName).attr("style", ""); // style속성이 없어도 style속성을 강제로 만듬
		
		for (var i = 0; i < this.sketchAttributes.length; i++) {
			style += this.sketchAttributes[i].getCss();
		}

		html = jQuery(this.strName).wrap("<span></span>").parent().html(); // innerHTML을 얻기위해 임시 부모생성		
		html = jQuery(html).attr("style", style).wrap("<span></span>").parent().html();
		jQuery(this.strName).unwrap("<span></span>");

		// 그룹 html 결합
		if (typeof this.sketchGroup != "undefined") {
			var gHtml = this.sketchGroup.getInnerHtml();

			if (this.sketchGroup.order == this.sketchGroup.FIRST) {
				html = gHtml + html;
			} else if (this.sketchGroup.order == this.sketchGroup.LAST) {
				html += gHtml;
			}
		}

		return html;
	}
};