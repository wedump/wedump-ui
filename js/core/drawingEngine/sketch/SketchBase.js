/**
 * SketchBase : 공통으로 사용되는 레이아웃 스케치를 제공
 * @type {Implementation Class}
 */
wedump.core.drawingEngine.sketch.SketchBase = function(strSketch, arrSketchObj) {	
	this.strSketch = strSketch; // 스케치 문자열
	this.arrSketchObj = arrSketchObj; // 스케치 문자열과 매칭되는 스케치 객체 배열
	this.arrSketchComp = new Array(); // 스케치 컴포넌트 객체 배열
	
	//this.draw();
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
					groupComp += lastWord.substring(0, lastWord.indexOf(":"));

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
	// 한 행에 셀렉터 한개만 있을 경우가 아니면, display가 block인 셀렉터는 inline-block으로 변경해야 함    
    var sketchPackage = wedump.core.drawingEngine.sketch;
    var allHtml  = jQuery(target).html();
    var nAllHtml = "";

    for (var i = 0; i < arrSketchComp.length; i++) {
    	var lineSketchComp = arrSketchComp[i];
    	
    	for (var j = 0; j < lineSketchComp.length; j++) {    		
    		var nLineHtml = "";

    		// 예외처리
    		if (lineSketchComp.length == 1 && lineSketchComp[0] instanceof sketchPackage.SketchAttribute) {
    			// 한 행에 속성만 있는 경우
    			if (i == 0) { // 첫 행이면 위가 없으므로 아래쪽으로 배치

    			} else { // 위쪽으로 배치

    			}
	    	} else if (lineSketchComp.length > 1 &&
	    			   jQuery(lineSketchComp[j].strName).css("display") == "block") {
	    		// 한 행에 셀렉터가 한 개만 있는 경우가 아니면, display가 block인 셀렉터는 inline-block으로 변경
	    		jQuery(lineSketchComp[j].strName).css("display", "inline-block");
	    	}
	    	
	    	allHtml   = allHtml.replace(jQuery(lineSketchComp[j].strName).html(), "");
	    	nLineHtml = lineSketchComp[j].getInnerHtml();

	    	// 한 행은 하나의 div로 감싼다
	    	if (j == 0) {
	    		nLineHtml = "<div>" + nLineHtml;
	    	} else if (j == lineSketchComp.length - 1) {
	    		nLineHtml = nLineHtml + "</div>";
	    	}

	    	nAllHtml += nLineHtml + "\n";
    	}    	
    }

    // 남은 태그 붙임
    nAllHtml += allHtml;

    jQuery(target).html(nAllHtml);
};