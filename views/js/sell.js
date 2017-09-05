jQuery(document).ready(function($) {
  var max_fields = 3; //maximum input boxes allowed
  var wrapper = $(".input_fields_wrap"); //Fields wrapper
  var add_button = $(".add_field_button"); //Add button ID
  var x = 1; //initlal text box count
  $(add_button).click(function(e) { //on add input button click
    e.preventDefault();
    if (x < max_fields) { //max input box allowed
      x++; //text box increment
      $(wrapper).append('<div  style="position:relative"><input type="text" name="mytext[]"/ placeholder="Designer"><a href="#" class="remove_field">x</a></div>'); //add input box
    }
  });
  $(wrapper).on("click", ".remove_field", function(e) { //user click on remove text
    e.preventDefault();
    $(this).parent('div').remove();
    x--;
  })
})

function button(elem, choice) {
    let checkButton = $(elem).find('.fa')

    if(choice === 'gender') {
        let checkElems = $('.gender_con').find('.fa')
        unClickButton(checkElems)
    }
    
    if(choice === 'market') {
        let checkElems = $('#market').find('.fa')
        unClickButton(checkElems)
    }
    
    checkButton.css("color", "rgb(56, 61, 65)")
}

function unClickButton(checkElems) {
    console.log(checkElems)

    for(let i=0; i<checkElems.length; i++) {
        if(checkElems.eq(i).css("color") == "rgb(56, 61, 65)") {
            checkElems.eq(i).css('color', 'rgb(240, 240, 240)')
        }
    }
}
