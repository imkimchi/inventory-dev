let URL = window.location.href
let isOffer = () => URL.split('/')[1] ? URL.split('offer/')[1] : URL.split('question/')[1]
let whatIsThis = window.location.href.split('/')[4]

$(document).on('click', '.button', () => {
    let payload = {
        productURL: URL.split('/')[6],
        recipient: URL.split('/')[5],
        offerPrice: $('#offer').val(),
        description: $('#message').val()
    }

    for(let q in payload) {
        if(!payload[q]) {
            if(whatIsThis === 'offer') {
                alert("Please enter" + q)
                return false
            }
        }
    }

    if(payload.offerPrice <= 0) {
        alert("Offer Price can't be bigger than 0 or lower")
        return false
    }

    let reqURL = isOffer ? "offer" : "question"

    let option = {
            method: "POST",
            url: `/message/${reqURL}`,
            headers: {'Authorization': store.get('jwtToken')},
		    data: payload
    }
    
    sendReq(option)
})

async function sendReq(option) {
    try {
        let res = await axios(option)
        if(res.data.success) window.location.href = '/myaccount/messages'
        else console.log("failed", res)
    } catch (e) {
        console.log(e)
    }
}