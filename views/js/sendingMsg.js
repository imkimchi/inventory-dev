let productURL = window.location.href.split('/')[4]

$(function() {
    $('.offer').click(async e => {
        e.preventDefault()
        let isduplicated = await checkDuplicated()
        let recipient = $('.sub-title a').first().text().replace('/u/', '')
        if(isduplicated) window.location = '/myaccount/messages'
        else window.location = `/message/offer/${recipient}/${productURL}`
    })

    $('.question').click(async e => {
        e.preventDefault()
        let isduplicated = await checkDuplicated()
        let recipient = $('.sub-title a').first().text().replace('/u/', '')
        if(isduplicated) window.location = '/myaccount/messages'
        else window.location = `/message/question/${recipient}/${productURL}`
    })
})

async function checkDuplicated () {
    let reqOpt = {
        url: '/message/dup',
        method: 'post',
        headers: {'Authorization': store.get('jwtToken')},
        data: {url: productURL}
    }

    let response = await axios(reqOpt)
    return response.data
}