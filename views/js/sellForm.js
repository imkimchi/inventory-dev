let imageObject = {
    subpics: [],
}

jQuery(document).ready(function($) {
    $("#sellSubmit").click(async() => {
        let payload = {
            productTitle: $("input[name*='item_name']").val(),
            productSubTitle: $("input[name*='designer_nam']").val(),
            productSize: 123,
            productImage: imageObject,
            productPrice: $("input[name*='price']").val(),
            productCategory: $("select[name*='category']").val(),
            shipping: await shippingVal(),
            seller: "DO IT WITH SESSION THING",
            description: $('.description').val(),
            gender: await checkVal('gender'),
            market: await checkVal('market'),
            paypalAccount: $("input[name*='paypal_account']").val(),
            buyItNow: $("input[name*='buy_it_now']")[0].checked,
            acceptOffers: $("input[name*='accept_offes']")[0].checked,
        }

        let option = {
            method: "POST",
            url: '/post/upload',
            headers: {'Authorization': store.get('jwtToken')},
		    data: payload
        }
        
        try {
            let res = await axios(option)
            window.location = `/listings/${res.data.url}`
        } catch (e) {
            console.error("failed to send signup request", e)
        }
    })
})

async function checkVal(choice) {
    let $genderIcons = $('.sell_form_gender_section').find('.fa')
    let $marketIcons = $('.sell_real_market_section').find('.fa')
    
    if(choice === 'gender') {
        let $parentSelector = '.genderCheck'
        let checked = await returnChecked($genderIcons, $parentSelector)
        return checked
    } else {
        let $parentSelector = '.marketCheck'
        let checked = await returnChecked($marketIcons, $parentSelector)
        console.log("checked is ", checked)
        return checked
    }
}

function returnChecked(iconsElem, parentElem) {
    let checked;
    iconsElem.each(function(i) {
        if($(this).css('color') === 'rgb(56, 61, 65)') {
            let $parentNode = $(this).parents(parentElem)
            checked = $parentNode.attr('id')
        }
    })
    return checked
}

async function shippingVal() {
    let allowedCountry = {}
    let $shipBox = $('.shipping_list input[type="checkbox"]')
    
    await $shipBox.each(function (i) {
        let isChecked = $shipBox.eq(i)[0].checked

        if(isChecked) {
            let shippingElem = $(this).parents('.shipping_list').eq(0)
            let countryName = shippingElem.find('.location label span').eq(0).text()
            let shippingPrice = shippingElem.find('.delivery_price label input').eq(0).val()
            allowedCountry[countryName] = shippingPrice
        }
    })

    return allowedCountry
}