jQuery(document).ready(function($){
	$(".conversation-item-cta").css("display","none");
	
	$(document).on('click', ".toggleElem", function () {
		$(".conversation-item-cta").fadeOut(100);	
		$(".offer-wrapper").fadeOut(100);	

		let $elem = $(this).closest('.conversation').find('.conversation-item-cta')
		$elem.toggle();
	})

	$(document).on('click', ".offerbtn", function () {
		let $elem = $(this).closest('.conversation').find('.offer-wrapper')
		$elem.fadeIn(100);
	})

 	$(document).on('click', ".close", function () {
		let $elem = $(this).closest('.offer-wrapper')
		$elem.fadeOut(100)
	})
})