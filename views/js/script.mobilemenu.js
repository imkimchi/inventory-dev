jQuery(document).ready(function($){
	var node = new Object();
	var method = new Object();
	var val = new Object();

	node.hamburger = $("a.hamburger");
	node.hamburgerClose = $("#hamburger").find("a.close");

	method.HamburgerEvent = function(e){
		var html = $("html");
		var target = $("#hamburger");
		var blackShadow = $(".black_shadow");
		if(!html.hasClass("active")){
			target.show();
			blackShadow.show();
			html.addClass("active");
		}else{
			target.hide();
			blackShadow.hide();
			html.removeClass("active");
		}
		return false;
	}

	method.windowResizeEvent = function(e){
		var html = $("html");
		var target = $("#hamburger");
		var blackShadow = $(".black_shadow");		
		var width = $(this).width();
		var limitX = 1350;
		if(width > limitX){
			html.removeClass("active");
			target.hide();
			blackShadow.hide();
		}
	}

	node.hamburger.on("click",method.HamburgerEvent);
	node.hamburgerClose.on("click",method.HamburgerEvent)
	$(window).on("resize",method.windowResizeEvent);
});