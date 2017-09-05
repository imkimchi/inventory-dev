$(document).ready(() => {
    $('#title_pic').on('click', e => {
        e.stopPropagation();
        $('#coverPhoto')[0].click()
    })

    $("#coverPhoto").change(function () { 
        readURL(this, 'cover') 
    })
    
    $('.subPhoto').change(function() {
        readURL(this, 'sub')
    })
})

function subButton(elem) {
    $(elem).find('.subPhoto')[0].click()
}

function readURL(input, elem) {
    let $picElem = $('#title_pic .image_box')
    let $subElem = $(input).parent()

    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = e => {
            if(elem === 'cover') {
                $picElem.css({
                    "background-image": `url('${e.target.result}')`,
                    "background-size": "cover"
                })
                sendImage(input)
            } else {
                $subElem.css({
                    "background-image": `url('${e.target.result}')`,
                    "background-size": "cover"
                })
                sendImage(input)
            }
        }
        reader.readAsDataURL(input.files[0]);
    }
}

async function sendImage(input) {
    let imageFile = $(input).prop('files')[0];
    let isCover = $(input).prop('id')

    let formData = new FormData()
    formData.append('pic', imageFile)
    
    let fetchOpt = {
        method: "POST",
        body: formData
    }

    try {
        let res = await fetch('/post/image', fetchOpt).then(res => res.json())

        if(isCover) imageObject.cover = res.url
        else imageObject.subpics.push(res.url)
        
        console.log(imageObject)
    } catch (e) {
        console.error("Failed to send Image Request", e)
    }
}