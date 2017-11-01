$(document).ready(() => {
    let isLoggedin = false
    let jwtToken = store.get('jwtToken')
    let path = window.location.pathname

    if(jwtToken) isLoggedin = true
    else
    console.log(jwtToken, isLoggedin)

    if(jwtToken && path != '/') getUnreadCount()

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

async function getUnreadCount () {
    $('.mypage').remove()

    let reqOpt = {
        url: '/message/unread',
        method: "POST",
        data: { jwt: jwtToken }
    }

    let decodedData = await axios(reqOpt)
    let menuWithName = $(`<a class='account' href='#'>${decodedData.data.username}</a><div class="unread-big">${decodedData.data.unreadCount}</div>`)
    $('.member_category li').last().append(menuWithName)
    
    $(document).on('hover', '.account', function(){
        $(".accountmenu").stop(true).fadeTo(200,1);
    })

    $(".account").hover(function(){
        $(".accountmenu").stop(true).fadeTo(200,1);
    })
}