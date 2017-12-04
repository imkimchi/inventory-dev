$('.btnModify').click(function() {
    let username = $(this).closest('.center').find('.font-eng').text()
    $('#myModal').attr("data-username", username)
})

$('.close').click(function() {
    $('#myModal').attr("data-username", "")
})

$('.modal-footer button').click(async function() {
    let days = $(this).closest('.modal-content').find('input').val().replace(' ', '')
    let username = $(this).closest('#myModal').attr('data-username')

    let option = {
        method: 'POST',
        url: '/account/block',
        data: { username: username, days: days}
      }

    console.log(option.data)

    let res = await axios(option)
    console.log("res", res.data)
    $('#myModal').attr("data-username", "")
})

