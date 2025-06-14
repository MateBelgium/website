window.addEventListener('DOMContentLoaded', () => {

    const detect = document.querySelectorAll("#detector")
    const UICont = document.querySelector(".UI__container")
    const UIScan = document.querySelector(".UI__posterScan")
    const UIClick = document.querySelector(".UI__clickHere")
    const video = document.querySelector("#video1");

    let videoStatus = false

    for (let i = 0; i < detect.length; i++){

      detect[i].addEventListener("targetFound", () => {

        UICont.style.justifyContent = "space-between"
        UIScan.style.color = "#1C1C1C"
        UIScan.textContent = "SCANNING POSTER"
        UIScan.style.height = "10vh"
        UIScan.style.fontWeight = "600"
        UIClick.style.opacity = "1"
        
        videoStatus = true
      });
      
      detect[i].addEventListener("targetLost", () => {
        
        UICont.style.justifyContent = "end"
        UIScan.style.color = "#1c1c1c75"
        UIScan.textContent = "Searching for poster.."
        UIScan.style.fontWeight = "500"
        UIScan.style.height = "7.5vh"
        UIClick.style.opacity = "0"
  
        video.pause();
  
        videoStatus = false
      });

    }

    document.body.addEventListener("click", () => {
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