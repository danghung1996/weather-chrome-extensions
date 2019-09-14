/*jshint esversion: 8 */
var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
var weatherData = [];

function init() {
    // setDataTemperatureInDay();

    getWeatherData();
    setCurrenDateTime();
}

function showLoadingData() {
    $('#loading').show();
    $('#current-temperature').hide();
    $('#range-temperature').hide();
    $('#temperature-next-day').hide();
}

function hideLoadingData() {
    $('#loading').hide();
    $('#current-temperature').show();
    $('#range-temperature').show();
    $('#temperature-next-day').show();
}

function badgeChrome(value) {
    chrome.browserAction.setBadgeText({
        text: value + "°C"
    });
    chrome.browserAction.setBadgeBackgroundColor({
        color: [252, 127, 3, 3]
    });
}

function setCurrenDateTime() {
    let d = new Date();
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let day = d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear();
    if (day.toString().length < 2) {
        day = '0' + day;
    }
    $('.current-date').text(`${day}, ${month} ${year}`);
}

function getWeatherData() {
    let key_APIs = '1ca1ecba3aec95a76856113ff0f9c40a';
    let lat = '21.0189333';
    let long = '105.550793';
    let api_url = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&APPID=faeb7373311c58f4a844d89609013d3f`;
    $.ajax({
        type: "get",
        url: api_url, // Gets the constructed url
        dataType: "json",
        contentType: 'application/json',
        success: async function (data) {
            let result = await detectDataWeather(data.list);
            console.log(weatherData);
            generateData();
            generateChart();
            setDataTemperatureNextDay();
        },
        error: function (err) {}
    });
}

function generateData() {
    generateCurrentTemperature();
}

function generateCurrentTemperature() {
    let currentTime = new Date().getHours();
    let currentDate = new Date().getDate();
    let temperature = '';
    let index = 0;
    for (let i = 0; i < weatherData.length; i++) {
        if (currentDate == parseInt(weatherData[i][0].dt_txt.toString().split(' ')[0].split('-')[2])) {
            index = i;
            break;
        }
    }
    for (let i = 0; i < weatherData[index].length; i++) {
        if (currentTime > 22) {
            temperature = parseInt(weatherData[parseInt(index) + 1][0].main.temp - 273.15);
        } else {
            if ((currentTime == (parseInt(weatherData[index][i].dt_txt.toString().split(' ')[1].split(':')[0]))) ||
                (currentTime == (parseInt(weatherData[index][i].dt_txt.toString().split(' ')[1].split(':')[0]) + 1)) ||
                (currentTime == (parseInt(weatherData[index][i].dt_txt.toString().split(' ')[1].split(':')[0]) - 1))) {
                temperature = parseInt(weatherData[0][i].main.temp - 273.15);
                break;
            }
        }
    }
    badgeChrome(temperature);
    $('.detail-current-temperature').text(temperature + ' °');
}

function detectDataWeather(data) {
    let today = data[0].dt_txt.toString().split(' ')[0].split('-')[2];
    let weatherDate = [];
    for (let i = 0; i < data.length; i++) {
        let nextDay = data[i].dt_txt.toString().split(' ')[0].split('-')[2];
        if (nextDay == today) {
            weatherDate.push(data[i]);
        } else {
            weatherData.push(weatherDate);
            weatherDate = [];
            weatherDate.push(data[i]);
        }
        today = nextDay;
    }
    return 0;
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

function setDataTemperatureNextDay() {
    let currentDate = new Date().getDate();
    let index = 0;
    for (let i = 0; i < weatherData.length; i++) {
        if (currentDate == parseInt(weatherData[i][0].dt_txt.toString().split(' ')[0].split('-')[2])) {
            index = i;
            break;
        }
    }

    for (let i = index + 1; i < index + 4; i++) {
        let min = parseInt(weatherData[i][0].main.temp_min - 273.15);
        let max = parseInt(weatherData[i][0].main.temp_max - 273.15);
        for (let j = 0; j < weatherData[i].length; j++) {
            if (parseInt(weatherData[i][j].main.temp_min - 273.15) < min) {
                min = parseInt(weatherData[i][j].main.temp_min - 273.15);
            }
            if (parseInt(weatherData[i][j].main.temp_min - 273.15) > max) {
                max = parseInt(weatherData[i][j].main.temp_min - 273.15);
            }
        }
        let template = `
        <div class="col-4">
            <div class="big-weather-icon"><img src="./images/big-rainbow.png"></div>
            <div class="big-time">${new Date(weatherData[i][0].dt_txt).toString().split(' ')[0]}</div>
            <div class="big-degree"><span class="min-temperature">${min}°</span>/ ${max}°</div>
        </div>`;

        $('.temperature-next-day').append(template);
    }
}

function generateChart() {
    let label = [];
    let data = [];
    let backgroundColor = [];
    let borderColor = [];
    let currentDate = new Date().getDate();
    for (let i = 0; i < weatherData.length; i++) {
        if (currentDate == parseInt(weatherData[i][0].dt_txt.toString().split(' ')[0].split('-')[2])) {
            index = i;
            break;
        }
    }
    for (let i = 0; i < weatherData[index].length; i++) {
        label.push(parseInt(weatherData[index][i].dt_txt.toString().split(' ')[1].split(':')[0]) + ':00');
        data.push(parseInt(weatherData[index][i].main.temp - 273.15));
        backgroundColor.push('rgba(23, 41, 99, 1)');
        borderColor.push('rgba(23, 41, 99, 1)');
    }
    let ctx = document.getElementById('myChart').getContext('2d');
    let myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: label,
            datasets: [{
                label: '',
                data: data,
                backgroundColor: backgroundColor,
                borderColor: borderColor,
                borderWidth: 4
            }]
        },
        options: {
            scales: {
                xAxes: [{
                    display: true,
                    type: "category",
                    gridLines: {
                        display: false
                    },
                    offset: 6
                }],
                yAxes: [{
                    display: false,
                    gridLines: {
                        display: false
                    },
                    ticks: {
                        beginAtZero: true
                    }
                }]
            },
            legend: {
                display: false
            },
            animation: {
                onProgress: function () {
                    let ctx = this.chart.ctx;
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'top';
                    ctx.fillStyle = "white";
                    this.data.datasets.forEach(function (dataset) {
                        for (let i = 0; i < dataset.data.length; i++) {
                            let model = dataset._meta[Object.keys(dataset._meta)[0]].data[i]._model;
                            ctx.fillText(dataset.data[i] + '°C', model.x, model.y + 10);
                        }
                    });
                }
            }
        }
    });
}
init();