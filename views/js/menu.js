jQuery(document).ready(function($){

 $(".left_header_box .category .m1").mouseover(function(){

    $(".designers").stop(true).fadeTo(200,1);
	 $(".man").css("display","none");
	 $(".woman").css("display","none");
	  $(".dropdown_inner").css("display","block");
	 
	   
});

 $(".designers").mouseleave(function(){
	 $(".designers").stop(true).fadeTo(200,0);
	 $(".man").css("display","none");
	 $(".woman").css("display","none");	 
	 $(".dropdown_inner").css("display","none");
});

 $(".top_string").mouseover(function(){
	 $(".designers").css("display","none");
	 $(".man").css("display","none");
	 $(".woman").css("display","none");	 
    $(".accountmenu").css("display","none");		   
});

 $(".m4").mouseover(function(){
	 $(".designers").css("display","none");
	 $(".man").css("display","none");
	 $(".woman").css("display","none");	 
    $(".accountmenu").css("display","none");		   
});

 $(".right_header_box").mouseover(function(){
	 $(".dropdown").stop(true).fadeTo(200,0);
		   
});

$(".left_header_box").mouseover(function(){
	$(".accountmenu").css("display","none");	 
		   
});


 $(".left_header_box .category .m2").mouseover(function(){
	 $(".man").stop(true).fadeTo(200,1);
	$(".woman").css("display","none");
	 $(".designers").css("display","none");
});

 $(".man").mouseleave(function(){
	 $(".man").stop(true).fadeTo(200,0);
	$(".woman").css("display","none");
	 $(".designers").css("display","none");
	 
});


 $(".left_header_box .category .m3").mouseover(function(){
	 $(".woman").stop(true).fadeTo(200,1);
	$(".man").css("display","none");
	 $(".designers").css("display","none");
});

 $(".woman").mouseleave(function(){
	 $(".woman").stop(true).fadeTo(200,0);
	 $(".man").css("display","none");
	 $(".designers").css("display","none");
	 
});

$(".account").hover(function(){
	$(".accountmenu").stop(true).fadeTo(200,1);
})

$(".accountmenu").mouseleave(function(){
	$(".accountmenu").stop(true).fadeTo(200,0);
	$(".accountmenu").css("display","none");
})

$(".mypage").mouseover(function(){
	console.log("triggered")
	$(".accountmenu").stop(true).fadeTo(200,0);
	$(".accountmenu").css("display","none");
})

$(".sell").mouseover(function(){
	$(".accountmenu").stop(true).fadeTo(200,0);
	$(".accountmenu").css("display","none");
})
	
$('.menu').click(function(){
	 $('.category-tab .active').removeClass('active');
	 $(this).addClass('active'); 		 
 });	 
$("#tab2").css("display","none");
 $('.menutab1').click(function(){
	 $("#tab1").css("display","block")
	 $("#tab2").css("display","none");		  
 });
  $('.menutab2').click(function(){
	 $("#tab1").css("display","none")
	 $("#tab2").css("display","block");		  
 });		

	
<!--hide filter-->	
$(".filter-toggle").click(function(){
	$(".left_filter_box").toggleClass("hide");
	$(".right_product_box").toggleClass("mini")
})

$(".designers-popover button.close").click(function(){
  $(this).parent().css("display","none")	
})
$(".all_designer_btn_box").click(function(){
	$(".designers-popover").css("display","block")
})


 $(".m4").click(function(event){            
            event.preventDefault();
          $('html,body').animate({scrollTop:$(this.hash).offset().top}, 500);
   });
	
	
$(".goodtog").click(function(e){
  $(this).removeAttr("href");
  $('img',this).toggle();
   e.preventDefault();
});

$(".clearall").css("display","none")
//
//if ($('.designer-group input').is(':checked')) {
//		$(".clearall").css("display","none")
//	}

//if ($('.designer-group label').prop('checked')) {
//    $(".clearall").css("display","none")
//}

$('.designer-group label').click(function(){
	$(".clearall").css("display","block");
	
})

$(".clearall").click(function(){
   $( ".designer-group  input" ).prop( "checked", false );
   $(".selectbtnwrap .sbox").css("display","none");

});

$(".main_search_area .orderlist").css("display","none");
$(".main_search_area .sortby").mouseover(function(){
	$(".main_search_area .orderlist").css("display","block");
	})
$(".main_search_area .orderlist").mouseleave(function(){
	$(this).css("display","none");
	})	
$(".main_search_area .refresh").mouseleave(function(){
	$(".main_search_area .orderlist").css("display","none");
	})	
	
$(".main_search_area #search").mouseleave(function(){
	$(".main_search_area .orderlist").css("display","none");
	})	
		

})