const isMainPage = () => window.location.pathname.length === 1

$(document).on("click", ".goodtog", async function (e) {
    e.preventDefault()
    $('img', this).toggle()

    let productURL = $(this).closest('a').prop('href') && $(this).closest('a').prop('href').split('/')[4]
    let currentURL = window.location.href.split('/')[4]

    let reqOpt = {
        url: '/post/like',
        method: 'post',
        headers: {'Authorization': store.get('jwtToken')},
        data: { productURL : isMainPage() ? productURL : currentURL}
    }

    console.log(reqOpt.data.productURL)

    let res = await axios(reqOpt)

    let likedCount = $(this).eq(0).closest('.product_good').eq(0).find('.count')
    let countInListing = $(this).closest('.listing-price').find('.ptxt').eq(1)
    let currentPage = isMainPage() ? likedCount : countInListing

    changeNumText(res, currentPage)
    e.preventDefault()
})

function changeNumText(res, countElem) {
    console.log(countElem, countElem.text(), Number(countElem.text()))
    if(res.data.history) {
        let addedNum = Number(countElem.text()) - 1
        console.log(countElem.text(), "added", addedNum)
        countElem.text(addedNum)
    } else {
        let addedNum = Number(countElem.text()) + 1
        console.log(countElem.text(), "added", addedNum)
        countElem.text(addedNum)
    }
}