$(".goodtog").click(async function (e) {
    e.preventDefault()
    $('img', this).toggle()

    let reqOpt = {
        url: '/post/like',
        method: 'post',
        headers: {'Authorization': store.get('jwtToken')},
        data: { productURL : $(this).closest('a').prop('href').split('/')[4]}
    }

    let res = await axios(reqOpt)

    let likedCount = $(this).eq(0).closest('.product_good').eq(0).find('.count')
    console.log("likedCount", likedCount)

    if(res.data.history) {
        console.log("true")
        let addedNum = Number(likedCount.text()) - 1
        console.log(likedCount.text(), addedNum)
        likedCount.text(addedNum)
    } else {
        console.log("false")
        let addedNum = Number(likedCount.text()) + 1
        console.log(likedCount.text(), addedNum)
        likedCount.text(addedNum)
    }
    e.preventDefault()
})