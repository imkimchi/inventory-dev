$('button.btn-block').click(async () => {
    let username = $('input[type="text"]').val()
    let password = $('input[type="password"]').val()

    let option = {
        url: '/admin/signin',
        method: "POST",
        data: {
            email: username,
            password: password
        }
    }

    let res = await axios(option)
    let jwtToken = res.data.token

    if(jwtToken) {
        store.set('jwtToken', jwtToken)
        document.cookie = `jwtToken=${jwtToken}`
        window.location = '/admin'
    } else {
        alert("로그인에 실패하였습니다.")
    }
})