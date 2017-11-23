a()

async function a() {
    let jwtToken = store.get('jwtToken')

    let authOpt = {
        url: '/auth/decode',
        method: "POST",
        data: { jwt: jwtToken }
    }

    let decodedData = await axios(authOpt)
    $(document).ready(socketChat(decodedData.data.username, jwtToken))
}

function socketChat (username, jwtToken) {
    const isSenderMe = sender => sender === username ? "right" : "left"
    const sendChat = (inputText, convoId, offerPrice) => socket.emit('chat', {offerPrice: offerPrice, desc: inputText, id: convoId, jwt: jwtToken})

    let convoHistory = []
    let socket = io.connect({'transports': ['websocket', 'polling']})

    $(document).on('click', '.toggleElem', function(e) {
        e.preventDefault()
        let convoId = $(this).closest('.mix').attr('data-id')
        let isHidden = $(this).closest('.mix').find('.conversation-item-cta').css('display')
        let latestConvo = [...convoHistory].pop()

        if(convoHistory.length) {
            let lastMessage = $(this).closest('.mix').find('.conversation-right').last().find('.messages').attr('data-id')
            console.log("last message nigga", lastMessage)
            socket.emit('quit', {convoId: latestConvo, username: username, lastMessage: lastMessage})
        }
        
        if($('.unread-msg').length) $('.unread-msg').remove()

        if(latestConvo === convoId) {
            return false
        } else {
            socket.emit('channel', convoId)
            convoHistory.push(convoId)
        }
    })


    $(document).on('click', ".buy-now", function (e) {
        e.preventDefault()
        $(this).off()
        window.location.href = `/listings/${$(this).closest('.mix').attr('data-url')}`
        e.preventDefault()
    })

    $(document).on('click', ".submitbtn a", function (e) {
        e.preventDefault()
        let inputText = $(this).closest('.conversation-cta').find('input').val()
        let convoId = $(this).closest('.mix').attr('data-id')
        if(inputText.length > 0) sendChat(inputText, convoId)
        $(this).closest('.conversation-cta').find('input').val('')
    })

    $(document).on('click', ".offerSubmit", function (e) {
        e.preventDefault()
        let inputText = $(this).closest('.offer-wrapper').find('.message').val()
        let offerPrice = $(this).closest('.offer-wrapper').find('.offer').val()
        let convoId = $(this).closest('.mix').attr('data-id')
        if(inputText.length > 0 && offerPrice.length > 0) sendChat(inputText, convoId, offerPrice)

        $(this).closest('.offer-wrapper').find('.message').val('')
        $(this).closest('.offer-wrapper').find('.offer').val('')
    })

    socket.on('message', data => {
        console.log("incoming message:", data)
        let lastConvo = $(`[data-id=${data.convoId}]`).find('.conversation').last()

        if(data.offerPrice) {
            if(!$('.buttons').length && data.sender != username) {
                console.log("append shit")
                let buttonParents = $(`[data-id=${data.convoId}]`).find('.offer-cover')
                buttonParents.prepend($('<div class="buttons"><div class="handleButton" id="accept"><div> Accept the offer </div></div><div class="handleButton" id="counter"><div> Counter </div></div></div>'))
            }

            let $offermessage = $(`<div class="conversation conversation-${isSenderMe(data.sender)}"> <div class="conversation-wrap"> <div class="conversation-image"><img src="..${data.profilePic}"></div> <div class="sub-title"> ${data.sender} </div> </div> <div class="messages" data-id="${data.messageId}"> <div class="messagestxt"> ${data.description} </div><div id="offerprice">Sent Offer $${data.offerPrice}</div><div class="date"> ${data.sent_date} </div> </div> </div>`)
            lastConvo.after($offermessage)
        } else {
            let $message = $(`<div class="conversation conversation-${isSenderMe(data.sender)}"> <div class="conversation-wrap"> <div class="conversation-image"><img src="..${data.profilePic}"></div> <div class="sub-title"> ${data.sender} </div> </div> <div class="messages" data-id="${data.messageId}"> <div class="messagestxt"> ${data.description} </div> <div class="date"> ${data.sent_date} </div> </div> </div>`)
            lastConvo.after($message)
        }
    })

    socket.on('offerHandle', data => {
        console.log("incoming offerhandle", data)
        let lastConvo = $(`[data-id=${data.convoId}]`).find('.conversation').last()

        if(data.acceptOffer) {
            let $acceptMessage = $(`<div class="conversation conversation-${isSenderMe(data.sender)}"> <div class="conversation-wrap"> <div class="conversation-image"><img src="..${data.profilePic}"></div> <div class="sub-title"> ${data.sender} </div> </div> <div class="messages" data-id="${data.messageId}"> <div id="acceptOffer">Accept Offer ${data.offerPrice}</div><div class="date"> ${data.sent_date} </div> </div> </div>`)
            lastConvo.after($acceptMessage)
        }

        if(data.counterOffer) {
            let $counterMessage = $(`<div class="conversation conversation-${isSenderMe(data.sender)}"> <div class="conversation-wrap"> <div class="conversation-image"><img src="..${data.profilePic}"></div> <div class="sub-title"> ${data.sender} </div> </div> <div class="messages" data-id="${data.messageId}"> <div id="offerprice">Sent Offer ${data.offerPrice}</div><div class="date"> ${data.sent_date} </div> </div> </div>`)
            lastConvo.after($counterMessage)
        }
    })
}