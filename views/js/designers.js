jQuery(document).ready(function($){
   $(".scroll").click(function(event){            
            event.preventDefault();
          $('html,body').animate({scrollTop:$(this.hash).offset().top-60}, 500);
   });
	
	$(".designer-directory-wrapper a.designer").mouseover(function(){
		$(this).find(".count").css("visibility","visible")
		
	})
	$(".designer-directory-wrapper a.designer").mouseout(function(){
		$(this).find(".count").css("visibility","hidden")
		
	})	
	
})

