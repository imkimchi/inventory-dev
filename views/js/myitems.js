myitem()

async function myitem() {
    let authOpt = {
        url: '/auth/decode',
        method: "POST",
        data: { jwt: store.get('jwtToken') }
    }
    
    let decodedData = await axios(authOpt)
    let username = decodedData.data.username
    let itemCount = decodedData.data.itemCount
    let profilePic = decodedData.data.profilePic

    console.log("decoded jwt is", decodedData.data)

    let posts = await axios.get(`/post/get/username/${username}`)

    $(document).ready(() => {
        $('.wardrobe-link span')[0].innerHTML = window.location.href.split('myaccount')[0] + username
        $('.username span')[0].innerHTML = username
        $('.bought-and-sold')[0].innerHTML = `Bought and Sold ${itemCount} Grails`
        $('.userimg img').attr('src', `..${profilePic}`)
        
        let width  = 575,
            height = 400,
            left = ($(window).width()  - width)  / 2,
            top = ($(window).height() - height) / 2,
            opts = 'status=1' +
                   ',width='  + width +
                   ',height=' + height +
                   ',top='    + top +
                   ',left='   + left;

        let userLink = $('.wardrobe-link span').text()
        $(document).on('click', '.twitter-share-button button', e => {
            window.open(`http://twitter.com/share?url=${userLink};text=Check out my profile on Inventory! `, 'twitter', opts);
            return false
        })
        $(document).on('click', '.facebook-share-button button', () => {
            window.open(`https://www.facebook.com/sharer/sharer.php?u=${userLink}`, 'facebook', opts)
            return false
        })


        let $postWrapper = $('.myitemsmb200')
        for(let i in posts.data) {
            let productCover = posts.data[i].productImage.cover
            let productURL = posts.data[i].productURL
            let productTitle = posts.data[i].productTitle
            let productSubTitle = posts.data[i].productSubTitle
            let productSize = posts.data[i].productSize
            let like = posts.data[i].like.likedCounts
            let productPrice = posts.data[i].productPrice
            let timeago = posts.data[i].timeAgo
            let context = `<div class="product"><a href="#"><div class="thumbnail"><img src="${productCover}" alt="Thumnail"><div class="hug-top"><div class="seller-buttons"><button>Bump</button><button>Price Drop 10%</button></div></div></div><div class="information"><ol><li><span class="product_name">${productSubTitle}</span></li><li><span class="short_desc">${productTitle}</span></li><li><span class="product_size">Size L</span></li><li class="price_row"><div class="price_row1"><div class="product_good"><span class="goodtog"><img class="goodico" src="../images/product_good_ico.png" alt="GOOD"><img style="display:none;" src="../images/product_good_ico2.png"></span><span class="count">${like}</span></div><div class="product_price"><img src="../images/product_dollar_ico.png" alt="GOOD"><span class="count">${productPrice}</span></div></div><div class="price_row2"><span class="write_date">${timeago}</span></div></li></ol></div></a></div>`
            $postWrapper.append(context)
        }
    })
}