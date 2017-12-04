let jwtToken = store.get('jwtToken')

console.log("hi")
if (jwtToken) {
    let reqOpt = {
        url: '/auth/admin',
        headers: {'Authorization': store.get('jwtToken')},
        method: "POST"
    }

    console.log("in")
    axios(reqOpt)
      .then(res => {
          console.log("res", res)
      })
}