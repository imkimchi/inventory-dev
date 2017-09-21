let jwtToken = store.get('jwtToken')
let postURL = window.location.href.split('edit/')[1].replace('#', '')
const isApproved = res => res.data === 'approved'

let reqOpt = {
    url: '/auth/jwt',
    method: 'post',
    data: {
        jwt: jwtToken,
        url: postURL
    }
}

auth()

async function auth() {
    let res = await axios(reqOpt)
    if(!isApproved(res.data)) {
        alert('auth failed')
        window.history.back()
    }
}