let imageObject = {
    subpics: [],
}

jQuery(document).ready(function($) {
    let itemElements = {
        productTitle: $("input[name*='item_name']"),
        productSubTitle: $("input[name*='designer_nam']"),
        productImage: $('.image_box')[0],
        productPrice: $("input[name*='price']").closest('li')[0],
        productCategory: $("select[name*='category']").closest('li'),
        shipping: $('.sell_form_shipping_section').find('dl'),
        description: $('.description'),
        gender: $('.gender_con').closest('li'),
        market: $('.marketCheck').closest('li'),
        paypalAccount: $("input[name*='paypal_account']").closest('li'),
        buyItNow: $('.payment_list').closest('li')[0],
        acceptOffers: $("input[name*='accept_offes']").closest('li')
    }

    $("#sellSubmit").click(async(e) => {
        e.preventDefault()
        for(element in itemElements) {
            $(itemElements[element]).css('border', '1px solid rgb(221, 221, 221)')
            $('span.market.gender').css("border-left-color", "rgb(221, 221, 221)")
        }

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
        let isAnythingEmpty = checkEmpty(itemElements, payload)

        if(!isAnythingEmpty) {
            let option = {
                method: "POST",
                url: '/post/upload',
                headers: {'Authorization': store.get('jwtToken')},
                data: payload
            }
            console.log("option", option)

            try {
                let res = await axios(option)
                window.location = `/listings/${res.data.url}`
            } catch (e) {
                console.error("failed to send signup request", e)
            }
        } else {
            $('html, body').animate({
                scrollTop: $("fieldset").offset().top
            }, 500)

            return false;
        }

        if(!imageObject.cover) {
            if($('.image_box').css('background-image') != 'none') {
                alert("Try it again")
            }
            return false
        }
    })
})

const isRedLined = element => element.css('border-color') === 'rgb(193, 39, 45)'
const backToOriginal = element => element.css('border', '1px solid rgb(221, 221, 221)')
const unRedLineThisElem = elem => isRedLined(elem) && backToOriginal(elem)

$(document).on('click', '.genderCheck', function() {
    if(isRedLined($(this))) {
        backToOriginal($('.genderCheck'))
        $('.genderCheck').find('span.market.gender').css('border-left-color', 'rgb(221, 221, 221)')
    }
})

$(document).on('click', '.marketCheck', function() {
    unRedLineThisElem($('.marketCheck'))
})

$(document).on('keyup', 'input[type="text"]', function() {
    unRedLineThisElem($(this).closest('li'))
})

$(document).on('change', '.select_list select', function() {
    unRedLineThisElem($(this).closest('li'))
})

$(document).on('keyup', 'textarea', function() {
    unRedLineThisElem($(this))
})

$(document).on('keyup', 'input[name="item_name"], input[name="designer_name"]', function() {
    unRedLineThisElem($(this))
})

$(document).on('change', 'input[name="buy_it_now"], input[name="accept_offes"]', function() {
    unRedLineThisElem($(this).closest('li'))
})

$(document).on('change', 'input[name="shipping[]"]', function() {
    unRedLineThisElem($(this).closest('dl'))
})

$(document).on('change', 'textarea', function() {
    unRedLineThisElem($(this).closest('li'))
})


function checkEmpty(itemElements, payload) {
    let emptyCounts = 0
    if(payload.productCategory === 'Category') payload.productCategory = ''

    for(item in payload) {
        if(!payload[item]) {
            $(itemElements[item]).css("border", "1px solid #c1272d")
            if(item === 'gender' || item === 'market') {
                $('span.market.gender').css("border-left-color", "#c1272d")
            }
            emptyCounts++
        }

        if(typeof payload[item] === 'object') {
            if(!Object.keys(payload[item]).length) {
                $(itemElements[item]).css("border", "1px solid #c1272d")
                emptyCounts++
            }

        }
    }
    return emptyCounts
}

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