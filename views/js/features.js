jQuery(document).ready(function($){
	$(".last").children().mouseover(function(){
		$(this).find(".b").addClass("whiteblock")
	})
	$(".lastbox").mouseleave(function(){
		$(this).parent().find(".b").removeClass("whiteblock")
	})	
	
})

