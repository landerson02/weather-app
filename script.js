let infoElements;
let isF = true;
const form = document.querySelector('form');
const errorElement = document.getElementById('error');
form.addEventListener('submit', (city) => {
    const input = document.querySelector('input[type="text"]');
    const loc = input.value;
    city.preventDefault();
    getData(loc).then(r => handleData(r));
});

let error = () => {
    errorElement.classList.remove('invisible');
}
async function getData(city) {
    let r = await fetch(
        'https://api.weatherapi.com/v1/current.json?key=95272dc9fc27494996c55527230908&q=' + city,
        {mode: 'cors'});
    if(r.status === 400) {
        error();
    } else {
        return r.json()
        // .then((d)=> {
        //     handleData(d);
        // });
    }
}

function floorString(s) {
    return Math.floor(parseInt(s));
}

let data = {
    city: null,
    region: null,
    time: null,
    date: null,
    condition: null,
    tempF: null,
    tempC: null,
    feelsLikeF: null,
    feelsLikeC: null,
    isDay: null,
}
let getDate = (localtime) => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
        'September', 'October', 'November', 'December'];
    let month = localtime.substring(5, 7);
    let day = localtime.substring(8, 10);
    if(day[0]==='0') day = day[1];
    let last = day[day.length-1];
    return months[parseInt(month)-1] + " " + day + (last==='1'?'st':last==='2'?'nd':last==='3'?'rd':'th');
}

let getTime = (localtime) => {
    let hour = parseInt(localtime.substring(localtime.indexOf(' '), localtime.indexOf(':')));
    let mins = localtime.substring(localtime.indexOf(':')+1);
    let isAM = true;
    if(hour > 12) {
        isAM = false;
        hour%=12;
    }
    return hour + ':' + mins + (isAM ? 'AM' : 'PM');
}

let getCondition = (cond) => {
    const code = parseInt(cond);
    if(!data.isDay) return 'night';
    if(1003 <= code && code <= 1009) return 'cloudy';
    if(code===1030||code===1063||code===1135||code===1147||code===1150||
        (1180 <= code && code<= 1189) || (1198<=code && code<=1207)) return 'rain';
    if(code >= 1273) return 'thunderstorm';
    if(code===1000) return 'sunny';
    if(code===1171||code===1179|| (1207<=code && code<=1237)||(1252<=code && code<=1264)) return 'snow';
    return 'sunny';
}
let handleData = (d) => {
    data.city = d.location.name;
    data.region = d.location.country==='United States of America'?d.location.region : d.location.country;
    data.isDay = d.current.is_day;
    data.condition = getCondition(d.current.condition.code);
    data.date = getDate(d.location.localtime);
    data.time = getTime(d.location.localtime);
    data.tempC = floorString(d.current.temp_c) + '°C';
    data.tempF = floorString(d.current.temp_f) + '°F';
    data.feelsLikeC = d.current.feelslike_c + '°C';
    data.feelsLikeF = floorString(d.current.feelslike_f) + '°F';
    data.humidity = floorString(d.current.humidity) + '%';
    updateUI();
}

let getElements = () => {
    infoElements = {
        location: document.getElementById('location'),
        time: document.getElementById('time'),
        temp: document.getElementById('temp'),
        feelsLike: document.getElementById('feels-like'),
        humidity: document.getElementById('humidity'),
        main: document.getElementById('main'),
    }
}

let updateUI = () => {
    infoElements.location.textContent = data.city + ", " + data.region;
    infoElements.time.textContent = data.date + ", " + data.time;
    infoElements.temp.textContent = (isF ? data.tempF : data.tempC);
    infoElements.feelsLike.textContent = 'Feels Like: ' + (isF ? data.feelsLikeF : data.feelsLikeC);
    infoElements.humidity.textContent = 'Humidity: ' + data.humidity;
    infoElements.main.classList.remove(...infoElements.main.classList);
    console.log(data.condition);
    infoElements.main.classList.add(data.condition + 'BG');
}

getElements();