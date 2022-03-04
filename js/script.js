// Let us select All required elements and tags
// (Lazımlı tagları və divləri tutaq)

const wrapper = document.querySelector(".wrapper"),
musicImg = wrapper.querySelector(".img-area img"),
musicName = wrapper.querySelector(".song-details .name"),
musicArtist = wrapper.querySelector(".song-details .artist");
mainAudio = wrapper.querySelector("#main-audio");
playPauseBtn = wrapper.querySelector(".play-pause");
prevBtn = wrapper.querySelector("#prev");
nextBtn = wrapper.querySelector("#next");
progressArea = wrapper.querySelector(".progress-area");
progressBar = wrapper.querySelector(".progress-bar");
musiclist = wrapper.querySelector(".music-list"),
showMoreBtn = wrapper.querySelector("#any-songs"),
hideMusicBtn = musiclist.querySelector("#close");


//load random music on page refresh

let musicIndex = Math.floor((Math.random() * allMusic.length) + 1);

// indexNumb - 1 Index normalda 0 dan baslayir.Ancaq bele yazanda 1 den baslayir

window.addEventListener('load',()=>{
    loadMusic(musicIndex);
    playingNow();
    // If window loaded we call music 
    // Sehife yenilenen zaman cagirilan musiqi
})



// Load Music Function

// indexNumb is parameter of function
function loadMusic(indexNumb){
    musicName.innerText = allMusic[indexNumb - 1].name;
    musicArtist.innerText = allMusic[indexNumb - 1].artist;
    musicImg.src = `img/${allMusic[indexNumb - 1].img}.jfif`;
    mainAudio.src = `music/${allMusic[indexNumb - 1].src}.mp3`;
}

// Play Music Function

function playMusic(){
    wrapper.classList.add("paused");
    playPauseBtn.querySelector("i").innerText = "pause";
    mainAudio.play();
}

// playPauseBtn.querySelector("i").innerText = "pause,play_arrow"; That will change icons like stop start as music changing.
 

// Pause Music Function

function pauseMusic(){
    wrapper.classList.remove("paused");
    playPauseBtn.querySelector("i").innerText = "play_arrow";
    mainAudio.pause();
}
// But now isMusicPaused will return true because paused class added in wrappewr so the pauseMusic function will call

// Next Music Function(++ adds one above it )
function nextMusic(){
    musicIndex++;
    // If musicIndex is greater than array lenth then musicIndex will be 1 and first song will be repeated(Eger artiq elave edilecek musiqi olmasa index i 1 olan musiqini qoy)
    musicIndex > allMusic.length ? musicIndex = 1 : musicIndex = musicIndex;
    loadMusic(musicIndex);
    playMusic();
    playingNow();
}

// Previos Music Function(-- removes and decrement index by 1 )
function prevMusic(){
    musicIndex--;
    // If musicIndex is less than 1 then musicIndex will be array length and last song will be repeated(Eger artiq elave edilecek musiqi olmasa index i son olan musiqini qoy)
    musicIndex < 1 ? musicIndex = allMusic.length : musicIndex = musicIndex;
    loadMusic(musicIndex);
    // Load Music from We called MusicIndex as parameter and Play Music
    playMusic();
    playingNow();
}

// But first time it will return false,because there is not any paused music here.So we need to add paused class inside playMusic function
// Play or Music Button Event
playPauseBtn.addEventListener("click", ()=>{
    const isMusicPaused = wrapper.classList.contains("paused");
    // If isMusicPaused is ture then call pauseMusic else call playMusic
    isMusicPaused ? pauseMusic() : playMusic();
    playingNow();
})

// Next(Sonraki) Music Btn Event
nextBtn.addEventListener("click",()=>{
    nextMusic(); //calling next music function
});

// Previous(Evvelki) Music Btn Event
prevBtn.addEventListener("click",()=>{
    prevMusic(); //calling next music function
});

// Update progress bar width as music time(Musiqi vaxtina uygun xettin olcusunu deyis)

mainAudio.addEventListener("timeupdate",(e)=>{
    const currentTime = e.target.currentTime; //getting current time of music
    const duration = e.target.duration; // getting total duration of music
    let progressWidth = (currentTime / duration) *100;
    // We define bar width as Upper function ( time / duration ) so it will change by this
    progressBar.style.width = `${progressWidth}%`;

// loaddeddata event helps us to get duration of audio without playing it
let musicCurrentTime = wrapper.querySelector(".current"),
musicDuration = wrapper.querySelector(".duration");
    mainAudio.addEventListener("loadeddata",()=>{
       

        // Updating Song's total duration
    let audioDuration = mainAudio.duration;
    let totalMin = Math.floor(audioDuration / 60);
    let totalSec = Math.floor(audioDuration % 60);
    if(totalSec < 10){ //adding 0 if second is les than 10
        totalSec = `0${totalSec}`;
    }
    musicDuration.innerText = `${totalMin}:${totalSec}`;

   

    })
     // update playing song current time
     let currentMin = Math.floor(currentTime / 60);
     let currentSec = Math.floor(currentTime % 60);
     if(currentSec < 10){ //adding 0 if second is les than 10
         currentSec = `0${currentSec}`;
     }
     musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
    

})

// Let us update playing song current time  according to the progress bar width(Mahninin saniyesini bardan asili olaraq deyismek)

progressArea.addEventListener("click",(e)=>{
    let progressWidthval = progressArea.clientWidth; //getting width of progress bar
    let clickedOffSetX = e.offsetX; //getting offset x value
    let songDuration = mainAudio.duration; //getting song total duration

    mainAudio.currentTime = (clickedOffSetX / progressWidthval) * songDuration;
    playMusic();
})

// let's work on repeat , shuffle song according to the icon
const repeatBtn = wrapper.querySelector("#repeat-list");
repeatBtn.addEventListener("click",()=>{
    //first we need to get innerText of the icon then we will change accordingly
    let getText = repeatBtn.innerText; //getting inneText of icon
    //let's do different changes on different icon click using switch
    switch(getText){
     case "repeat": // if this icon is repeat then change it to repeat_one
        repeatBtn.innerText = "repeat_one";
        repeatBtn.setAttribute("title","Song looped");
        //We use set attribute to change title of i 
        break;
     case "repeat_one": //if icon is repeat_one then change it to shuffle
        repeatBtn.innerText = "shuffle";
        repeatBtn.setAttribute("title","Playback shuffle");
        break;
     case "shuffle": //if icon is shuffle then change it to repeat
        repeatBtn.innerText = "repeat"; 
        repeatBtn.setAttribute("title","Playlist looped");
        break;   
    }
    
})


//After we change icon now let's work on what to do 
// after the song ended
mainAudio.addEventListener("ended",()=>{
    //we will do according to the icon means if user has set icon to loop song we will repeat it
    // the current song will do further accordingly

    let getText = repeatBtn.innerText; //getting innerText of icon
     //let's do different changes on different icon click using switch
     switch(getText){
        case "repeat": // if this icon is repeat then we call nextMusic function so the next song will play
           nextMusic();
           repeatBtn.setAttribute("title","Song looped");
           //We use set attribute to change title of i 
           break;
        case "repeat_one": //if icon is repeat_one then we will change the current time of playing song to 0 so song will play from beginning
           mainAudio.currentTime = 0;
           loadMusic(musicIndex);
           playMusic() ;//calling playMusic function   
           break;
        case "shuffle": //if icon is shuffle then change it to repeat
        // generating random index between the max range of array length
           let randIndex = Math.floor((Math.random() * allMusic.length) + 1);
           do{
            randIndex = Math.floor((Math.random() * allMusic.length) + 1);
           }while(musicIndex == randIndex) //this loop run until the next random number will not be same of current music index
           musicIndex = randIndex; //passing randomIndex to musicIndex so the random song will play
           loadMusic(musicIndex) //calling loadMusic function         
           playMusic() ;//calling playMusic function
           playingNow();         
           break;   
       }

});


showMoreBtn.addEventListener("click",()=>{
    musiclist.classList.toggle("show");
});


hideMusicBtn.addEventListener("click",()=>{
    showMoreBtn.click();
});

const ulTag = wrapper.querySelector("ul");

// This for loop will help us to create li according to array length

for (let c = 0; c < allMusic.length; c++) {
    //Let us pass the song name artist from array to li

    //by using li index we will find which song is currently playing
    //  why i write {c+1}? because i decreased index -1 my index started from -1
   let liTag = `<li li-index="${c + 1}">
      <div class="row">
         <span>${allMusic[c].name}</span> 
         <p>${allMusic[c].artist}</p>
       </div>
       <audio class="${allMusic[c].src}"  src="music/${allMusic[c].src}.mp3"></audio>
       <span id="${allMusic[c].src}" class="audio-duration">3:40</span>
       </li>`;
       //to make value dinamic we use ${}
    ulTag.insertAdjacentHTML("beforeend", liTag);

    
    let liAudioDuration = ulTag.querySelector(`#${allMusic[c].src}`);
    // Liaudioduration selects span tag which show audio total duration
    let liAudioTag = ulTag.querySelector(`.${allMusic[c].src}`);
    // liaudiotag select audio tag which have audio source

    liAudioTag.addEventListener("loadeddata",()=>{
         // Updating Song's total duration
    let audioDuration = liAudioTag.duration;
    let totalMin = Math.floor(audioDuration / 60);
    let totalSec = Math.floor(audioDuration % 60);
    if(totalSec < 10){ //adding 0 if second is les than 10
        totalSec = `0${totalSec}`;
    }
    liAudioDuration.innerText = `${totalMin}:${totalSec}`;
    // we store song duration in t-duration attribute so we can easily get it again
    //adding t duration attribute which we will use below
    liAudioDuration.setAttribute("t-duration", `${totalMin}:${totalSec}` )

    })
    
    // "loaddeddata" event used to get audio total duration without playing it
}

// We will use audio tag in this c loop to get total duration of music


// let's start on play particular song on click

const allLiTags = ulTag.querySelectorAll("li");
function playingNow(){
    for (let a = 0; a < allMusic.length; a++) {
        let audioTag = allLiTags[a].querySelector(".audio-duration")

        // let s remove playing class from all other li expect the last one clicked
        if(allLiTags[a].classList.contains("playing")){
            allLiTags[a].classList.remove("playing");
            // let s get that audio duration value pass to .audio-duration innertext
            let adDuration = audioTag.getAttribute("t-duration");
            audioTag.innerText = adDuration; //passing t-duration value to audio duration innerText
        }

        // if there is any li tag which li-index equal to musicIndex
        //then the music is playing now and we will style it
        if(allLiTags[a].getAttribute("li-index") == musicIndex){
            allLiTags[a].classList.add("playing");
            audioTag.innerText = "Playing"
        }
    // let us show playing to currently playing song 277 line tag
    
    
        // adding onclick attribute in all li tags
        allLiTags[a].setAttribute("onclick", "clicked(this)");
        
    }
}

//let us play song on li click
// in this element parameter we are getting clicked full li tag
function clicked(element){
    // getting li index of particular clicked li tag
    let getLiIndex = element.getAttribute("li-index");
    musicIndex = getLiIndex; // passing that li index to musicindex
    loadMusic(musicIndex);
    playMusic();
    playingNow();
 }

// Finally let us reload different song when we reload page