$(document).ready(function() {

    var searchBtn = $('#searchBtn');
    var apiKey = "48f07f111f9810c381221173c519ab88";
    var cityStats = $('#city-stats');
    var inputValues = [];


    // when search button is clicked, new button is created below it and value is sent to an array in local storage
    searchBtn.on('click', function(event) {
        event.preventDefault();

        var cityInput = $('#city-input').val().trim();

        // url for current weather data 
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityInput + "&appid=" + apiKey;

        // url for 5-day forecast
        var queryURL2 = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityInput + "&appid=" + apiKey;

        // Creates a new list item which will later have an event listenerk that will re-display data 
        var listCity = $('<button>');
        listCity.attr('class', 'list-group-item');
        listCity.text(cityInput);
        $('.list-group').append(listCity);
        listCity.attr('name', cityInput)
        listCity.attr('id', cityInput);

        localStorage.setItem(listCity.attr('name'), cityInput);

        function currentWeather() {
            // ajax call for the current weather data API
            $.ajax({
                url: queryURL,
                method: 'GET'

            }).then(function(response) {
                var tempF = (response.main.temp - 273.15) * 1.80 + 32;

                // adds data to card on the right of the page
                $('.card-title').text('In ' + response.name + ' today:');
                $('.temp').text('Temperature: ' + tempF.toFixed() + ' °F');
                $('.humidity').text('Humidity: ' + response.main.humidity + ' %');
                $('.wind').text('Wind Speed: ' + response.wind.speed + ' mph');
                $('.description').text('Description: ' + response.weather[0].description);
                lat = response.coord.lat;
                lon = response.coord.lon;


                // query URL for UV index 
                var queryURL3 = "http://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey;

                // ajax call for the UV index API
                $.ajax({
                    url: queryURL3,
                    method: 'GET'

                }).then(function(response) {

                    if (response.value < 3) {
                        $('.UV').css('background-color', 'green');
                    } else if (response.value < 5) {
                        $('.UV').css('background-color', 'yellow');
                    } else if (response.value < 7) {
                        $('.UV').css('background-color', 'orange');
                    } else {
                        $('.UV').css('background-color', 'red');
                    }

                    $('.UV-section').text('UV Index: ');
                    $('.UV').text(response.value);
                    $('.UV').css('visibility', 'visible');

                })

            })
        }
        currentWeather();


        function fiveDayForecast() {
            // ajax call for the 5-day forecast API
            $.ajax({
                url: queryURL2,
                method: 'GET'

            }).then(function(response) {
                var tempF = [];
                var weatherIcon = [];
                var day1 = response.list[2];
                var day2 = response.list[10];
                var day3 = response.list[18];
                var day4 = response.list[26];
                var day5 = response.list[34];

                $('.date1').text(day1.dt_txt[5] + day1.dt_txt[6] + '/' + day1.dt_txt[8] + day1.dt_txt[9] + '/' + day1.dt_txt[0] + day1.dt_txt[1]);
                $('.humidity1').text('Humidity: ' + day1.main.humidity + ' %');

                $('.date2').text(day1.dt_txt[5] + day2.dt_txt[6] + '/' + day2.dt_txt[8] + day2.dt_txt[9] + '/' + day2.dt_txt[0] + day2.dt_txt[1]);
                $('.humidity2').text('Humidity: ' + day2.main.humidity + ' %');

                $('.date3').text(day3.dt_txt[5] + day3.dt_txt[6] + '/' + day3.dt_txt[8] + day3.dt_txt[9] + '/' + day3.dt_txt[0] + day3.dt_txt[1]);
                $('.humidity3').text('Humidity: ' + day3.main.humidity + ' %');

                $('.date4').text(day4.dt_txt[5] + day4.dt_txt[6] + '/' + day4.dt_txt[8] + day4.dt_txt[9] + '/' + day4.dt_txt[0] + day4.dt_txt[1]);
                $('.humidity4').text('Humidity: ' + day4.main.humidity + ' %');

                $('.date5').text(day5.dt_txt[5] + day5.dt_txt[6] + '/' + day5.dt_txt[8] + day5.dt_txt[9] + '/' + day5.dt_txt[0] + day5.dt_txt[1]);
                $('.humidity5').text('Humidity: ' + day5.main.humidity + ' %');
                var count = 1;

                for (var i = 3; i < response.list.length; i += 8) {

                    // arrays that are being looped through and later displayed
                    tempF[i] = (response.list[i].main.temp - 273.15) * 1.80 + 32;
                    weatherIcon[i] = "http://openweathermap.org/img/w/" + response.list[i].weather[0].icon + ".png";
                    var indexEquals = count;

                    // changing the text on the page to dispaly the response elements
                    $('.icon' + indexEquals).attr('src', weatherIcon[i]);
                    $('.temp' + indexEquals).text('Temperature: ' + tempF[i].toFixed() + ' °F');
                    count++;
                }
            })
        }
        fiveDayForecast();

        // when click on any of the list group buttons, it displays the information for that city 
        $('#' + cityInput).on('click', function() {
            currentWeather();
            fiveDayForecast();
        })
    })



    // if (localStorage !== null){
    //     localStorage.getItem(listCity.attr('name'));

    // }

})