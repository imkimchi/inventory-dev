$(() => {
    $('.submit-this-comment').click(async (e) => {
        e.preventDefault()
        appendMsg()
        sendMsgToServer()
    })
})

const ifTheresComment = () => $('.comment-box').length

function appendMsg () {
    let data = store.get('userInfo')
    let profileURL = data.profilePic
    let username = data.username
    let text = $('.comment-this-item input').val()
    let element = $(`<div class="comment-box"><div class="comment-profile_pic"><img src=${profileURL}></div><div class="comment-profile_name"><span>${username}</span></div><div class="comment-text"><span>${text}</span></div></div>`)

    if(ifTheresComment()) $('.comment-box').after(element)
    else $('.comments-top').after(element)
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