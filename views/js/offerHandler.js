let socket = io.connect({'transports': ['websocket', 'polling']})
let jwtToken = store.get('jwtToken')

const sendToServer = (convoId, inputText, offerPrice, identifier) => socket.emit('offer', {desc: inputText, offerPrice: offerPrice, id: convoId, identifier: identifier,jwt: jwtToken})

$(document).on('click', '#accept', function() {
    let convoId = $(this).closest('.mix').attr('data-id')
    sendToServer(convoId, "", undefined, "accept")
    $('.buttons').remove()
})

$(document).on('click', '#counter', function() {
    let convoId = $(this).closest('.mix').attr('data-id')
    $('.modal').css('display', 'block')
    $('.modal').attr('data-id', convoId)
})

$(document).on('click', '.buy-noww', function (e) {
    e.preventDefault()

    let convoId = $(this).closest('.mix').attr('data-id')
    $('.one').css('display', 'flex')
    $('.one').attr('data-id', convoId)
})

$(document).on('click', '.buy-now-x', function () {
    $('.one').css('display', 'none')
    $('.shipform-wrapper input').val('')
    $('.shipform-wrapper option[value=""]').prop('selected', true)
})

$(document).on('click', '#shipping-btn', function (e) {
    e.preventDefault()
    let convoId = $(this).closest('.one').attr('data-id')
    let productUrl = $(`.mix[data-id="${convoId}"]`).attr('data-url')
    window.location.href = `/listings/${productUrl}`
})

$(document).on('click', '.counter_container i', function () {
    let convoId = $(this).closest('.mix').attr('data-id')
    $('.modal').css('display', 'none')
    $('.modal').attr('data-id', "")
})

$(document).on('click', '#counter-button', function () {
    let convoId = $(this).closest('.modal').attr('data-id')
    let inputText = $(this).closest('.modal').find('#message').val()
    let offerPrice = $(this).closest('.modal').find('#offer').val()

    if(inputText.length > 0 && offerPrice.length > 0) sendToServer(convoId, inputText, offerPrice, "counter")

    $(this).closest('.modal').find('#message').val('')
    $(this).closest('.modal').find('#offer').val('')
    $('.modal').css('display', 'none')
    $('.modal').attr('data-id', "")
    $('.buttons').remove()
})