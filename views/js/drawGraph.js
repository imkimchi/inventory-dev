$(function() {
let genderChart = new Chart(document.getElementById("chart-area"), {
            type: 'pie',
            data: {
              labels: ["Male", "Female"],
              datasets: [
                {
                  backgroundColor: ["#3F51B5", "#E91E63"],
                  data: [0, 0]
                  }
              ]
            },
            option: {
              tooltips: { bodyFontSize: 20 }
            }
        });

let countryChart = new Chart(document.getElementById("chart-country"), {
            type: 'pie',
            data: {
              labels: ["US", "CANADA", "ASIA"],
              datasets: [
                {
                  backgroundColor: ["#3F51B5", "#F44336", "#FFC107"],
                  data: [50, 220, 10],
                  }
              ]
            },
            option: {
              tooltips: { bodyFontSize: 20 }
            }
        })

let socket = io()

socket.emit('online', "ONLINE SEX BRO")


socket.on('users', data => {
    function addToChart (gender) {
        genderChart.data.datasets[0].data[gender] += 1
        genderChart.update()
    }

    function subToChart (gender) {
        genderChart.data.datasets[0].data[gender] -= 1
        genderChart.update()
    }

    $('.online-user h1').text(`${data.onlineUsers} 명`)

    if(typeof data.jwt === 'object') {
        console.log(data.action, data.action === 'enter')
        if(data.action === 'enter') {
            if(data.jwt.gender === 'Male') addToChart(0)
            else addToChart(1)
        } else {
            let count = genderChart.data.datasets[0].data
            if(data.jwt.gender === 'Male') {
                if(count[0] === 0) return false
                else subToChart(0)
            } else {
                if(count[1] === 0) return false
                else subToChart(0)
            }
        }
    } 
})
})
