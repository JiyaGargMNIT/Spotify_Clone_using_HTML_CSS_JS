
  let currentSong=new Audio();
  let currFolder="songs/library1";
  let songs;

  
async function getSongs(folder){
  currFolder=folder;
    let a=await fetch(`http://127.0.0.1:3000/spotify_clone/${folder}/`);
    console.log(folder);
    let response=await a.text();
    
    let div=document.createElement("div");
    div.innerHTML=response;
    let as=div.getElementsByTagName("a");
     songs=[];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if(element.href.endsWith(".mp3")){
            songs.push(element.href);
        }
    }
   
    

  
 
    let songUL=document.querySelector(".songList").getElementsByTagName("ul")[0];
    songUL.innerHTML="";
    for (const song of songs) {
        songUL.innerHTML=songUL.innerHTML+`  <li>
                    <img src="assets/music.svg" width="30px" alt="" class="invert">
                    <div class="info">
                        <div>${song.split(`/${currFolder}/`)[1].split(".mp3")[0].replaceAll("_"," ").split("-")[0]}</div>
                        <div>${song.split(`/${currFolder}/`)[1].split(".mp3")[0].replaceAll("_"," ").split("-")[1]}</div>
                    </div>
                    <img src="assets/playsong.svg"  alt="" width="30px">
                </li>
</li>`
    }
      Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(element => {
            let divs=element.querySelector(".info").getElementsByTagName("div");
           
            let address=divs[0].innerHTML.replaceAll(" ","_")+"-"+divs[1].innerHTML.replaceAll(" ","_")+".mp3";
            
            element.addEventListener("click",(e) => {
              console.log(e);
                play.src="assets/pause.svg"
                console.log(address);
                playMusic(address,divs[0].innerHTML);

            }
            )
    });


     let previous=document.getElementById("previous");
   previous.addEventListener("click",() => {
     let index=songs.indexOf(currentSong.src);
  
    
     if(index-1>=0){
       if(currentSong.paused){
      playMusic(songs[index-1].split(`/${currFolder}/`)[1],songs[index-1].split(`/${currFolder}/`)[1].split(".mp3")[0].replaceAll("_"," ").split("-")[0],true);
     }
        else{
          playMusic(songs[index-1].split(`/${currFolder}/`)[1],songs[index-1].split(`/${currFolder}/`)[1].split(".mp3")[0].replaceAll("_"," ").split("-")[0]);
        }
     }
     
   }
   )

   let next=document.getElementById("next");
   next.addEventListener("click",() => {
     let index=songs.indexOf(currentSong.src);
  
     
     if(index+1<songs.length){
      if(currentSong.paused){
       playMusic(songs[index+1].split(`/${currFolder}/`)[1],songs[index+1].split(`/${currFolder}/`)[1].split(".mp3")[0].replaceAll("_"," ").split("-")[0],true);
     }
       else{
         playMusic(songs[index+1].split(`/${currFolder}/`)[1],songs[index+1].split(`/${currFolder}/`)[1].split(".mp3")[0].replaceAll("_"," ").split("-")[0]);
       }
     }
   }
   )
    return songs;

}

const playMusic=(track,songName,pause=false,folder=currFolder) => {
    currentSong.src=`${folder}/`+track;

    if(!pause){
            currentSong.play();
           
    }
    else{
    
      currentSong.pause();
    }
    document.querySelector(".songInfo").innerHTML=songName;
    document.querySelector(".songTime").innerHTML="0:00/0:00"
}


const secondsIntoMinutes=(seconds=0) => {
  let minutes=Math.floor(seconds/60);
  let second=Math.floor(seconds%60);
  if(second<10){
    return `${minutes}:0${second}`;
  }
  return `${minutes}:${second}`;
}

async function displayAlbums() {
   let a=await fetch(`http://127.0.0.1:3000/spotify_clone/songs/`);
    let response=await a.text();
    
    let div=document.createElement("div");
    div.innerHTML=response;
    let as=div.getElementsByTagName("a");
       let cardContainer=document.querySelector(".cardContainer");
       as=Array.from(as);
       for (let index = 0; index <as.length; index++) {
        const e=as[index];
        if(e.href.includes("/songs/")){
         let folder=e.href.split("/songs/")[1].replace("/","");
              
              let b=await fetch(`http://127.0.0.1:3000/spotify_clone/songs/${folder}/info.json`);
              let response2=await b.json();
              
           
              cardContainer.innerHTML=cardContainer.innerHTML+` <div class="card" data-folder="${folder}">
                     <div class="play">
                       
                            <img src="assets/play.svg" alt="" width="25px" >
                       
                    </div>
                  
                    <img src="songs/${folder}/${response2.image}" width="200px">
                    <h2>${response2.title}</h2>
                    <p>${response2.description}</p>
                </div>`
      }
        
       }
   
}
async function main(){

  await displayAlbums();
    let songs=await getSongs(currFolder);
    let defaultSong=songs[0]
    console.log(defaultSong)
    console.log(defaultSong.split(`${currFolder}/`)[1]);
    playMusic(`${defaultSong.split(`${currFolder}`)[1]}`,defaultSong.split(`${currFolder}/`)[1].split("-")[0].replaceAll("_"," "),true);
     let play=document.getElementById("play");
    play.addEventListener("click",()=>{
        if(currentSong.paused){
            currentSong.play();
            play.src="assets/pause.svg"
        }
        else {
            currentSong.pause();
            play.src="assets/playSong.svg";
        }
    })
  
  currentSong.addEventListener("timeupdate",(e) => {
    if(currentSong.currentTime!=0){
         
    
     document.querySelector(".songTime").innerHTML=`${secondsIntoMinutes(currentSong.currentTime)}/${secondsIntoMinutes(currentSong.duration)}`;
    document.querySelector(".circle").style.left=(currentSong.currentTime/currentSong.duration)*100+"%";

    }
   
    
   
}) 

    document.querySelector(".seekbar").addEventListener("click",(e) => {
        let percent=(e.offsetX/e.target.getBoundingClientRect().width)*100;
         document.querySelector(".circle").style.left=percent+"%";
         currentSong.currentTime=percent/100*currentSong.duration;
    });
   
    document.querySelector(".hamburger").addEventListener("click",() => {
      document.querySelector(".left").style.left=0;
    }
    )

    document.querySelector(".close").addEventListener("click",() => {
      document.querySelector(".left").style.left=-120+"%";
    }

    
    )

  

   document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e) => {
     
     currentSong.volume=parseInt(e.target.value)/100;
     if(currentSong.volume==0){
      document.querySelector(".volume").getElementsByTagName("img")[0].src="assets/muted.svg";
     }
     else{
      document.querySelector(".volume").getElementsByTagName("img")[0].src="assets/volume.svg";
     }
   }
   )

   Array.from(document.getElementsByClassName("card")).forEach((e) => {
     e.addEventListener("click",async (event) => {
       
       let songs=await getSongs("songs/"+event.currentTarget.dataset.folder);
       console.log(songs[0]);
       play.src="assets/pause.svg"
      let address=songs[0].split(`/${currFolder}/`)[1];
      playMusic(address,address.split(".mp3")[0].split("-")[0].replaceAll("_"," "));  
      document.querySelector(".left").style.left=0;
     }
     )
   }
   )

   document.querySelector(".volume").getElementsByTagName("img")[0].addEventListener("click",(e) => {
    if(currentSong.volume!=0){

     document.querySelector(".range").getElementsByTagName("input")[0].value=0;
     e.target.src="assets/muted.svg";
     currentSong.volume=0;
    }
    else{
      e.target.src="assets/volume.svg";
     currentSong.volume=0.1;
     document.querySelector(".range").getElementsByTagName("input")[0].value=10;
     }
   }
   )
} 
main();