let infoElements;
let isF = true;

async function getData(city) {
    let r = await fetch(
        'http://api.weatherapi.com/v1/current.json?key=95272dc9fc27494996c55527230908&q=' + city,
        {mode: 'cors'});
    if(r.status === 400) {
        console.error('failed to fetch');
    } else {
        r.json()
        .then((d)=> {
            handleData(d);
        });
    }
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
    let hour = parseInt(localtime.substring(11, 13));
    let mins = localtime.substring(14, 16);
    let isAM = true;
    if(hour > 12) {
        isAM = false;
        hour%=12;
    }
    return hour + ':' + mins + (isAM ? 'AM' : 'PM');
}
let handleData = (d) => {
    console.log(d);
    data.city = d.location.name;
    data.region = d.location.region;
    data.condition = d.current.condition.text;
    data.date = getDate(d.location.localtime);
    data.time = getTime(d.location.localtime);
    data.tempC = d.current.temp_c;
    data.tempF = d.current.temp_f;
    data.isDay = d.current.is_day;
    data.feelsLikeC = d.current.feelslike_c;
    data.feelsLikeF = d.current.feelslike_f;
    data.humidity = d.current.humidity + '%';
    console.log(data);
    updateUI();
}

let getElements = () => {
    infoElements = {
        location: document.getElementById('location'),
        time: document.getElementById('time'),
        temp: document.getElementById('temp'),
        feelsLike: document.getElementById('feels-like'),
        humidity: document.getElementById('humidity'),
    }
}

let updateUI = () => {
    infoElements.location.textContent = data.city + ", " + data.region;
    infoElements.time.textContent = data.date + ", " + data.time;
    infoElements.temp.textContent = isF ? data.tempF : data.tempC;
    infoElements.feelsLike.textContent = isF ? data.feelsLikeF : data.feelsLikeC;
    infoElements.humidity.textContent = data.humidity;
}
