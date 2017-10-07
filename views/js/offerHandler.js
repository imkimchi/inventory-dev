let socket = io().connect()
let jwtToken = store.get('jwtToken')

const sendToServer = (convoId, inputText, offerPrice) => socket.emit('offer', {desc: inputText, offerPrice: offerPrice, id: convoId, jwt: jwtToken})

$(document).on('click', '#accept', function() {
    let convoId = $(this).closest('.mix').attr('data-id')
    sendToServer(convoId)
})

$(document).on('click', '#counter', function() {
    sendToServer(convoId)
})