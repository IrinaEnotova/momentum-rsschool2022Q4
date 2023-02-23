// Time

const lang = document.querySelector('.language');

function showTime() {
    const time = document.querySelector('.time');
    const date = new Date();
    const currentTime = date.toLocaleTimeString();
    
    time.textContent = currentTime;

    setTimeout(showTime, 1000);
  }

const city = document.querySelector('.city');
city.value = 'Minsk';

showTime();
showGreeting();
showDate();
getWeather();

// Date (вызов функции внутри showTime())

function showDate(lang = 'EN') {
    const date = new Date();
    const options = {weekday: 'long', month: 'long', day: 'numeric'};
    let currentDate;
    if(lang == 'EN') {
        currentDate = date.toLocaleDateString('en-EN', options);
    }
    else if(lang == 'RU') {
        currentDate = date.toLocaleDateString('ru-RU', options);
    }
    document.querySelector('.date').textContent = currentDate;
}

// Greeting

function getHours() {
    const date = new Date();
    const hours = date.getHours();

    return hours;
}

function getTimeOfDay() {
    let hours = getHours();
    let timeOfDay = '';

    if(hours >= 0 && hours < 6) {
        timeOfDay += 'night';
    }
    else if(hours >= 6 && hours < 12) {
        timeOfDay += 'morning';
    }
    else if(hours >= 12 && hours < 18) {
        timeOfDay += 'afternoon';
    }
    else {
        timeOfDay += 'evening';
    }
    return timeOfDay;
}

function showGreeting(lang = 'EN') {
    let timeOfDay = getTimeOfDay();
    let name = document.querySelector('.name'); 

    if(lang == 'EN') {
        let greeting = `Good ${timeOfDay}`;
        document.querySelector('.greeting').textContent = greeting; 
        name.placeholder = 'Name';
    }
    if(lang == 'RU') {
        let greeting;
        if(timeOfDay === 'night') {
            greeting = greetingTranslation.russianNight;
        }
        else if(timeOfDay === 'morning') {
            greeting = greetingTranslation.russianMorning;
        }
        else if(timeOfDay === 'afternoon') {
            greeting = greetingTranslation.russianAfternoon;
        }
        else if(timeOfDay === 'evening') {
            greeting = greetingTranslation.russianEvening;
        }
        document.querySelector('.greeting').innerHTML = greeting;
        name.placeholder = 'Имя';
    }  
}

function setLocalStorage() {
    let name = document.querySelector('.name');
    let todoItems = document.querySelectorAll('.tasks-item');
    let todoArray = [];

    if(todoItems.length !== 0) {
        for(let i = 0; i < todoItems.length; i++) {
            if(!todoItems.item(i).classList.contains('complete')) {
                todoArray.push(todoItems.item(i).textContent); 
            }
        }
    }

    todoListStorage = todoArray.join("^");

    localStorage.setItem('name', name.value);
    localStorage.setItem('city', city.value);
    localStorage.setItem('lang', lang.innerHTML);
    localStorage.setItem('todo', todoListStorage);
}

  window.addEventListener('beforeunload', setLocalStorage);

function getLocalStorage() {
    let name = document.querySelector('.name');

    if(localStorage.getItem('todo')) {
        let todoArray = localStorage.getItem('todo').split("^");

        for(let i = 0; i < todoArray.length; i++) {
            let li = document.createElement('li');
            let div = document.createElement('div');
            let cross = document.createElement('img');
            cross.src = './assets/svg/iconsCancel.svg';
            cross.classList.add('cross');
            div.classList.add('task-div');
            li.appendChild(div);
            li.appendChild(cross);
            li.classList.add('tasks-item');
            li.classList.add('incomplete');
            div.textContent = todoArray[i];
            if(div.textContent !== '') {
                tasksList.appendChild(li);
            }
            taskInput.value = '';
        }
    }

    if(localStorage.getItem('name')) {
      name.value = localStorage.getItem('name');
    }
    
    if(localStorage.getItem('city')) {
        city.value = localStorage.getItem('city');
        getWeather();
    }

    if(localStorage.getItem('lang')) {
        lang.innerHTML = localStorage.getItem('lang');
        if (lang.innerHTML === 'RU') {
            lang.innerHTML = 'RU';
            showGreeting('RU');
            getWeather('RU');
            showDate('RU');
            getQuotes('RU');
            changeSettingsRU();
        }
        else if (lang.innerHTML === 'EN') {
            lang.innerHTML = 'EN';
            showGreeting('EN');
            getWeather('EN');
            showDate('EN');
            getQuotes('EN');
            changeSettingsEN();
        }
    }
    else {
        getQuotes('EN');
    }
}
 
window.addEventListener('DOMContentLoaded', getLocalStorage);

// Slider for images

function getRandomNum(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

let bgNum =  getRandomNum(1, 20).toString().padStart(2, '0');

function setBg() {
    let timeOfDay = getTimeOfDay();
    const body = document.querySelector('body');
    const img = new Image();
    img.src = `https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/${timeOfDay}/${bgNum}.jpg`;

    img.onload = () => {
    body.style.backgroundImage = `url(${img.src})`;
    return bgNum;
    }

    githubSrc.classList.add('active-source');
    unsplashSrc.classList.remove('active-source');
    flickrSrc.classList.remove('active-source');
}

document.addEventListener("DOMContentLoaded", setBg);

function getSlideNext() {
    if (githubSrc.classList.contains('active-source')) {
        bgNum = Number(bgNum);
        if(bgNum === 20){
            bgNum = 1;
        }
        else if(bgNum < 20) {
            bgNum += 1;
        }
        bgNum = bgNum.toString().padStart(2, '0');

        setBg();
    }
    else if (unsplashSrc.classList.contains('active-source')) {
        getUnsplashToImage();
    }
    else if (flickrSrc.classList.contains('active-source')) {
        getFlickrToImage();
    }
}

function getSlidePrev() {
    if (githubSrc.classList.contains('active-source')) {
        bgNum = Number(bgNum);
        if(bgNum === 1){
            bgNum = 20;
        }
        else if(bgNum > 1) {
            bgNum -= 1;
        }
        bgNum = bgNum.toString().padStart(2, '0');

        setBg();
    }
    else if (unsplashSrc.classList.contains('active-source')) {
        getUnsplashToImage();
    }
    else if (flickrSrc.classList.contains('active-source')) {
        getFlickrToImage();
    }
}

const slideNext = document.querySelector('.slide-next');
const slidePrev = document.querySelector('.slide-prev');

slideNext.addEventListener('click', getSlideNext);
slidePrev.addEventListener('click', getSlidePrev);

// Weather

const weatherIcon = document.querySelector('.weather-icon');
const temperature = document.querySelector('.temperature');
const weatherDescription = document.querySelector('.weather-description');
const wind = document.querySelector('.wind');
const humidity = document.querySelector('.humidity');
const weatherError = document.querySelector('.weather-error')

async function getWeather(language = lang.innerHTML) {
    let langURL;

    if(language === 'EN') {
        langURL = 'en';
    }
    else if(language === 'RU') {
        langURL = 'ru';
    }

    try {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city.value}&lang=${langURL}&appid=e4e2fef50595d73a9c53c9aab75f7cfc&units=metric`;
        const res = await fetch(url);
        const data = await res.json(); 

        weatherIcon.className = 'weather-icon owf';
        weatherIcon.classList.add(`owf-${data.weather[0].id}`);
        temperature.textContent = `${Math.round(data.main.temp)}°C`;
        weatherDescription.textContent = data.weather[0].description;
        weatherError.textContent = '';
        if(language === 'EN') {
            wind.textContent = `Wind speed: ${Math.round(data.wind['speed'])} m/s`;
            humidity.textContent = `Humidity: ${Math.round(data.main['humidity'])}%`;
        }
        else if(language === 'RU') {
            wind.textContent = `Скорость ветра: ${Math.round(data.wind['speed'])} м/с`;
            humidity.textContent = `Влажность: ${Math.round(data.main['humidity'])}%`;
        }
    }

    catch (error) {
        temperature.textContent = '';
        weatherDescription.textContent = '';
        wind.textContent = '';
        humidity.textContent = '';
        weatherError.textContent = "ERROR: City wasn't found!";
    }
  }

// getWeather();

city.addEventListener('keydown', function(e) {
    if (e.keyCode === 13) {
        getWeather();
    }
});

city.addEventListener('change', getWeather);

// Quote

const quote = document.querySelector('.quote');
const author = document.querySelector('.author');
const changeQuote = document.querySelector('.change-quote')

changeQuote.addEventListener('click', async function() {
    const quotes = 'https://type.fit/api/quotes';
    const res = await fetch(quotes);
    const data = await res.json(); 
    let numOfQuote = getRandomNum(1, 1625);
    quote.textContent = `"${data[numOfQuote].text}"`;
    author.textContent = data[numOfQuote].author;
});

async function getQuotes(language = lang.innerHTML) {  
    if (language === 'EN') {
        const quotes = 'https://type.fit/api/quotes';
        const res = await fetch(quotes);
        const data = await res.json(); 
        let numOfQuote = getRandomNum(1, 1625);
        quote.textContent = `"${data[numOfQuote].text}"`;
        author.textContent = data[numOfQuote].author;
    }
    else if (language === 'RU') {
        const quotes = "data.json";
        const res = await fetch(quotes);
        const data = await res.json(); 
        let numOfQuote = getRandomNum(0, 9);
        quote.textContent = `"${data[numOfQuote].text}"`;
        author.textContent = data[numOfQuote].author;
    }
}



// AudioPlayer

const song = document.querySelector('#song');

const songArtist = document.querySelector('.song-artist'); 
const songTitle = document.querySelector('.song-title'); 
const progressBar = document.querySelector('#progress-bar'); 
let pPause = document.querySelector('.play'); 
let nextSongBtn = document.querySelector('.play-next');
let prevSongBtn = document.querySelector('.play-prev');
let range = document.querySelector('#range');
let volumeBtn = document.querySelector('.volume-button');

let songIndex = 0;
const playList = document.querySelector('.play-list');
let songs = ['./assets/sounds/BadLiar.mp3', './assets/sounds/Demons.mp3', './assets/sounds/IBetMyLife.mp3', './assets/sounds/Thunder.mp3']; 
let songArtists = ['Imagine Dragons', 'Imagine Dragons', 'Imagine Dragons', 'Imagine Dragons']; 
let songTitles = ["Bad liar", "Demon", "I Bet My Life", "Thunder"];

for(let i = 0; i < songs.length; i++) {
    const li = document.createElement('li');
    li.classList.add('play-item');
    li.textContent = `${songArtists[i]} - ${songTitles[i]}`;
    playList.append(li);
}

const playItems = document.querySelectorAll('.play-item');

playItems[0].addEventListener('click', playOne)

function playOne() {
    songIndex = 0;
    song.src = songs[songIndex];
    songArtist.innerHTML = songArtists[songIndex];
    songTitle.innerHTML = songTitles[songIndex];
    playPause();
}

playItems[1].addEventListener('click', playTwo)

function playTwo() {
    songIndex = 1;
    song.src = songs[songIndex];
    songArtist.innerHTML = songArtists[songIndex];
    songTitle.innerHTML = songTitles[songIndex];
    playPause();
}

playItems[2].addEventListener('click', playThree)

function playThree() {
    songIndex = 2;
    song.src = songs[songIndex];
    songArtist.innerHTML = songArtists[songIndex];
    songTitle.innerHTML = songTitles[songIndex];
    playPause();
}

playItems[3].addEventListener('click', playFour)

function playFour() {
    songIndex = 3;
    song.src = songs[songIndex];
    songArtist.innerHTML = songArtists[songIndex];
    songTitle.innerHTML = songTitles[songIndex];
    playPause();
}

let playing = true;

function playPause() {
    if (playing) {
        const song = document.querySelector('#song'),

        pPause = document.querySelector('.play');
        pPause.classList.add('pause'); 
    
        song.play();
        playing = false;
    } else {
        pPause.classList.remove('pause');
        
        song.pause();
        playing = true;
    }
    whichSong();
}

function whichSong() {
    if(songIndex === 0) {
        playItems[songIndex].classList.add('item-active');
        playItems[1].classList.remove('item-active');
        playItems[2].classList.remove('item-active');
        playItems[3].classList.remove('item-active');
    }
    if(songIndex === 1) {
        playItems[songIndex].classList.add('item-active');
        playItems[0].classList.remove('item-active');
        playItems[2].classList.remove('item-active');
        playItems[3].classList.remove('item-active');
    }
    if(songIndex === 2) {
        playItems[songIndex].classList.add('item-active');
        playItems[1].classList.remove('item-active');
        playItems[0].classList.remove('item-active');
        playItems[3].classList.remove('item-active');
    }
    if(songIndex === 3) {
        playItems[songIndex].classList.add('item-active');
        playItems[1].classList.remove('item-active');
        playItems[2].classList.remove('item-active');
        playItems[0].classList.remove('item-active');
    }
}

pPause.addEventListener('click', playPause);

song.addEventListener('ended', function(){
    nextSong();
});

function nextSong() {
    songIndex++;
    if (songIndex > 3) {
        songIndex = 0;
    };
    
    song.src = songs[songIndex];

    songArtist.innerHTML = songArtists[songIndex];
    songTitle.innerHTML = songTitles[songIndex];

    playing = true;
    playPause();
}

nextSongBtn.addEventListener('click', nextSong);

function previousSong() {
    songIndex--;
    if (songIndex < 0) {
        songIndex = 3;
    };
    song.src = songs[songIndex];

    songArtist.innerHTML = songArtists[songIndex];
    songTitle.innerHTML = songTitles[songIndex];

    playing = true;
    playPause();
}

prevSongBtn.addEventListener('click', previousSong);

function updateProgressValue() {
    progressBar.max = song.duration;
    progressBar.value = song.currentTime;
    document.querySelector('.currentTime').innerHTML = (formatTime(Math.floor(song.currentTime)));
    if (document.querySelector('.durationTime').innerHTML === "NaN:NaN") {
        document.querySelector('.durationTime').innerHTML = "0:00";
    } else {
        document.querySelector('.durationTime').innerHTML = (formatTime(Math.floor(song.duration)));
    }
};

function formatTime(seconds) {
    let min = Math.floor((seconds / 60));
    let sec = Math.floor(seconds - (min * 60));
    if (sec < 10){ 
        sec  = `0${sec}`;
    };
    return `${min}:${sec}`;
};

setInterval(updateProgressValue, 500);

function changeProgressBar() {
    song.currentTime = progressBar.value;
};

range.onchange = function(){
    song.volume = this.value;
    if(song.volume === 0) {
        volumeBtn.classList.add('no-volume-button');
    }
}

volumeBtn.addEventListener('click', volumeChange);

function volumeChange() {
    if (song.volume !== 0) {
        volumeBtn.classList.add('no-volume-button');
        range.value = 0;
        song.volume = 0;
    }
    else {
        volumeBtn.classList.remove('no-volume-button');
        range.value = 0.5;
        song.volume = 0.5;
    }
}

// Language

lang.addEventListener('click', changeLanguage);

function changeSettingsRU() {
    const setHeader = document.querySelector('.set-header');
    const langHeader = document.querySelector('.lang-header');
    const sourceHeader = document.querySelector('.source-header');
    const selectSrc = document.querySelector('.select-src');
    const tagHeader = document.querySelector('.tag-header');
    const hideShowHeader = document.querySelector('.hide-show-header');
    const timeHeader = document.querySelector('.time-header');
    const dateHeader = document.querySelector('.date-header');
    const greetingHeader = document.querySelector('.greeting-header');
    const quoteHeader = document.querySelector('.quote-header');
    const weatherHeader = document.querySelector('.weather-header');
    const playerHeader = document.querySelector('.player-header');
    const todoHeader = document.querySelector('.todo-header');

    setHeader.innerHTML = 'НАСТРОЙКИ';
    langHeader.innerHTML = 'Язык';
    sourceHeader.innerHTML = 'Источник фонового изображения';
    // selectSrc.innerHTML = 'Выбрать';
    tagHeader.innerHTML = 'Фон по тегу';
    hideShowHeader.innerHTML = 'Скрыть/показать';
    timeHeader.innerHTML = 'Время';
    dateHeader.innerHTML = 'Дата';
    greetingHeader.innerHTML = 'Приветствие';
    quoteHeader.innerHTML = 'Цитата';
    weatherHeader.innerHTML = 'Погода';
    playerHeader.innerHTML = 'Аудиоплеер';
    todoHeader.innerHTML = 'Список дел';

    todoHeading.innerHTML = 'СПИСОК ДЕЛ';
    addBtn.innerHTML = 'Добавить';
    allBtn.innerHTML = 'Все';
    completeBtn.innerHTML = 'Готовы';
    incompleteBtn.innerHTML = 'Неготовы';
}

function changeSettingsEN() {
    const setHeader = document.querySelector('.set-header');
    const langHeader = document.querySelector('.lang-header');
    const sourceHeader = document.querySelector('.source-header');
    const selectSrc = document.querySelector('.select-src');
    const tagHeader = document.querySelector('.tag-header');
    const hideShowHeader = document.querySelector('.hide-show-header');
    const timeHeader = document.querySelector('.time-header');
    const dateHeader = document.querySelector('.date-header');
    const greetingHeader = document.querySelector('.greeting-header');
    const quoteHeader = document.querySelector('.quote-header');
    const weatherHeader = document.querySelector('.weather-header');
    const playerHeader = document.querySelector('.player-header');
    const todoHeader = document.querySelector('.todo-header');

    setHeader.innerHTML = 'SETTINGS';
    langHeader.innerHTML = 'Language';
    sourceHeader.innerHTML = 'Source of background';
    // selectSrc.innerHTML = 'Select source';
    tagHeader.innerHTML = 'Background tag';
    hideShowHeader.innerHTML = 'Hide/show';
    timeHeader.innerHTML = 'Time';
    dateHeader.innerHTML = 'Date';
    greetingHeader.innerHTML = 'Greeting';
    quoteHeader.innerHTML = 'Quote';
    weatherHeader.innerHTML = 'Weather';
    playerHeader.innerHTML = 'AudioPlayer';
    todoHeader.innerHTML = 'Todo';

    todoHeading.innerHTML = 'TODO LIST';
    addBtn.innerHTML = 'Add';
    allBtn.innerHTML = 'All';
    completeBtn.innerHTML = 'Complete';
    incompleteBtn.innerHTML = 'Incomplete';
}

function changeLanguage() {
    if(lang.innerHTML === 'EN') {
        lang.innerHTML = 'RU';
        showGreeting('RU');
        getWeather('RU');
        showDate('RU');
        getQuotes('RU');
        changeSettingsRU();
    }
    else if(lang.innerHTML === 'RU') {
        lang.innerHTML = 'EN';
        showGreeting('EN');
        getWeather('EN');
        showDate('EN');
        getQuotes('EN');
        changeSettingsEN();
    }
}

let greetingTranslation = {
    englishNight: 'Good night',
    englishMorning: 'Good morning',
    englishAfternoon: 'Good afternoon',
    englishEvening: 'Good evening',
    russianNight: 'Доброй ночи',
    russianMorning: 'Доброе утро',
    russianAfternoon: 'Добрый день',
    russianEvening: 'Добрый вечер',
}



// Background from API

// Unsplash API

// https://api.unsplash.com/photos/random?orientation=landscape&query=nature&client_id=6dp78HSaEQSC_gDOU8a7LiCMdCA22qJd23OjY7qixOw

const githubSrc = document.querySelector('.github');
const unsplashSrc = document.querySelector('.unsplash');
const flickrSrc = document.querySelector('.flickr');
const inputTag = document.querySelector('.input-tag');
inputTag.value = getTimeOfDay();

githubSrc.addEventListener('click', setBg);

unsplashSrc.addEventListener('click', getUnsplashToImage);

async function getUnsplashToImage() {
    const url = `https://api.unsplash.com/photos/random?orientation=landscape&query=${inputTag.value}&client_id=6dp78HSaEQSC_gDOU8a7LiCMdCA22qJd23OjY7qixOw`;

    const res = await fetch(url);
    const data = await res.json();
    // console.log(data.urls.regular);

    const img = new Image();
    img.src = data.urls.regular;
    img.onload = () => {
        document.body.style.backgroundImage = `url(${data.urls.regular})`;
    }

    githubSrc.classList.remove('active-source');
    unsplashSrc.classList.add('active-source');
    flickrSrc.classList.remove('active-source');
   }

// Flickr API

// https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=afae3eab341c453ed988c778f764d4b2&tags=nature&extras=url_l&format=json&nojsoncallback=1

flickrSrc.addEventListener('click', getFlickrToImage);

async function getFlickrToImage() {
    const url = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=afae3eab341c453ed988c778f764d4b2&tags=${inputTag.value}&extras=url_l&format=json&nojsoncallback=1`;
    const res = await fetch(url);
    const data = await res.json();
    // console.log(data.photos.photo[0].url_l);

    const img = new Image();
    // img.src = data.photos.photo[0].url_l;
    let imgURL = Object.values(Object.values(Object.values(data)[0])[4][getRandomNum(0, 100)])[9];
    img.src = imgURL;
    img.onload = () => {
        document.body.style.backgroundImage = `url(${imgURL})`;
    }

    githubSrc.classList.remove('active-source');
    unsplashSrc.classList.remove('active-source');
    flickrSrc.classList.add('active-source');
}

// Settings

const settingsBtn = document.querySelector('#settings-btn');
const settings = document.querySelector('.windowSettings');

settingsBtn.addEventListener('click', toggleSettings);

function toggleSettings() {
    settings.classList.toggle('active-set');
}

document.addEventListener('click', function(e) {
    const target = e.target;
    const its_menu = target == settings || settings.contains(target);
    const its_btnMenu = target == settingsBtn;
    const menu_is_active = settings.classList.contains('active-set');
  
    if (!its_menu && !its_btnMenu && menu_is_active) {
        toggleSettings();
    }
  });

  const time = document.querySelector('.time');
  const date = document.querySelector('.date');
  const greeting = document.querySelector('.greeting-container');
  const quoteContainer = document.querySelector('.footer');
  const weather = document.querySelector('.weather');
  const player = document.querySelector('.player');
  const todo = document.querySelector('.todo-container');

  const switchTime = document.querySelector('.switch-time');
  const switchDate = document.querySelector('.switch-date');
  const switchGreeting = document.querySelector('.switch-greeting');
  const switchQuote = document.querySelector('.switch-quote');
  const switchWeather = document.querySelector('.switch-weather');
  const switchPlayer = document.querySelector('.switch-player');
  const switchTodo = document.querySelector('.switch-todo');

  switchTime.addEventListener('click', toggleTime);
  switchDate.addEventListener('click', toggleDate);
  switchGreeting.addEventListener('click', toggleGreeting);
  switchQuote.addEventListener('click', toggleQuote);
  switchWeather.addEventListener('click', toggleWeather);
  switchPlayer.addEventListener('click', togglePlayer);
  switchTodo.addEventListener('click', toggleTodo);

  function toggleTime() {
        time.classList.toggle('invisible');
  }
  function toggleDate() {
        date.classList.toggle('invisible');
  }
  function toggleGreeting() {
    greeting.classList.toggle('invisible');
  }
  function toggleQuote() {
    quoteContainer.classList.toggle('invisible');
  }
  function toggleWeather() {
    weather.classList.toggle('invisible');
  }
  function togglePlayer() {
    player.classList.toggle('invisible');
  }
  function toggleTodo() {
    todo.classList.toggle('invisible');
  }

// Todo

const todoBtn = document.querySelector('.todo-btn');
const todoContainer = document.querySelector('.todo-popup');

todoBtn.addEventListener('click', toggleTodoPopup);

function toggleTodoPopup() {
    todoContainer.classList.toggle('todo-active');
}

document.addEventListener('click', function(e) {
    const target = e.target;
    const its_menu = target == todoContainer || todoContainer.contains(target);
    const its_btnMenu = target == todoBtn;
    const menu_is_active = todoContainer.classList.contains('todo-active');
  
    if (!its_menu && !its_btnMenu && menu_is_active) {
        toggleTodoPopup();
    }
  });

let todoHeading = document.querySelector('.todo-heading');
let taskInput = document.querySelector('.type-text');
const addBtn = document.querySelector('.add-btn');
let tasksList = document.querySelector('.tasks-list');
const allBtn = document.querySelector('.all-tasks');
const completeBtn = document.querySelector('.complete-tasks');
const incompleteBtn = document.querySelector('.incomplete-tasks');

addBtn.addEventListener('click', addNewTask);
taskInput.addEventListener('keydown', function(e) {
    if (e.keyCode === 13) {
      addNewTask();
    }
  });


function addNewTask() {
    let li = document.createElement('li');
    let div = document.createElement('div');
    let cross = document.createElement('img');
    cross.src = './assets/svg/iconsCancel.svg';
    cross.classList.add('cross');
    div.classList.add('task-div');
    li.appendChild(div);
    li.appendChild(cross);
    li.classList.add('tasks-item');
    li.classList.add('incomplete');
    div.textContent = taskInput.value;
    if(div.textContent !== '') {
        tasksList.appendChild(li);
    }
    taskInput.value = '';
}

tasksList.addEventListener('click', function(ev) {
    if (ev.target.tagName === 'IMG') {
        ev.target.parentNode.remove();
    }
}, false)

tasksList.addEventListener('click', function(ev) {
    if (ev.target.tagName === 'DIV') {
        ev.target.parentNode.classList.toggle('complete');
        ev.target.parentNode.classList.toggle('incomplete');
    }
}, false)

allBtn.addEventListener('click', displayAllTasks);
completeBtn.addEventListener('click', displayCompleteTasks);
incompleteBtn.addEventListener('click', displayIncompleteTasks);

function displayAllTasks() {
    let todoItems = document.querySelectorAll('.tasks-item');
    for (let i = 0; i < todoItems.length; i++) {
            todoItems[i].style.display = 'flex';
    }
}

function displayCompleteTasks() {
    let todoItems = document.querySelectorAll('.tasks-item');
    for (let i = 0; i < todoItems.length; i++) {
            todoItems[i].style.display = 'flex';
    }
    for (let i = 0; i < todoItems.length; i++) {
        if (todoItems[i].classList.contains('incomplete')) {
            todoItems[i].style.display = 'none';
        }
    }
}

function displayIncompleteTasks() {
    let todoItems = document.querySelectorAll('.tasks-item');
    for (let i = 0; i < todoItems.length; i++) {
        todoItems[i].style.display = 'flex';
    }
    for (let i = 0; i < todoItems.length; i++) {
        if (todoItems[i].classList.contains('complete')) {
            todoItems[i].style.display = 'none';
        }
    }
}
