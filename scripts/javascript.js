let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

function init() {
    // setDataTemperatureInDay();
    setChartTemperature();
}

function setBackGroundCurrentTemperature() {
    let imageUrl = './images/rain.jpg';
    $('.current-temperature').css('background-image', 'url(' + imageUrl + ')');
}

function setDataTemperatureInDay() {
    let template = ` <div class="col-2">
    <div class="weather-icon"><img src="./images/rainbow.png"></div>
    <div class="time">12 PM</div>
    <div class="degree">32°</div>
</div>`;
    for (let i = 0; i < 6; i++) {
        $('.range-temperature').append(template);
    }
}

function setChartTemperature() {
    var ctx = document.getElementById('myChart').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
            datasets: [{
                data: [12, 19, 3, 5, 2, 3],
                backgroundColor: [
                    'rgba(0, 0, 0, 0)',
                    'rgba(0, 0, 0, 0)',
                    'rgba(0, 0, 0, 0)',
                    'rgba(0, 0, 0, 0)',
                    'rgba(0, 0, 0, 0)',
                    'rgba(0, 0, 0, 0)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 0
            }]
        },
        options: {
            events: [],
            scales: {
                xAxes: [{
                    display: false,
                    type: "category",
                    gridLines: {
                        display: false
                    },
                    offset: 1
                }],
                yAxes: [{
                    display: false,
                    gridLines: {
                        display: false
                    }
                }]
            },
            legend: {
                display: false
            }
        }
    });
}
init();