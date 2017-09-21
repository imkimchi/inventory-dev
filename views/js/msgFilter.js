
setTimeout(() => {
let $buyElem = $('.context-button').eq(0),
            $sellElem = $('.context-button').eq(1)
    
        let mixer = mixitup($('.conversations-wrapper'))
        
        $buyElem.on('click', e => {
          e.preventDefault()

          mixer.filter('[data-type="buy"]')        
        })

        $sellElem.on('click', e => {
          e.preventDefault()

          mixer.filter('[data-type="sell"]')
        })
  
}, 800)