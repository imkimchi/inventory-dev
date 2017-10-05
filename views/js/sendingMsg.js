let productURL = window.location.href.split('/')[4]

$(function() {
    $('.offer').click(async e => {
        e.preventDefault()
        let isduplicated = await checkDuplicated()
        console.log("disc", isduplicated)

        if(isduplicated) window.location = '/myaccount/messages'
        else window.location = `/message/offer/q/${productURL}`
    })

    $('.question').click(async e => {
        e.preventDefault()
        let isduplicated = await checkDuplicated()

        if(isduplicated) window.location = '/myaccount/messages'
        else window.location = `/message/question/q/${productURL}`
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