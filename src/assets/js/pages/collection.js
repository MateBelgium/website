document.addEventListener("DOMContentLoaded", () => {
    const videoSlSt = document.querySelector(".collectionIntroVideoSlSt__container");
    videoSlSt.style.display = "block"

    const videoSlick = document.getElementById("videoSlick");
    const videoStreet = document.getElementById("videoStreet");
    
    const slickInput = document.querySelector(".slick__input");
    const streetInput = document.querySelector(".street__input");

    let videoStatus = false;
    
    function switchVideo(fromVideo, toVideo) {

        const time = fromVideo.currentTime;

        if(!videoStatus){

            toVideo.currentTime = time;
            fromVideo.hidden = true;
            toVideo.hidden = false;

            console.log("videoStatus is " + videoStatus)
            
        }else{
            
            fromVideo.pause();
            toVideo.currentTime = time;
            toVideo.play();
            fromVideo.hidden = true;
            toVideo.hidden = false;
            
            console.log("videoStatus is " + videoStatus)

        }

    }

    videoSlSt.addEventListener("click", () => {

        if(!videoStatus){

            videoStatus = true
   
            if (slickInput.checked){
                videoSlick.play();
                console.log("playing slick")
            }else if(streetInput.checked){
                videoStreet.play();
                console.log("playing street")
            }else{
                return
            };

        }else{

            videoStatus = false

            if (slickInput.checked){
                videoSlick.pause();
                console.log("pausing slick")
            }else{
                videoStreet.pause();
                console.log("pausing street")
            };
        }
      });
    
    slickInput.addEventListener("change", () => {
      if (slickInput.checked) switchVideo(videoStreet, videoSlick);
    });
    
    streetInput.addEventListener("change", () => {
      if (streetInput.checked) switchVideo(videoSlick, videoStreet);
    });
});