jQuery(document).ready(function($) {
    const validateEmail = email => /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)
    
    $("#join-btn").click(async e => {
        e.preventDefault()
        
        let payload = {
            username: $('#username').val(),
            password: $('#password').val(),
            email: $('#email').val(),
            country: $('#CountriesDropDownList').val(),
            firstname: $('#firstname').val(),
            lastname: $('#lastname').val(),
            gender: $('#genderDropDownList').val(),
            address1: $('#address1').val(),
            zipcode: $('#zipcode').val(),
            mobile: $('#mobile').val(),
            newsletter: newsLetter()
        }

        for(let q in payload) {
            if(!payload[q]) {
                alert(q +"is not defined")
                return false
            }
        }

        if(payload.mobile.match(/[a-zA-Z]/g)) {
            alert('This phone number format is not recognized. Please check the number.')
            return false
        } 
        if(payload.password != $('#password2').val()) {
            alert("These passwords don't match. Try again?")
            return false
        }
        if(!validateEmail(payload.email)) {
            alert("Please use only letters (a-z), numbers, and periods.")
            return false
        }

        let option = {
	        method: "POST",
	        headers: {
		      'Content-Type': 'application/json'
		    },
		    body: JSON.stringify(payload)
        }
            
        try {
            await fetch('/signup', option)
            window.location = '/mypage/login.html'
        } catch (e) {
            console.error("failed to send signup request", e)
        }
    })

    //login
    $("#login-btn").click(async e => {
        e.preventDefault()

        let payload = {
            email: $('#username').val(),
            password: $('#password').val(),
        }

        let loginOpt = {
            method: "POST",
            url: '/login',
		    data: payload
        }

        let mpOpt = {
            method: "GET",
            url: `/u/${payload.email}`,
            header: store.get('jwtToken')
        }

        for(let i in payload) {
            if(!payload[i]) {
                alert("Please Enter" + i)
            }
        }

        try {
            let res = await axios(loginOpt)
            if(res.data.message) {
                alert(res.data.message)
            } else {
                await store.set('jwtToken', res.data.token)
                await store.set('userInfo', await getUserInfo())
                document.cookie = `jwtToken=${store.get('jwtToken')};path=/`
                window.location = '/'
            }
        } catch (e) {
            console.error("failed to send login request", e)
        }
    })
})

async function getUserInfo () {
    let reqOpt = {
        url: '/auth/decode',
        method: "POST",
        data: { jwt: store.get('jwtToken') }
    }

    let res = await axios(reqOpt)
    return res.data
}

function newsLetter() {
    let receive = $('#checkbox_want')
    let notReceive = $('#checkbox_nowant')

    if (receive.is(':checked')) return true
    if (notReceive.is(':checked')) return false
}