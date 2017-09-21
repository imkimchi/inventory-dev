const elemSelector = elem => elem === 'cover' ? $('#coverPic') : $('#profilePic')
const isCover = id => id === 'coverPic'

let imageObject = {
    profilePic: "",
    coverPic: ""
}

$(document).ready(() => {
    $('#coverPicSelect').on('click', e => {
        e.stopPropagation();
        $('#coverPicInput')[0].click()
    })

    $('#profilePic').on('click', e => {
        e.stopPropagation();
        $('#profilePicInput')[0].click()
    })

    $("#coverPicInput").change(function () { 
        readURL(this, 'cover') 
    })

    $("#profilePicInput").change(function () { 
        readURL(this, 'profile') 
    })
})

function readURL(input, elem) {
    let $elem = elemSelector(elem)
    
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = e => {
            $elem.attr('src', e.target.result)
            sendImage(input)
        }
        reader.readAsDataURL(input.files[0]);
    }
}

async function sendImage(input) {
    let imageFile = $(input).prop('files')[0]
    let elementId = $(input).prop('id').replace('Input', '')

    let formData = new FormData()
    formData.append(elementId.toLowerCase(), imageFile)
    
    let fetchOpt = {
        method: "POST",
        headers: {Authorization: store.get('jwtToken')},
        body: formData
    }

    try {
        console.log("formadata is", fetchOpt.body)
        let res = await fetch('/user/image', fetchOpt).then(res => res.json())
        console.log("res is", res)
    } catch (e) {
        console.error("Failed to send Image Request", e)
    }
}