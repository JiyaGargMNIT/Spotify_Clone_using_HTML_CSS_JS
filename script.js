console.log("Let's write Javascript");
  let currentSong=new Audio();
async function getSongs(){
    let a=await fetch("http://127.0.0.1:3000/spotify_clone/songs/");
    let response=await a.text();
    console.log(response);
    let div=document.createElement("div");
    div.innerHTML=response;
    let as=div.getElementsByTagName("a");
    let songs=[];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if(element.href.endsWith(".mp3")){
            songs.push(element.href);
        }
    }
    console.log(songs);
    return songs;
}

const playMusic=(track) => {
    currentSong.src="songs/"+track;
    currentSong.play();
}




async function main(){

  
    let songs=await getSongs();

    console.log(songs);
    let songUL=document.querySelector(".songList").getElementsByTagName("ul")[0];
    for (const song of songs) {
        songUL.innerHTML=songUL.innerHTML+`  <li>
                    <img src="assets/music.svg" width="30px" alt="" class="invert">
                    <div class="info">
                        <div>${song.split("/songs/")[1].split(".mp3")[0].replaceAll("_"," ").split("-")[0]}</div>
                        <div>${song.split("/songs/")[1].split(".mp3")[0].replaceAll("_"," ").split("-")[1]}</div>
                    </div>
                    <img src="assets/playsong.svg"  alt="" width="30px">
                </li>
</li>`
    }
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
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(element => {
            let divs=element.querySelector(".info").getElementsByTagName("div");
            let address=divs[0].innerHTML.replaceAll(" ","_")+"-"+divs[1].innerHTML.replaceAll(" ","_")+".mp3";
            
            element.addEventListener("click",() => {
                play.src="assets/pause.svg"
                console.log(address);
                playMusic(address);

            }
            )
    });

   
} 
main();