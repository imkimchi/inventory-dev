

$(function() {
    const ifTheresComment = () => $('.comment-box').length
    if(ifTheresComment()) $('p.no-comments').remove()
    $('.comment-this-item input').keypress(function (e) {
        let key = e.which || e.keyCode;
        if (key === 13) submitHandler()
    })
    $('.submit-this-comment').click(function () {
        submitHandler()
    })
})

function submitHandler (e) {
    console.log("clicked nigga")
    let text = $('.comment-this-item input').val()
    if(text.length > 0) {
        appendMsg()
        sendMsgToServer()
    }
}

function appendMsg () {
    const ifTheresComment = () => $('.comment-box').length

    let data = store.get('userInfo')
    let profileURL = data.profilePic
    let username = data.username
    let text = $('.comment-this-item input').val()
    let element = $(`<div class="comment-box"><div class="comment-profile_pic"><img src=${profileURL}></div><div class="comment-profile_name"><span>${username}</span></div><div class="comment-text"><span>${text}</span></div></div>`)

    if(ifTheresComment()) $('.comment-box').last().after(element)
    else $('.comments-top').after(element)

    $("html, body").animate({ scrollTop: $(document).height()-$(window).height() })
}

async function sendMsgToServer () {
    let text = $('.comment-this-item input').val()
    let jwtToken = store.get('jwtToken')
    let postURL = window.location.href.split('/')[4].replace('#', '')

    let reqOpt = {
        url: '/post/comment',
        method: 'post',
        headers: {'Authorization': store.get('jwtToken')},
        data: {
            description: text,
            postURL: postURL
        }
    }
    $('.comment-this-item input').val('')
    let data = await axios(reqOpt)

    return data
}