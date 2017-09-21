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
        $countryFilter = $('.country_filter')

    let mixer = mixitup($container, config)

    $filterSelector.on('change', function() {
        console.log(this.value)
        mixer.filter(this.value)
    })

    $clearFilters.on('click', e => {
        mixer.filter('all')
        e.preventDefault()
 
        $('input[type="radio"]').each(function() {
            if($(this).is(':checked')) $(this).prop('checked', false)
        })
 
        $('input[type="text"]').each(function() {
            if($(this).val()) $(this).val('')
        })
    })

    $searchFilter.on('keyup', function() {
        let searchValue

        if(this.value.length < 3) searchValue =''
        else searchValue = this.value.toLowerCase().trim()

        setTimeout(() => {
            if(searchValue) mixer.filter(`[data-title*="${searchValue}"]`)
            else mixer.filter('all')
        }, 350)
    })

    $categoryFilter.on('change', radioFilters)

    $minPriceFilter.on('keyup', function() {
        let minPrice = parseInt(this.value.trim())
        let maxPrice = parseInt($maxPriceFilter[0].value)

        if(maxPrice) setTimeout(findPrice(minPrice, maxPrice, 250))
        if(!minPrice && !maxPrice) {
            findPrice(0, 10000000)
        }
    })

    $maxPriceFilter.on('keyup', function() {
        let maxPrice = parseInt(this.value.trim())
        let minPrice = parseInt($minPriceFilter[0].value)

        if(minPrice) setTimeout(findPrice(minPrice, maxPrice, 250))
        if(!minPrice && !maxPrice) {
            findPrice(0, 10000000)
        }
    })

    $countryFilter.on('change', radioFilters)

    function findPrice(minPrice, maxPrice) {
        let $show = $container.find('.mix').filter(function() {
            let price = Number($(this).attr('data-price'))
            return price >= minPrice && price <= maxPrice
        })
        mixer.filter($show)
    }
    
    function radioFilters(value) {
        let clickedCategory = $(this).attr('value')

        $(this).css("background-color", "rgb(221, 221, 221)")
        mixer.filter(`[data-category="${clickedCategory}"]`)
    }
})