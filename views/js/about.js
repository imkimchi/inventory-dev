jQuery(document).ready(function($){
	$("#faqs .answer").css("display","none");	
	
	
	$("#faqs .question-answer p").click(function(){	
		$(".answer").css("display", "none");		
		$(this).next().css("display","block");
	})
	

	
    $("#faqs .answer").mouseleave(function(){
		$(this).css("display","none");
	})
	
	
   $(".scroll").click(function(event){            
            event.preventDefault();
          $('html,body').animate({scrollTop:$(this.hash).offset().top}, 500);
   });
	
	
})