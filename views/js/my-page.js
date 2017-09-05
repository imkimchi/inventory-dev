jQuery(document).ready(function($){
	


	$(".my-pagetw .product").hover(function () {
			$(this).find('.bellon').css("display","block")
		}, function () {
			$(this).find('.bellon').css("display","none")
		});
		
	$(".my-pagetw .product .bellon").click(function(){		
		$( this ).toggleClass( "belloff" );
		
	})
	
})