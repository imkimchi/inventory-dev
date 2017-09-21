jQuery(document).ready(function($){
	
	$(".listing-photo-item img").click(function(){
	  $(this).parent().parent().parent().toggleClass("open");
	  $(this).parent().parent().parent().next().toggleClass("hidden");
		
	})
	
})