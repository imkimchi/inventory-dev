$(document).ready(() => {
    let isLoggedin = false
    let jwtToken = store.get('jwtToken')
    let path = window.location.pathname

    if(jwtToken) isLoggedin = true
    else
    console.log(jwtToken, isLoggedin)

    if(jwtToken && path != '/') {
        getUnreadCount(jwtToken)
    }

    if(path != '/') {
        console.log("yes nigg!")
        $('.m4').replaceWith("<div class='m4'>SEARCH</div>")
        $('.m4').css({
            "padding" : "0px 4px",
        "line-height" : "15px",
        "font-size": "13px",
        "display": "block",
        "border-bottom": "1px solid #fff",
        "margin": "0 10px"
        })
        $('.m4').hover(function(){ $(this).css('cursor', 'pointer')})
        $('.m4').click(() => window.location = '/#keyword')
    }

    $('.sell').click(() => {
        if(jwtToken) window.location = '/mypage/sell.html'
        else window.location = '/mypage/login.html'
    })
    
    $('.enter').click(async () => {
        if(jwtToken) {
            let reqOpt = {
                url: '/auth/decode',
                method: "POST",
                data: { jwt: jwtToken }
            }

            let decodedData = await axios(reqOpt)
            window.location = `/u/${decodedData.data.username}`
        }
        else window.location = '/mypage/login.html'
    })
})

async function getUnreadCount (jwtToken) {
    $('.mypage').remove()

    let reqOpt = {
        url: '/message/unread',
        method: "POST",
        data: { jwt: jwtToken }
    }

    let decodedData = await axios(reqOpt)

    if(decodedData.data.unreadCount) {
        let menuWithName = $(`<a class='account' href='#'>${decodedData.data.username}</a><div class="unread-big">${decodedData.data.unreadCount}</div>`)
        $('.member_category li').last().append(menuWithName)
    } else {
        let menuWithName = $(`<a class='account' href='#'>${decodedData.data.username}</a>`)
        $('.member_category li').last().append(menuWithName)
    }



    
    $(document).on('hover', '.account', function(){
        $(".accountmenu").stop(true).fadeTo(200,1);
    })

    $(".account").hover(function(){
        $(".accountmenu").stop(true).fadeTo(200,1);
    })
}