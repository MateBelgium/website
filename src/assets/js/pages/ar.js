window.addEventListener('DOMContentLoaded', () => {

    const detect = document.querySelectorAll("#detector")

    const UIScan = document.querySelector(".UI__posterScan p")
    const UIClick = document.querySelector(".UI__clickHere")
    const UILaunch = document.querySelector(".UI__posterLaunch")
    const video = document.querySelector("#video1");

    let videoStatus = false

    for (let i = 0; i < detect.length; i++){

      detect[i].addEventListener("targetFound", () => {

        UIScan.style.display = "none"

        UIClick.style.opacity = "1"

        UILaunch.style.display = "block"
        
        videoStatus = true
      });
      
      detect[i].addEventListener("targetLost", () => {

        UIScan.style.display = "block"

        UIClick.style.opacity = "0"

        UILaunch.style.display = "none"
  
        video.pause();
  
        videoStatus = false
      });

    }

    UILaunch.addEventListener("click", () => {
      if (videoStatus){

        if (video.paused) {
          video.play();

        }else{
          video.pause();

        }
        
      }
    });

    UIClick.addEventListener("click", () => {
      if (videoStatus){

        video.pause();

        window.location.href = "/shop";
        
      }
    });
});


function isMobileDevice() {
    const navLink = document.querySelectorAll('a[href="/ar"]');
    console.log(navLink)
    const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    if (!isMobile) {

        for(let i = 0; i < navLink.length; i++){
            if (navLink[i].parentElement && parent.tagName === 'li'){
                navLink[i].parentElement.style.display = "none"
            }else{
                navLink[i].style.display = "none"
            }
        }

        if (["/ar", "/ar-experience"].includes(window.location.pathname)) {
            window.location.href = "/arerror";
        }
    }
}

isMobileDevice();