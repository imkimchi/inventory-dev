let jwtToken = store.get('jwtToken')
let user = window.location.href.split('/')[4].replace('#', '')

$(function () {
    if (jwtToken) {
        let reqOpt = {
            url: '/auth/decode',
            method: "POST",
            data: {jwt: jwtToken}
        }

        check(reqOpt)
    }
})

async function check (reqOpt) {
    let res = await axios(reqOpt)
    if(res.data.username != user) deleteClickable()
}

function deleteClickable() {
    $('p.icoplus').remove()
    $('#profilePic').off()
    $('#profilePic').on('click', (e) => {
        e.preventDefault()
    })
}