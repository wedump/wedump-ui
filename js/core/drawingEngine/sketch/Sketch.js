var wedump = {};
wedump.core = {};
wedump.core.drawingEngine = {};
wedump.core.drawingEngine.sketch = {};

/**
 * Sketch : 화면 스케치의 알고리즘 인터페이스를 제공
 * @type {Abstract Class}
 */
wedump.core.drawingEngine.sketch.Sketch = function() {
	this.component;
	this.sketchRules;
};

wedump.core.drawingEngine.sketch.Sketch.prototype = {
	/**
	 * (public)
	 * draw : 스케치의 템플릿 메소드(알고리즘 골격)
	 */
	draw : function() {
		this.sortAttribute();
		this.getCss();
		this.rerendering();
	},

	/**
	 * (public)
	 * sortAttribute : 스케치를 파싱하여 속성을 구분하여 정렬해 놓는다.
	 * @return {미정} 미정
	 */
	sortAttribute : function() {
		throw new Error("must override sortAttribute method");	
	},

	/**
	 * (public)
	 * getCss : 스케치에 필요한 알맞은 CSS를 스케치전용 CSS파일에서 읽어온다.
	 * @return {미정} 미정
	 */
	getCss : function() {
		throw new Error("must override getCss method");	
	},

	/**
	 * (public)
	 * rerendering : 스케치룰에 따라 재렌더링 하여 화면에 출력한다.
	 */
	rerendering : function() {
		throw new Error("must override rerendering method");	
	}
};