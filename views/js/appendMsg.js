appendMsg()

async function appendMsg() {
    let authOpt = {
        url: '/auth/decode',
        method: "POST",
        data: { jwt: store.get('jwtToken') }
    }
    
    let decodedData = await axios(authOpt)
    let username = decodedData.data.username

    let AllConvos = await axios.get(`/message/get/${username}`)
    console.log("username", username)
    $(document).ready(appendElements(username, AllConvos))
}

async function appendElements (username, AllConvos) {
    const getOpponent = (sender, arr) => buyOrsell(sender) === 'buy' ? arr.recipient : arr.sender
    const tidyDescription = desc => desc.length >= 133 ? `${desc.match(/.{1,133}/)} ...` : desc
    const buyOrsell = sender => sender === username ? "buy" : "sell"
    const isSenderMe = sender => sender === username ? "right" : "left"

    let $container = $('.conversations-wrapper')
    console.log(typeof AllConvos.data, AllConvos)

    for(let convo of AllConvos.data) {
            console.log(convo._id)
            let latestMessage = await axios.get(`/message/latest/${convo._id}`)
            let product = await axios.get(`/post/get/id/${convo._id}`)

            let messageId   = latestMessage.data.msg.messageId,
                sender      = latestMessage.data.convoStarter,
                opponent    = getOpponent(sender, latestMessage.data.msg),
                description = tidyDescription(latestMessage.data.msg.description),
                offerPrice  = latestMessage.data.msg.offerPrice,
                post        = product.data,
                timeAgo     = latestMessage.data.timeAgo

            console.log("post", post)

            let $convo = $(`<div class="mix conversation" data-id="${convo._id}" data-type="${buyOrsell(sender)}"> <div class="conversation-item"> <div class="conversation-listing-details-wrapper"> <div class="conversation-listing-details"> <a class="conversation-listing-link" href="./inventory/click_page.html" target="_blank"> <div class="conversation-listing-image" style="background-image:url(${post.productImage.cover});opacity:1;"></div> <div> <h2>${post.productSubTitle}</h2> <h3 class="sub-title">${post.productTitle}</h3> </div></a> </div> </div> <div class="toggleElem"> <div class="conversation-last-action"> <div class="activity-log-item-content"> <div class="messages"> <p>${description}</p> </div> </div> </div> <div class="conversation-details"> <h3 class="sub-title">${timeAgo}</h3> <h3 class="sub-title conversation-interlocutor"><a href="#">${opponent}</a></h3> </div> </div> </div> <div class="cover-conversation"> <!-- conversation--> <div class="conversation-item-cta" id="cate1" style="display: none;"> <div class="conversation-cta"> <div class="offer-cover pc"> <div class="offerbtn"> <div id="offerorder1"> offer </div> </div> <input class="offertxt"> <div class="submitbtn"> <a href="#">submit</a> </div> </div> <div class="offer-cover mobile"> <input class="offertxt"> <div class="offerbtn"> <div class="offeroder1" id="offerorder1"> offer </div> </div> <div class="submitbtn"> <a href="#">submit</a> </div> </div> <div class="arrup"><img src="../images/arr_up.png"></div> </div> </div><!-- conversation--><!-- offer--> <div class="offer-wrapper" id="offer1" style="display: none;"> <div class="arrup2"><img src="../images/arr_up2.png"></div><a class="close"></a> <h1>Make an Offer<span></span></h1> <p class="offertxt">Do not send payments offsite. If you do not pay through Grailed<br> you are not eligible for Grailed or PayPal Fraud Protection.</p> <div class="form-field offer-and-shipping"> <span>Offer + Shipping cost</span><label><input class="offer" name="offer" style="width:75px;" type="number" value="0">USD</label> </div> <div class="form-field"> <textarea cols="40" class="message" name="message" placeholder="All offer must include shipping cost. Shipping WILL NOT be added at checkout." rows="5"></textarea> </div> <div class="btnwrap"> <div class="offerSubmit"> <a href="#">submit</a> </div> </div> </div><!-- offer--> </div> </div>`)
            let AllMessages = await axios.get(`/message/list/${convo._id}`)
            
            for(let message of AllMessages.data) {
                let description =  message.description
                let sender = message.sender
                let sent_date = moment(message.createdDate).format('LT')

                let profilePic = message.profilePic
                let $message = $(`<div class="conversation conversation-${isSenderMe(sender)}"> <div class="conversation-wrap"> <div class="conversation-image"><img src="..${profilePic}"></div> <div class="sub-title"> ${sender} </div> </div> <div class="messages"> <div class="messagestxt"> ${description} </div> <div class="date"> ${sent_date} </div> </div> </div>`)
                let $offermessage = $(`<div class="conversation conversation-${isSenderMe(sender)}"> <div class="conversation-wrap"> <div class="conversation-image"><img src="..${profilePic}"></div> <div class="sub-title"> ${sender} </div> </div> <div class="messages"> <div class="messagestxt"> ${description} </div><div id="offerprice">Sent Offer $${offerPrice}</div><div class="date"> ${sent_date} </div> </div> </div>`)

                let lastConvos = $convo.find('.conversation')
                let container = $convo.find('.conversation-cta')

                if(offerPrice) {
                    if(lastConvos.length) lastConvos.last().after($offermessage)
                    else $offermessage.prependTo(container)
                } else {
                    console.log("$message", $message)
                    if(lastConvos.length) lastConvos.last().after($message)
                    else $message.prependTo(container)
                }
            }
            $container.append($convo)
        }
}
