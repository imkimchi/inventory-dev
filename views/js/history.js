jQuery(document).ready(function($){
	$(".history .productw .product .box").css("display","none");
	$(".history .productw .product a").mouseover(function(){
		$(this).parent().find(".box").css("display","block");
	})

		$(".history .productw .product .box").mouseleave(function(){
		$(this).css("display","none");
	})
	
})