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
    const sendChat = (inputText, convoId) => socket.emit('chat', {desc: inputText, id: convoId, jwt: jwtToken})
    
    let convoHistory = []
    let socket = io().connect()

    $(document).on('click', '.toggleElem', function(e) {
        e.preventDefault()
        let convoId = $(this).closest('.mix').attr('data-id')
        let isHidden = $(this).closest('.mix').find('.conversation-item-cta').css('display')
        let latestConvo = [...convoHistory].pop()

        if(convoHistory.length) socket.emit('quit', latestConvo)
        if(latestConvo === convoId) {
            return false
        } else {
            socket.emit('channel', convoId)
            convoHistory.push(convoId)
        }
    })

    $(document).on('click', ".submitbtn a", function (e) {
        e.preventDefault()
        let inputText = $(this).closest('.conversation-cta').find('input').val()
        let convoId = $(this).closest('.mix').attr('data-id')
        if(inputText.length > 0) sendChat(inputText, convoId)
        else return false
    })
    
    $(document).on('click', ".offerSubmit", function (e) {
        e.preventDefault()
        let inputText = $('.message').val()
        let offerPrice = $('#offer').val()
        let convoId = $(this).closest('.mix').attr('data-id')
        if(inputText.length > 0 && offerPrice.length > 0) sendChat(inputText, convoId)
        else return false
    })

    socket.on('message', data => {
        console.log("incoming message:", data)
        let $message = $(`<div class="conversation conversation-${isSenderMe(data.sender)}"> <div class="conversation-wrap"> <div class="conversation-image"><img src="..${data.profilePic}"></div> <div class="sub-title"> ${data.sender} </div> </div> <div class="messages"> <div class="messagestxt"> ${data.description} </div> <div class="date"> ${data.sent_date} </div> </div> </div>`)
        let lastConvo = $(`[data-id=${data.convoId}]`).find('.conversation').last()
        lastConvo.after($message)
    })
}  