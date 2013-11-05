/**
 * SketchBase : 공통으로 사용되는 레이아웃 스케치를 제공
 * @type {Implementation Class}
 */
wedump.core.drawingEngine.sketch.SketchBase = function(strSketch, arrSketchObj) {
	this.strSketch = strSketch; // 스케치 문자열
	this.arrSketchObj = arrSketchObj; // 스케치 문자열과 매칭되는 스케치 객체 배열
	this.arrSketchComp = new Array(); // 스케치 컴포넌트 객체 배열
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
			if (arrStrComp[i].substr(0, 1) == "(") { // 속성
				var sketchAttribute = new wedump.core.drawingEngine.sketch.SketchAttribute();
				var arrSketchAttribute = arrStrComp[i].substring(1, arrStrComp[i].length - 1).split(" ");

				for (var j = 0; j < arrSketchAttribute.length; j++) {
					if (arrSketchAttribute[j] !== "") {
						sketchAttribute.values[sketchAttribute.values.length] = arrSketchAttribute[j];
					}
				}

				arrSketchComp[arrSketchComp.length] = sketchAttribute;
			} else if (arrStrComp[i].substr(0, 1) == "{") { // 그룹				
				var lastBraceIndex = arrStrComp[i].indexOf("}");

				if (lastBraceIndex < 0) {
					arrStrComp[i + 1] = "{" + arrStrComp[i + 1];
					groupComp += arrStrComp[i].replace("{", "") + " ";
				} else { // 닫기 중괄호가 있을 경우(그룹의 끝)
					var lastWord = arrStrComp[i].replace("{", "").replace("}", "");
					var groupAttributeIndex = arrStrComp[i].indexOf(":", lastBraceIndex);

					if (groupAttributeIndex > -1) { // 그룹속성을 포함하는 경우
						groupComp += lastWord.substring(0, lastWord.indexOf(":"));

						if (arrStrComp[i].substr(groupAttributeIndex) == ":right") { // 예외처리(그룹의 오른쪽 정렬을 위한)
							if ( i == arrStrComp.length - 1 ||
							    (i == arrStrComp.length - 2 && arrStrComp[i + 1].substr(0, 1) == "(") ) {
								groupComp += " (:right)";
							} else {
								groupComp += " (:left)";
							}
						} else {
							groupComp += " (" + arrStrComp[i].substr(groupAttributeIndex) + ")"; // 그룹속성은 그룹의 마지막 열에 존재하며, 콜론(:) 으로 시작된다.	
						}												
					} else {
						groupComp += lastWord;
						groupComp += " (:left)"; // 디폴트
					}

					var arrSubSketchComp = this.sortAttribute(groupComp); // 재귀호출						
					groupComp = "";
					arrSketchComp[arrSketchComp.length] = arrSubSketchComp;
				}					
			} else { // 셀렉터
				if (jQuery(arrStrComp[i]).length == 0) {
					throw new Error("Not found sketch selector");
				}

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
wedump.core.drawingEngine.sketch.SketchBase.prototype.sortSketchComponent = function(arrSketchComp) {	
	if (typeof arrSketchComp == "undefined") return [];

	var sketchPackage = wedump.core.drawingEngine.sketch;
	var newArrSketchComp = new Array();
	var index1 = 0;	

	for (var i = 0; i < arrSketchComp.length; i++) {
		var sketchComp = arrSketchComp[i];
		newArrSketchComp[index1++] = sketchComp;

		if (sketchComp instanceof sketchPackage.SketchAttribute) { // 속성
			if (arrSketchComp[i - 1] instanceof sketchPackage.SketchSelector) { // 왼쪽에 셀렉터가 있을 때
				sketchComp.direction = "right";
				arrSketchComp[i - 1].addSketchAttribute(sketchComp);
			} else if (arrSketchComp[i + 1] instanceof sketchPackage.SketchSelector) { // 왼쪽이 없을 경우 오른쪽 셀렉터
				sketchComp.direction = "left";
				arrSketchComp[i + 1].addSketchAttribute(sketchComp);
			} else if (arrSketchComp[i + 1] instanceof Array) { // 왼쪽이 없을 경우 오른쪽 그룹
				sketchComp.direction = "left";
				sketchComp.values[0] = ":" + sketchComp.values[0];
				arrSketchComp[i + 1][arrSketchComp[i + 1].length] = sketchComp;
			} else {
				continue;
			}
			index1--;
			newArrSketchComp.pop();
		} else if (sketchComp instanceof Array) { // 그룹
			var firstSketchGroup = new sketchPackage.SketchGroup();
			var lastSketchGroup = new sketchPackage.SketchGroup();			
			firstSketchGroup.order = firstSketchGroup.FIRST;			
			lastSketchGroup.order = firstSketchGroup.LAST;

			if (arrSketchComp[i + 1] instanceof sketchPackage.SketchAttribute) { // 오른쪽에 속성이 있을 경우
				arrSketchComp[i + 1].direction = "right";
				arrSketchComp[i + 1].values[0] = ":" + arrSketchComp[i + 1].values[0];
				sketchComp[sketchComp.length] = arrSketchComp[i + 1];

				for (var j = i + 1; j < arrSketchComp.length; j++) {
					arrSketchComp[j] = arrSketchComp[j + 1];
				}

				arrSketchComp.pop();
			}

			var newSketchComp = new Array();
			var index2 = 0;
			for (var j = 0; j < sketchComp.length; j++) {
				newSketchComp[index2++] = sketchComp[j];

				if (sketchComp[j] instanceof sketchPackage.SketchAttribute) {
					if (sketchComp[j].values[0].substr(0, 1) == ":") { // 그룹 속성
						sketchComp[j].values[0] = sketchComp[j].values[0].substr(1);
						firstSketchGroup.addSketchAttribute(sketchComp[j]);						
						newSketchComp.pop();
						index2--;
					}
				}
			}

			sketchComp = this.sortSketchComponent(newSketchComp); // 재귀호출

			for (var j = 0; j < sketchComp.length; j++) {
				if (sketchComp[j] instanceof sketchPackage.SketchSelector) {
					if (j == 0) { // 그룹의 시작					
						sketchComp[j].sketchGroup = firstSketchGroup;
						index1--;
					} else if (j == sketchComp.length - 1) { // 그룹의 끝
						sketchComp[j].sketchGroup = lastSketchGroup;
					}
				}

				newArrSketchComp[index1++] = sketchComp[j];
			}
		}
	}

	return newArrSketchComp;
};

/**
 * (public)
 * applyCss : 분류된 속성에 알맞은 CSS패턴을 적용
 * @param {Array} 스케치 컴포넌트 객체 배열
 * @return {Array} 스케치 컴포넌트 객체 배열
 */
wedump.core.drawingEngine.sketch.SketchBase.prototype.applyCssPattern = function(arrSketchComp) {
	var sketchPackage = wedump.core.drawingEngine.sketch;
	var mapper = new sketchPackage.SketchMapper();

	// 속성을 찾아서 pattern 변수에 값을 채워줌	
	for (var i = 0; i < arrSketchComp.length; i++) {
		if (arrSketchComp[i] instanceof sketchPackage.SketchSelector) {
			var sketchAttributes  = arrSketchComp[i].sketchAttributes; // 셀렉터 -> 속성
			var gSketchAttributes = [];
			
			if (arrSketchComp[i].sketchGroup instanceof sketchPackage.SketchGroup) {
				gSketchAttributes = arrSketchComp[i].sketchGroup.sketchAttributes; // 셀렉터 -> 그룹 -> 속성
			}
			
			for (var j = 0; j < sketchAttributes.length; j++) {				
				sketchAttributes[j].pattern = mapper.map(sketchAttributes[j].values[0]); // 해당속성에 맞는 CSS대응식 추출
			}

			for (var j = 0; j < gSketchAttributes.length; j++) {				
				gSketchAttributes[j].pattern = mapper.map(gSketchAttributes[j].values[0]);
			}
		} else if (arrSketchComp[i] instanceof sketchPackage.SketchAttribute) {
			arrSketchComp[i].pattern = mapper.map(arrSketchComp[i].values[0]);
		}
	}

	return arrSketchComp;
};

/**
 * (public)
 * divisionWidth : 각 셀렉터들에 알맞은 넓이를 분배
 * @param {Array} 스케치 컴포넌트 객체 배열 
 * @param {int} 현재 window의 width
 * @return {Array} 스케치 컴포넌트 객체 배열
 */
wedump.core.drawingEngine.sketch.SketchBase.prototype.divisionWidth = function(arrSketchComp, currPer100Width) {
	if (arrSketchComp.length == 1) return arrSketchComp;

	var sketchPackage = wedump.core.drawingEngine.sketch;
	var mapper = new sketchPackage.SketchMapper();
	var sketchAttribute;

	// 사용자가 CSS를 embedded로 선언했을 경우 Width를 구하는 함수
	var getEmbeddedWidth = function(selector, flag) {
		if (typeof document.styleSheets[0] == "undefined") return 0;

		var value = 0;
		var rules = document.styleSheets[0].rules;

		for (var i = 0; i < rules.length; i++) {
			var selectorText = rules[i].selectorText;

			for (var j = 0; j < jQuery(selectorText).length; j++) {
				value = Number(rules[i].style[flag].split(" ")[0].replace("px", ""));				
			}
		}

		return value;
	}
	
	for (var i = 0; i < arrSketchComp.length; i++) {
		var selector = arrSketchComp[i].strName;
		var inlineYn = jQuery(selector).css("display") == "inline";

		jQuery(selector).css("display", "inline-block");

		if (i != arrSketchComp.length - 1) {
			jQuery(selector).css("float", "left");
		}	
		
		// 넓이 구하기
		if (i == 0) {
	    	var per100Width = currPer100Width; // 현재화면 100%의 width(px)
			var totWidth = 0; // 존재하는 컴포넌트의 width 합
			var freeWidth = 0; // 남은 공간
			var cnt = 0;

			for (var j = 0; j < arrSketchComp.length; j++) {
				var selector2 = arrSketchComp[j].strName;

				if (j == 0 && !currPer100Width) {
					jQuery(selector2).wrap("<div></div>");

					var width   = Number(jQuery(selector2).parent().css("width").replace("px", ""));
					var border  = Number(jQuery(selector2).parent().css("border").split(" ")[0].replace("px", ""));
					per100Width = width + border * 2;

					jQuery(selector2).unwrap("<div></div>");
				}
				
				var borderWidth = 0;
				var bodyWidth   = 0;

				borderWidth = getEmbeddedWidth(selector2, "border");
				bodyWidth   = getEmbeddedWidth(selector2, "width");

				// CSS를 사용자가 inline으로 선언했을 경우
				if (borderWidth == 0) {
					borderWidth = Number(jQuery(selector2)[0].style.border.split(" ")[0].replace("px", ""));
				}
				if (bodyWidth == 0) {
					bodyWidth = Number(jQuery(selector2)[0].style.width.replace("px", ""));
				}

				var attrWidth = 0; // 속성 width
				var sketchAttributes = arrSketchComp[j].sketchAttributes;				
				var gSketchAttributes = new Array();

				if (arrSketchComp[j].sketchGroup instanceof sketchPackage.SketchGroup) {
					gSketchAttributes = arrSketchComp[j].sketchGroup.sketchAttributes;					
				}

				for (var k = 0; k < sketchAttributes.length; k++) { // 셀렉터 속성
					var index = sketchAttributes[k].values[0].indexOf("px");

					if (index > -1) {
						attrWidth += Number(sketchAttributes[k].values[0].substring(0, index));
					}
				}

				for (var k = 0; k < gSketchAttributes.length; k++) { // 그룹 속성
					var index = gSketchAttributes[k].values[0].indexOf("px");

					if (index > -1) {
						attrWidth += Number(gSketchAttributes[k].values[0].substring(0, index));
					}
				}

				totWidth += attrWidth + bodyWidth + borderWidth * 2;

				if (bodyWidth == 0) {
					cnt++;
				}
			}

			freeWidth = per100Width - totWidth;

			var width = Math.floor(freeWidth / cnt * 100) / 100 + "px";
			
			sketchAttribute = new sketchPackage.SketchAttribute();

			sketchAttribute.values[0] = width;
			sketchAttribute.pattern = mapper.map("width", true); // css속성 width 매핑
		}

		// 넓이 분배
		if (!inlineYn) {
			if (jQuery(selector)[0].style.width == "" && getEmbeddedWidth(selector, "width") == 0) {
				arrSketchComp[i].addSketchAttribute(sketchAttribute);
			}
		}
	}

	return arrSketchComp;
};

/**
 * (public)
 * rerendering : 화면에 해당 순서대로 재배치
 * @param {Array} 스케치 컴포넌트 객체 배열
 * @param {String} 재렌더링 될 영역 셀렉터
 * @return {Array} 스케치 컴포넌트 객체 배열
 */
wedump.core.drawingEngine.sketch.SketchBase.prototype.rerendering = function(arrSketchComp, target) {
    var sketchPackage = wedump.core.drawingEngine.sketch;
    var allHtml  = jQuery(target).html();
    var nAllHtml = "";    

    for (var i = 0; i < arrSketchComp.length; i++) {
    	var lineSketchComp = arrSketchComp[i];
    	
    	for (var j = 0; j < lineSketchComp.length; j++) {
    		var nLineHtml = "";
    		var attrStyle = "";    		
    		
	    	if (lineSketchComp.length == 1 && lineSketchComp[0] instanceof sketchPackage.SketchAttribute) { // 예외처리
    			// 한 행에 속성만 있는 경우
    			if (i == 0) { // 첫 행이면 위가 없으므로 아래쪽으로 마진
    				lineSketchComp[0].direction = "bottom";
    			} else { // 위쪽으로 마진
    				lineSketchComp[0].direction = "top";
    			}

    			attrStyle = lineSketchComp[0].getCss();
	    	} else {
	    		var selector = lineSketchComp[j].strName;
	    		var delHtml = jQuery(selector).wrap("<span></span>").parent().html();	    		
	    		jQuery(selector).unwrap("<span></span>");

		    	allHtml = String(allHtml).replace(delHtml, "");

		    	nLineHtml = lineSketchComp[j].getInnerHtml();
	    	}

	    	// 한 행은 하나의 div로 감싼다
	    	if (attrStyle != "") {
		    	if (j == 0) {
		    		nLineHtml = "<div style='border: 0; " + attrStyle + "'>" + nLineHtml;
		    	}
		    	
		    	if (j == lineSketchComp.length - 1) {
		    		nLineHtml = nLineHtml + "</div>";
		    	}
	    	}

	    	nAllHtml += nLineHtml + "\n";
    	}    	
    }

    // 남은 태그 붙임
    nAllHtml += allHtml;

    jQuery(target).html(nAllHtml);

    return arrSketchComp;
};