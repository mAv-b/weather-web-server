const btn = document.getElementById('search-btn');
btn.addEventListener('click', function(){
    const inputText = document.getElementById('search');
    requestWeather(inputText);
});

document.querySelector('body').onload = function(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition((pos)=>{
            const str = pos.coords.longitude +','+ pos.coords.latitude;
            requestWeather({value:undefined},str);
        })
    }
    else{
        alert('Geolocation is no Avaiable');
    }
}

function requestWeather(txt,txtNotInput){
    const param = (txt.value||txtNotInput);
    const path = './map/search/' + param;
    fetch(path)
        .then(data=>data.json())
        .then(data=>{
            const nodeActualTime = document.getElementById('actual-time');
            const nodeLastObservation = document.getElementById('last-observation');
            const nodeLocalPlace = document.getElementById('place-name');
            const nodeWeatherDescription = document.getElementById('description-weather');
            const nodeLatitude = document.getElementById('latitude-local');
            const nodeLongitude = document.getElementById('longitude-local');
            const nodeTemperature = document.getElementById('main-temperature-card');
            const nodeWeatherIcon = document.getElementById('weather-icon');
            const nodeFeelsLike = document.getElementById('feelslike-temperature');
            const nodePrecip = document.getElementById('precip');
            const nodeWindStuff = document.getElementById('wind-stuff');
            const nodeInfoName = document.getElementById('info-name');
            const nodeInfoLat = document.getElementById('info-lat');
            const nodeInfoLong = document.getElementById('info-long');
            const nodeInfoHumidity = document.getElementById('info-humidity');
            const nodeInfoCloudCover = document.getElementById('info-cloudcover');
            const nodeInfoUvLevel = document.getElementById('info-uvlevel');
            const nodeInfoWindSpeed = document.getElementById('info-windspeed');
            const nodeInfoWindDegree = document.getElementById('info-winddegree');
            const nodeInfoWindDirection = document.getElementById('info-winddirection');

            document.getElementById('local-str').textContent = data.location.split(',')[0];

            createMap(data.coords);
            createNews(data.local_news);
            createReeds(data.reedsJSON);
            const getDayName = (day)=>{
                //fix this
                const arr = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
                return arr[day];
            };
            const localNameParser = (local)=>{
                const arr = local.split(',');
                if(arr[0].trim()===arr[1].trim()){
                    const strArr = arr[1].trimStart().split(' ');
                    arr[1] = strArr[0][0] + strArr[1][0];
                }
                return arr[0]+', '+arr[1];
            }
            with(data){
                const dayWeek = new Date(actualDate).getDay()+1;
                document.querySelector('body').style.backgroundImage = `url('${img[1]}')`;
                nodeActualTime.textContent = actualTime;
                nodeLastObservation.textContent = getDayName(dayWeek) + ' ' + observationTime + ' (UTC 0)';
                nodeLocalPlace.textContent = localNameParser(location);
                nodeWeatherDescription.textContent = weather_descriptions;
                nodeLatitude.textContent = latitude.toFixed(2);
                nodeLongitude.textContent = longitude.toFixed(2);
                nodeTemperature.innerHTML = temperature + '<span>°C</span>';
                nodeWeatherIcon.src = img[0];
                nodeFeelsLike.textContent = feelslike;
                nodePrecip.textContent = precip+'%';
                nodeWindStuff.textContent = wind_dir + ' ' + wind_speed + 'km/h';
                nodeInfoName.textContent = location;
                nodeInfoLat.textContent = latitude;
                nodeInfoLong.textContent = longitude;
                nodeInfoHumidity.textContent = humidity;
                nodeInfoCloudCover.textContent = cloudcover;
                nodeInfoUvLevel.textContent = uv_index;
                nodeInfoWindSpeed.textContent =  wind_speed;
                nodeInfoWindDegree.textContent = wind_degree;
                nodeInfoWindDirection.textContent = wind_dir;
            };
    });
}

function createMap(coords){
    mapboxgl.accessToken = 'pk.eyJ1IjoibWFyay1sMDkiLCJhIjoiY2wwNng1Z2dyMWx0ZDNqbWpyYTJibDJnZCJ9.lYLSXCqKvJjpzTreoGWerQ';
    const map = new mapboxgl.Map({
        container: 'map', // container ID
        style: 'mapbox://styles/mapbox/streets-v11', // style URL
        center: coords, // starting position [lng, lat]
        zoom: 8 // starting zoom
    });
}

function createNews(news){
    const container = document.getElementById('list-news');
    for(let item of news){
        const element = document.createElement('a');
        const imgElement = document.createElement('img');
        const titleElement = document.createElement('p');
        element.className = 'item-news';
        titleElement.textContent = item.title;
        if(item.media)imgElement.src = 'http://static01.nyt.com/'+item.media.url;
        element.href = item.url;
        element.appendChild(imgElement);
        element.appendChild(titleElement);
        container.appendChild(element);
    }
}

function createReeds(reeds){
    const container = document.getElementById('list-reed');
    for(let item of reeds){
        const element = document.createElement('a');
        const imgElement = document.createElement('img');
        const titleElement = document.createElement('p');
        element.className = 'item-reed';
        titleElement.textContent = item.title._text;
        if(item.media)imgElement.src = (item.media._attributes.url).replace('s','');
        element.href = item.link._text;
        element.appendChild(imgElement);
        element.appendChild(titleElement);
        container.appendChild(element);
    }
}