"use strict";

const playListSongs = [
  {
    artist: "Imagine Dragons",
    title: "Bad Liar",
    file: "./assets/sounds/BadLiar.mp3",
    duration: "4:21",
  },
  {
    artist: "Imagine Dragons",
    title: "Demons",
    file: "./assets/sounds/Demons.mp3",
    duration: "2:57",
  },
  {
    artist: "Imagine Dragons",
    title: "I Bet My Life",
    file: "./assets/sounds/IBetMyLife.mp3",
    duration: "3:13",
  },
  {
    artist: "Imagine Dragons",
    title: "Thunder",
    file: "./assets/sounds/Thunder.mp3",
    duration: "3:08",
  },
];

function showTime() {
  const time = document.querySelector(".time");
  const date = new Date();
  const currentTime = date.toLocaleTimeString();

  time.textContent = currentTime;

  setTimeout(showTime, 1000);
}

function setLocalStorage() {
  const name = document.querySelector(".name");
  const city = document.querySelector(".city");

  if (name.value) {
    localStorage.setItem("name", name.value);
  }
  if (city.value) {
    localStorage.setItem("city", city.value);
  }
  localStorage.setItem("isPlaying", "");
}

function getLocalStorage() {
  const name = document.querySelector(".name");
  const nameFromLS = localStorage.getItem("name");

  if (nameFromLS) {
    name.value = nameFromLS;
  }
}

function showGreeting(lang = "EN") {
  let greeting = getTimeOfDay(lang);
  document.querySelector(".greeting").innerHTML = greeting;
}

function getTimeOfDay(lang = "EN") {
  let hours = getHours();
  let timeOfDay;

  if (hours >= 0 && hours < 6) {
    timeOfDay = lang === "EN" ? "Good night" : "Доброй ночи";
  } else if (hours >= 6 && hours < 12) {
    timeOfDay = lang === "EN" ? "Good morning" : "Доброе утро";
  } else if (hours >= 12 && hours < 18) {
    timeOfDay = lang === "EN" ? "Good afternoon" : "Доброго дня";
  } else {
    timeOfDay = lang === "EN" ? "Good evening" : "Добрый вечер";
  }
  return timeOfDay;
}

function getHours() {
  const date = new Date();
  const hours = date.getHours();

  return hours;
}

function showDate(lang = "EN") {
  const date = new Date();
  const options = { weekday: "long", month: "long", day: "numeric" };
  let currentDate;
  if (lang == "EN") {
    currentDate = date.toLocaleDateString("en-EN", options);
  } else if (lang == "RU") {
    currentDate = date.toLocaleDateString("ru-RU", options);
  }
  document.querySelector(".date").textContent = currentDate;
}

function getRandomNum(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function setBg(bgNum) {
  let timeOfDay = getTimeOfDay().split(" ")[1];
  const body = document.querySelector("body");
  const img = new Image();
  img.src = `https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/${timeOfDay}/${bgNum}.jpg`;

  img.onload = () => {
    body.style.backgroundImage = `url(${img.src})`;
    return bgNum;
  };
}

function getSlideNext(bgNum) {
  const unsplashSrc = document.querySelector(".unsplash");
  if (unsplashSrc.classList.contains("active-source")) {
    getUnsplashImage();
  } else {
    bgNum = Number(bgNum);
    if (bgNum === 20) {
      bgNum = 1;
    } else if (bgNum < 20) {
      bgNum += 1;
    }
    bgNum = bgNum.toString().padStart(2, "0");

    setBg(bgNum);
  }
}

function getSlidePrev(bgNum) {
  const unsplashSrc = document.querySelector(".unsplash");
  if (unsplashSrc.classList.contains("active-source")) {
    getUnsplashImage();
  } else {
    bgNum = Number(bgNum);
    if (bgNum === 1) {
      bgNum = 20;
    } else if (bgNum > 1) {
      bgNum -= 1;
    }
    bgNum = bgNum.toString().padStart(2, "0");

    setBg(bgNum);
  }
}

async function getWeather(city) {
  let langURL = "en";
  const appID = "e4e2fef50595d73a9c53c9aab75f7cfc";
  const weatherIcon = document.querySelector(".weather-icon"),
    temperature = document.querySelector(".temperature"),
    weatherDescription = document.querySelector(".weather-description"),
    wind = document.querySelector(".wind"),
    humidity = document.querySelector(".humidity"),
    weatherError = document.querySelector(".weather-error");

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city.value}&lang=${langURL}&appid=${appID}&units=metric`;
    const res = await fetch(url);
    const data = await res.json();

    weatherIcon.className = "weather-icon owf";
    weatherIcon.classList.add(`owf-${data.weather[0].id}`);
    temperature.textContent = `${Math.round(data.main.temp)}°C`;
    weatherDescription.textContent = data.weather[0].description;
    weatherError.textContent = "";
    wind.textContent = `Wind speed: ${Math.round(data.wind["speed"])} m/s`;
    humidity.textContent = `Humidity: ${Math.round(data.main["humidity"])}%`;
  } catch (error) {
    temperature.textContent = "";
    weatherDescription.textContent = "";
    wind.textContent = "";
    humidity.textContent = "";
    weatherError.textContent = "ERROR: City wasn't found!";
  }
}

function createPlaylist() {
  const playlist = document.querySelector(".play-list");

  playListSongs.forEach((song, idx) => {
    const li = document.createElement("li");
    li.classList.add("play-item");
    li.setAttribute("data-index", `${idx}`);
    li.textContent = `${song.artist} - ${song.title}`;
    playlist.append(li);
  });
}

function playPause() {
  const isPlaying = Boolean(localStorage.getItem("isPlaying"));
  const pPause = document.querySelector(".play");
  if (!isPlaying) {
    const song = document.querySelector("#song");
    pPause.classList.add("pause");
    localStorage.setItem("isPlaying", "true");

    song.play();
  } else {
    pPause.classList.remove("pause");
    localStorage.setItem("isPlaying", "");

    song.pause();
  }
  highlightSong();
}

function highlightSong() {
  const currentTitle = document.querySelector(".song-title");
  let currentSongIdx;
  playListSongs.forEach((song, idx) => {
    if (song.title === currentTitle.textContent) currentSongIdx = idx;
  });
  const playItems = document.querySelectorAll(".play-item");
  playItems.forEach((songItem) => {
    songItem.classList.remove("item-active");
  });
  playItems[+currentSongIdx].classList.add("item-active");
}

function nextSong() {
  const song = document.querySelector("#song");
  const songArtist = document.querySelector(".song-artist");
  const songTitle = document.querySelector(".song-title");
  const currentTitle = document.querySelector(".song-title");
  let currentSongIdx;

  playListSongs.forEach((song, idx) => {
    if (song.title === currentTitle.textContent) currentSongIdx = idx;
  });
  currentSongIdx++;
  if (currentSongIdx > playListSongs.length - 1) {
    currentSongIdx = 0;
  }

  song.src = playListSongs[currentSongIdx].file;

  songArtist.textContent = playListSongs[currentSongIdx].artist;
  songTitle.textContent = playListSongs[currentSongIdx].title;

  localStorage.setItem("isPlaying", "");
  playPause();
}

function prevSong() {
  const song = document.querySelector("#song");
  const songArtist = document.querySelector(".song-artist");
  const songTitle = document.querySelector(".song-title");
  const currentTitle = document.querySelector(".song-title");
  let currentSongIdx;

  playListSongs.forEach((song, idx) => {
    if (song.title === currentTitle.textContent) currentSongIdx = idx;
  });
  currentSongIdx--;
  if (currentSongIdx < 0) {
    currentSongIdx = playListSongs.length - 1;
  }

  song.src = playListSongs[currentSongIdx].file;

  songArtist.textContent = playListSongs[currentSongIdx].artist;
  songTitle.textContent = playListSongs[currentSongIdx].title;

  localStorage.setItem("isPlaying", "");
  playPause();
}

function updateProgressValue() {
  const progressBar = document.querySelector("#progress-bar");
  const song = document.querySelector("#song");

  progressBar.max = song.duration;
  progressBar.value = song.currentTime;
  document.querySelector(".currentTime").innerHTML = formatTime(Math.floor(song.currentTime));
  if (document.querySelector(".durationTime").innerHTML === "NaN:NaN") {
    document.querySelector(".durationTime").innerHTML = "0:00";
  } else {
    document.querySelector(".durationTime").innerHTML = formatTime(Math.floor(song.duration));
  }
}

function formatTime(seconds) {
  let min = Math.floor(seconds / 60);
  let sec = Math.floor(seconds - min * 60);
  if (sec < 10) {
    sec = `0${sec}`;
  }
  return `${min}:${sec}`;
}

setInterval(updateProgressValue, 500);

function changeProgressBar() {
  const progressBar = document.querySelector("#progress-bar");
  const song = document.querySelector("#song");
  song.currentTime = progressBar.value;
}

function volumeChange() {
  const song = document.querySelector("#song");
  const volumeBtn = document.querySelector(".volume-button");
  const range = document.querySelector(".range");

  if (song.volume !== 0) {
    volumeBtn.classList.add("no-volume-button");
    range.value = 0;
    song.volume = 0;
  } else {
    volumeBtn.classList.remove("no-volume-button");
    range.value = 0.5;
    song.volume = 0.5;
  }
}

async function getApiQuotes() {
  const quote = document.querySelector(".quote");
  const author = document.querySelector(".author");
  const quotes = "https://type.fit/api/quotes";
  const res = await fetch(quotes);
  const data = await res.json();

  const numOfQuote = getRandomNum(1, data.length);
  quote.textContent = data[numOfQuote].text;
  author.textContent = data[numOfQuote].author.split(",")[0];
}

async function getUnsplashImage() {
  const githubSrc = document.querySelector(".github");
  const unsplashSrc = document.querySelector(".unsplash");

  const inputTag = document.querySelector(".input-tag");
  const clientID = "6dp78HSaEQSC_gDOU8a7LiCMdCA22qJd23OjY7qixOw";
  let url;
  if (inputTag.value) {
    url = `https://api.unsplash.com/photos/random?orientation=landscape&query=${inputTag.value}&client_id=${clientID}`;
  } else {
    url = `https://api.unsplash.com/photos/random?orientation=landscape&query=${
      getTimeOfDay().split(" ")[1]
    }&client_id=${clientID}`;
  }

  const res = await fetch(url);
  const data = await res.json();

  const img = new Image();
  img.src = data.urls.regular;
  img.onload = () => {
    document.body.style.backgroundImage = `url(${data.urls.regular})`;
  };

  githubSrc.classList.remove("active-source");
  unsplashSrc.classList.add("active-source");
}

function createTodo(text) {
  const todoItem = document.createElement("li");
  todoItem.classList.add("tasks-item");
  todoItem.innerHTML = `
  <div class="task-div">${text}</div>
  <div>
  <img class="done" src="./assets/img/complete.png">
  <img class="cross" src="./assets/img/delete.png">
  </div>
  `;

  return todoItem;
}

function createTasks() {
  const tasks = localStorage.getItem("tasks") ? JSON.parse(localStorage.getItem("tasks")) : [];
  const todoList = document.querySelector(".tasks-list");
  todoList.innerHTML = "";

  if (tasks.length) {
    tasks.forEach((todo, idx) => {
      const task = createTodo(todo.text);
      if (todo.isCompleted) {
        task.classList.add("completed-todo");
        task.children[0].classList.add("complete");
        task.children[1].children[0].classList.add("invisible");
      }
      task.setAttribute("data-index", `${idx}`);
      todoList.append(task);
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  let bgNum = getRandomNum(1, 20).toString().padStart(2, "0");
  const city = document.querySelector(".city");
  city.value = localStorage.getItem("city") ? localStorage.getItem("city") : "Minsk";
  const song = document.querySelector("#song");
  const songArtist = document.querySelector(".song-artist");
  const songTitle = document.querySelector(".song-title");

  showTime();
  showDate();
  showGreeting();
  setBg(bgNum);
  getWeather(city);
  createPlaylist();
  getApiQuotes();
  createTasks();

  const todoBtn = document.querySelector(".todo-btn");
  const todoContainer = document.querySelector(".todo-popup");
  const settings = document.querySelector(".windowSettings");
  const settingsBtn = document.querySelector(".settings-btn");

  document.addEventListener("click", function (event) {
    const target = event.target;
    const its_menu = target == todoContainer || todoContainer.contains(target);
    const its_btnMenu = target == todoBtn;
    const menu_is_active = todoContainer.classList.contains("todo-active");

    if (!its_menu && !its_btnMenu && menu_is_active) {
      todoContainer.classList.toggle("todo-active");
    }
  });

  document.addEventListener("click", function (event) {
    const target = event.target;
    const its_menu = target == settings || settings.contains(target);
    const its_btnMenu = target == settingsBtn;
    const menu_is_active = settings.classList.contains("active-set");

    if (!its_menu && !its_btnMenu && menu_is_active) {
      settings.classList.toggle("active-set");
    }
  });

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (target.classList.contains("slide-next")) {
      getSlideNext(bgNum);
      bgNum = Number(bgNum);
      if (bgNum === 20) {
        bgNum = 1;
      } else if (bgNum < 20) {
        bgNum += 1;
      }
    }

    if (target.classList.contains("slide-prev")) {
      getSlidePrev(bgNum);
      bgNum = Number(bgNum);
      if (bgNum === 1) {
        bgNum = 20;
      } else if (bgNum > 1) {
        bgNum -= 1;
      }
    }

    if (target.classList.contains("play-item")) {
      const currentSongIdx = target.getAttribute("data-index");
      song.src = playListSongs[currentSongIdx].file;
      songArtist.textContent = playListSongs[currentSongIdx].artist;
      songTitle.textContent = playListSongs[currentSongIdx].title;
      playPause();
    }

    if (target.classList.contains("play")) {
      const currentTitle = document.querySelector(".song-title");
      let currentSongIdx;
      playListSongs.forEach((song, idx) => {
        if (song.title === currentTitle.textContent) currentSongIdx = idx;
      });
      playPause();
    }

    if (target.classList.contains("play-next")) {
      nextSong();
    }

    if (target.classList.contains("play-prev")) {
      prevSong();
    }

    if (target.classList.contains("volume-button")) {
      volumeChange();
    }

    if (target.classList.contains("change-quote")) {
      getApiQuotes();
    }

    if (target.classList.contains("settings-btn")) {
      settings.classList.toggle("active-set");
    }

    if (target.classList.contains("switch-time")) {
      document.querySelector(".time").classList.toggle("invisible");
    }

    if (target.classList.contains("switch-date")) {
      document.querySelector(".date").classList.toggle("invisible");
    }

    if (target.classList.contains("switch-greeting")) {
      document.querySelector(".greeting-container").classList.toggle("invisible");
    }

    if (target.classList.contains("switch-quote")) {
      document.querySelector(".footer-one").classList.toggle("invisible");
    }

    if (target.classList.contains("switch-weather")) {
      document.querySelector(".weather").classList.toggle("invisible");
    }

    if (target.classList.contains("switch-player")) {
      document.querySelector(".player").classList.toggle("invisible");
    }

    if (target.classList.contains("switch-todo")) {
      document.querySelector(".todo-container").classList.toggle("invisible");
    }

    if (target.classList.contains("github")) {
      const githubSrc = document.querySelector(".github");
      const unsplashSrc = document.querySelector(".unsplash");
      githubSrc.classList.add("active-source");
      unsplashSrc.classList.remove("active-source");
      setBg(bgNum);
    }

    if (target.classList.contains("unsplash")) {
      getUnsplashImage();
    }

    if (target.classList.contains("todo-btn")) {
      todoContainer.classList.toggle("todo-active");
    }

    if (target.classList.contains("add-btn")) {
      const inputValue = document.querySelector(".type-text").value;

      if (inputValue) {
        let tasks = localStorage.getItem("tasks") ? JSON.parse(localStorage.getItem("tasks")) : [];
        tasks.push({ text: inputValue, isCompleted: false });
        localStorage.setItem("tasks", JSON.stringify(tasks));
        document.querySelector(".type-text").value = "";

        createTasks();
      }
    }

    if (target.classList.contains("done")) {
      let tasks = JSON.parse(localStorage.getItem("tasks"));
      const currentIndex = +target.parentNode.parentNode.getAttribute("data-index");
      const currentTodo = tasks[currentIndex];

      currentTodo.isCompleted = true;
      tasks.splice(currentIndex, 1);
      tasks.push(currentTodo);
      localStorage.setItem("tasks", JSON.stringify(tasks));

      createTasks();
    }

    if (target.classList.contains("cross")) {
      let tasks = JSON.parse(localStorage.getItem("tasks"));
      const currentIndex = +target.parentNode.parentNode.getAttribute("data-index");
      tasks.splice(currentIndex, 1);
      localStorage.setItem("tasks", JSON.stringify(tasks));

      createTasks();
    }
  });

  document.addEventListener("change", (event) => {
    const target = event.target;

    if (target.classList.contains("city")) {
      getWeather(city);
    }

    if (target.classList.contains("range")) {
      song.volume = target.value;
      if (song.volume === 0) {
        let volumeBtn = document.querySelector(".volume-button");
        volumeBtn.classList.add("no-volume-button");
      }
    }

    if (target.classList.contains("input-tag")) {
      getUnsplashImage();
    }
  });

  song.addEventListener("ended", function () {
    nextSong();
  });
});

window.addEventListener("load", getLocalStorage);
window.addEventListener("beforeunload", setLocalStorage);
