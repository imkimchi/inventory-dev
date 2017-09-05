$(document).ready(() => {
    let isLoggedin = false
    let jwtToken = store.get('jwtToken')

    if(jwtToken) isLoggedin = true
    
    console.log(jwtToken, isLoggedin)
    
    if(isLoggedin) {
        let $elem = $('.member_category li').eq(2).find('a')
        $elem[0].innerHTML = "ACCOUNT"
        $('.member_category li').eq(2).find('a').attr({
            'class': 'account',
            'href': '#'
        })
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