let jwtToken = store.get('jwtToken')
const isSuccess = data => data.data === 'success'
let postURL = window.location.href.split('listings/')[1].replace('#', '')
const redirect = () => window.location = `/post/edit/${postURL}`

let alertText = {
    bump: {
        success: "Successfully Bumped Up The Post.",
        failed: "Failed to remove the post."
    },
    drop: {
        success: "Successfully Drop The Price ",
        failed: "Failed to Drop The Post."
    }
}

$(document).ready(() => {
    let jwtToken = store.get('jwtToken')
    let seller = $('h1.semi-bold a').text()

    if(jwtToken) isSeller(jwtToken, seller)
    else removeCommentSubmit()

    $(document).on('click', '.logintxt3', redirect)
    $(document).on('click', '.logintxt4', deletePost)
    $(document).on('click', '.bump', () => dropOrBump('bump'))
    $(document).on('click', '.drop', () => dropOrBump('drop'))
})

function removeCommentSubmit () {
    $('.comment-this-item').remove()
    $('.submit-this-comment').remove()
}

async function dropOrBump (choice) {
    let reqOpt = {
        url: `/post/${choice}`,
        method: 'post',
        headers: {'Authorization': store.get('jwtToken')},
        data: { url: postURL }
    }

    let res = await axios(reqOpt)
    console.log("res", res)

    if(isSuccess(res.data)) {
        alert(alertText[`${choice}`].success)
        window.location.reload()
    } else {
        alert(alertText[`${choice}`].failed)
    }
}

async function deletePost () {
    let confirmed = confirm("Are you sure you want to delete this post?")

    if(confirmed) {
        let reqOpt = {
            url: '/post/delete',
            method: 'post',
            headers: {'Authorization': store.get('jwtToken')},
            data: { url: postURL }
    }

    let res = await axios(reqOpt)

    if(isSuccess(res.data)) window.location = '/'
    else console.log("Failed to remove the post.")
    }
}

async function isSeller (jwtToken, seller) {
    let reqOpt = {
        url: '/auth/decode',
        method: "POST",
        data: { jwt: jwtToken }
    }

    let decodedData = await axios(reqOpt)
    let username = decodedData.data.username
    console.log("username:", username, "seller", seller)

    if(username === seller) {
        $('.pricebtnw').remove()
        let elem = $('<div class="logintxt"><div class="drop">Drop Price By 10%</div><div class="bump">Bump With Original Price</div><div class="logintxt3">Edit this posting</div><div class="logintxt4">Delete this posting now</div></div>')
        if(!bumpavailable) elem.find('.bump').remove()
        $('.listing-price').after(elem)
    }
}