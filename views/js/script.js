jQuery(document).ready(function($){
	var node = new Object();
	var method = new Object();
	var val = new Object();

	node.main = {
		indivBanner : $(".main_top_indiv_banner"),
		categoryBanner : $("#main_category_banner")
	};

	// event handler
	if(node.main.categoryBanner.length){
	    var mySwiper = new Swiper ('.swiper-container', {
			speed : 700, loop: true, prevButton : ".main_visual_prev", nextButton : ".main_visual_next"
	    }) 
	}

});