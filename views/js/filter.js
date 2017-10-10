$(function() {
    let config = {
        multifilter: {
            enable: true
        },
        callbacks: {
            onMixStart: (state, futureState) => {
            console.log(futureState.activeFilter.selector)
    }
}
}

    let $container = $('#over_view'),
        $filterSelector = $('input[name="gender_name"]'),
        $clearFilters = $('.clearfilters'),
        $searchFilter = $('#search_filter, #keyword'),
        $categoryFilter = $('.category_filters'),
        $minPriceFilter = $('input[name="min_price"]'),
        $maxPriceFilter = $('input[name="max_price"]'),
        $countryFilter = $('.country_filter'),
        $designerFilter = $('.designer-group label'),
        $designerUnFilter = $('.selectbtn .fa-times'),
        $sort_default = $('.orderlist li').eq(0),
        $sort_new = $('.orderlist li').eq(1),
        $sort_lowPrice = $('.orderlist li').eq(2),
        $sort_highPrice = $('.orderlist li').eq(3),
        $sort_popular = $('.orderlist li').eq(4)

    let mixer = mixitup($container, config)

    $filterSelector.on('change', function () {
        console.log(this.value)
        mixer.filter(this.value)
    })

    $clearFilters.on('click', e => {
        mixer.filter('all')
        e.preventDefault()

    $('input[type="checkbox"]').each(function () {
        if ($(this).is(':checked')) $(this).prop('checked', false)
    })

    $('.moremenu .checkbox').each(function () {
        if ($(this).css('background-color', 'rgb(221, 221, 221)')) {
            $(this).css('background-color', 'rgb(255, 255, 255)')
        }
    })

    $('head').append('<style>.category_filters:checked + span.all:before {background-color:rgb(255, 255, 255)}</style>');
})
    $categoryFilter.each(function () {
        $(this).css('background-color', 'rgb(255, 255, 255)')
    })

    $('input[type="text"]').each(function () {
        if ($(this).val()) $(this).val('')
    })

    $searchFilter.on('keyup', function () {
        let searchValue

        if (this.value.length < 3) searchValue = ''
        else searchValue = this.value.toLowerCase().trim()

        setTimeout(() => {
            if(searchValue) mixer.filter(`[data-title*="${searchValue}"]`)
    else
        mixer.filter('all')
    },
        350
    )
    })

    $categoryFilter.on('change', radioFilters)

    $minPriceFilter.on('keyup', function () {
        let minPrice = parseInt(this.value.trim())
        let maxPrice = parseInt($maxPriceFilter[0].value)

        if (maxPrice) setTimeout(findPrice(minPrice, maxPrice, 250))
        if (!minPrice && !maxPrice) {
            findPrice(0, 10000000)
        }
    })

    $designerFilter.on('click', function () {
        let selectedDesigner = $(this).find('span').text()
        mixer.filter(`[data-designer="${selectedDesigner}`)
    })

    $designerUnFilter.on('click', function () {
        let selectedDesigner = $(this).closest('sbox').find('span').text()
        mixer.toggleOff(`[data-designer="${selectedDesigner}`)
    })

    $maxPriceFilter.on('keyup', function () {
        let maxPrice = parseInt(this.value.trim())
        let minPrice = parseInt($minPriceFilter[0].value)

        if (minPrice) setTimeout(findPrice(minPrice, maxPrice, 250))
        if (!minPrice && !maxPrice) {
            findPrice(0, 10000000)
        }
    })

    $countryFilter.on('change', radioFilters)


    $sort_default.click(function (e) {
        e.preventDefault()
        mixer.sort('default')
    })

    $sort_new.click(function (e) {
        e.preventDefault()
        mixer.sort('default')
    })

    $sort_lowPrice.on('click', function (e) {
        e.preventDefault()
        mixer.sort('price:asc')
    })

    $sort_highPrice.on('click', function (e) {
        e.preventDefault()
        mixer.sort('price:desc')
    })

    $sort_popular.on('click', function (e) {
        e.preventDefault()
        mixer.sort('like:desc')
    })

    $('.moremenu .checkbox').click(function () {
        if ($(this).css('background-color') === 'rgb(221, 221, 221)') {
            $(this).css('background-color', 'rgb(255, 255, 255)')
        } else {
            $(this).css('background-color', 'rgb(221, 221, 221)')
        }
    })

    function findPrice(minPrice, maxPrice) {
        let $show = $container.find('.mix').filter(function () {
            let price = Number($(this).attr('data-price'))
            return price >= minPrice && price <= maxPrice
        })
        mixer.filter($show)
    }

    function radioFilters(value) {
        let clickedCategory = $(this).attr('value')
        $('head').append('<style>.category_filters:checked + span.all:before {background-color:rgb(211, 211, 211)}</style>');
        mixer.filter(`[data-category="${clickedCategory}"]`)
    }
})