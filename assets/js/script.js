
// Establishing few variables because Jquery's syntax is more concise than using query selectors.
var getHistory = JSON.parse(localStorage.getItem('allHistory')) || []
var setHistory = $('#search').val();

// Variable for API key
let key = '848c4b764968e7ce035cc64bf0cc2909'

//Loads current date in the header
$('h2').text(`${dayjs().format('MMMM DD, YYYY')}`)

//Loads search history from local storage
function renderSearchHistory() {
    for (let i = 0; i < getHistory.length; i++) {
        if (getHistory.length > 0 ) {
            $('#history').append(
                `<button class="history-btn">${getHistory[i]}</button>`
            )
        }
    }
};
renderSearchHistory();

//Event listener on button to search for a city name
$('#search-btn').on('click', function (event) {

    //Always preventDefault  
    event.preventDefault();

    //Fetch from openweather API search for current weather by city name
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${$('#search').val()}&appid=${key}&units=imperial`)
        .then(response => response.json())
        .then(data => {
            $('.city').text(`${data.name}`);
            $('.date').html(`${dayjs().format('MM/DD/YYYY')}`)
            $('.image').html(`<img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png">`)
            $('.temp').text('Temp: ' + Math.floor(data.main.temp) + '°F');
            $('.wind').text('Wind: ' + Math.floor(data.wind.speed) + 'mph')
            $('.humidity').text('Humidity: ' + data.main.humidity + '%');
        })
        .catch(err => alert('Oops! Try a different city!'));

    //Second fetch from openweather API search for weather forecast by city name
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${$('#search').val()}&appid=${key}&units=imperial`)
        .then(response => response.json())
        .then(data => {
            $('#five-day').html('');
            //For loop to load a more precise five-day forecast from API fetch
            for (let i = 5; i < 40; i += 8) {
                const fiveDayForecast = data.list[i];
                let dt = data.list[i].dt_txt
                $('#five-day').append(
                    `<div class = "five-day">
                        <p class="five-date">${dayjs(dt).format('MM/DD/YYYY')}</p><img src="https://openweathermap.org/img/wn/${data.list[i].weather[0].icon}.png">
                        <div class="five-details">
                            <p>Temp: ${Math.floor(data.list[i].main.temp)}°F</p>
                            <p>Wind: ${Math.floor(data.list[i].wind.speed)}mph</p>
                            <p>Humidity: ${data.list[i].main.humidity}%</p>
                        </div>
                    </div>` )
            }
        });



    //Setting current search to local storage
    if (!getHistory.includes(setHistory) && $('#search').val() !== '') { 
        getHistory.push(setHistory);
        localStorage.setItem('allHistory', JSON.stringify(getHistory));
        $('#history').append(
            `<button class="history-btn">${setHistory}</button>`)
    }
    $('#search').val('')

});

$('.history-btn').on('click', function (event) {

    event.preventDefault();

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${$(event.target).text()}&appid=${key}&units=imperial`)
        .then(response => response.json())
        .then(data => {
            $('.city').text(`${data.name}`);
            $('.date').text(`${dayjs().format('MM/DD/YYYY')}`)
            $('.image').html(`<img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png">`)
            $('.temp').text('Temp: ' + Math.floor(data.main.temp) + '°F');
            $('.wind').text('Wind: ' + Math.floor(data.wind.speed) + 'mph')
            $('.humidity').text('Humidity: ' + data.main.humidity + '%');
        })
        .catch(err => alert('Oops! Try a different city!'));

    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${$(event.target).text()}&appid=${key}&units=imperial`)
        .then(response => response.json())
        .then(data => {
            $('#five-day').html('');
            for (let i = 5; i < 40; i += 8) {
                const fiveDayForecast = data.list[i];
                let dt = data.list[i].dt_txt
                $('#five-day').append(
                    `<div class = "five-day">
                        <p class="five-date">${dayjs(dt).format('MM/DD/YYYY')}</p><img src="https://openweathermap.org/img/wn/${data.list[i].weather[0].icon}.png">
                        <div class="five-details">
                            <p>Temp: ${Math.floor(data.list[i].main.temp)}°F</p>
                            <p>Wind: ${Math.floor(data.list[i].wind.speed)}mph</p>
                            <p>Humidity: ${data.list[i].main.humidity}%</p>
                        </div>
                    </div>` )
            };
        });
        var setHistory = $('#search').val();
});

