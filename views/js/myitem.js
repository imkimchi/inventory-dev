jQuery(document).ready(function($){
	
	$(".my-pagetw .product a").mouseover(function(){
		$(this).css("opacity","0.9");
		 $(this).parent().find(".hug-top").css("display","block");
	})
	$(".my-pagetw .product a").mouseout(function(){
		$(this).css("opacity","1");
		$(".hug-top").css("display","none");
		
	})
})