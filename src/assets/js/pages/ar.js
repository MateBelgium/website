window.addEventListener('DOMContentLoaded', () => {

    const mobileToggle = document.querySelector(".slickstreet__mobile");

    if (window.location.pathname.includes("/ar-experience")) {
      if (mobileToggle){
        mobileToggle.style.display = "none";
      } 
    } else {
      if (mobileToggle){
        mobileToggle.style.display = "";
      } 
    }
  
    document.querySelectorAll('.nojs__link').forEach(link => {
      link.style.display = 'block';
    });

    const detect = document.querySelectorAll("#detector")

    const UIScan = document.querySelector(".UI__posterScan p")
    const UIClick = document.querySelector(".UI__clickHere")
    const UILaunch = document.querySelector(".UI__posterLaunch")

    let currentVideo = null;
    let videoStatus = false

    for (let i = 0; i < detect.length; i++){

      const aVideo = detect[i].querySelector("a-video");

      detect[i].addEventListener("targetFound", () => {

        // get id from src attribute (e.g. "#video1")
        const videoId = aVideo.getAttribute("src").substring(1);

        // select actual video element inside <a-assets>
        currentVideo = document.getElementById(videoId);

        if (!currentVideo) {
          console.warn(`No video element found with id ${videoId}`);
          return;
        }

        videoStatus = true

        UIScan.style.display = "none"

        UIClick.style.opacity = "1"

        UILaunch.style.display = "block"
        
      });
      
      detect[i].addEventListener("targetLost", () => {

        if (currentVideo && !currentVideo.paused) {
          currentVideo.pause();
        }

        UIScan.style.display = "block"

        UIClick.style.opacity = "0"

        UILaunch.style.display = "none"
  
        videoStatus = false
        currentVideo = null
      });

    }

    UILaunch.addEventListener("click", () => {
      if (videoStatus && currentVideo){

        console.log("videoStatus is", videoStatus);
        console.log("currentVideo is", currentVideo);
        
        if (currentVideo.paused) {
          currentVideo.play();
          console.log("playing")

        }else{
          currentVideo.pause();
        }
        
      }
    });

    UIClick.addEventListener("click", () => {
      if (videoStatus && currentVideo){

        currentVideo.pause();

        const leadTo = currentVideo.getAttribute("lead-to");

        switch(leadTo){
          case "shop":
            window.location.href = "/shop";
            break;

          case "collection":
            window.location.href = "/collection";
            break;

          case "event":
            window.open("https://www.facebook.com/events/1780769076050190", "_blank");
            break;

          default:
            console.log("no poster detected, cannot send you anywhere homie")
        }


        
      }
    });

    function isMobileDevice() {
      console.log("Checking if phone")
      const navLink = document.querySelectorAll('a[href="/ar"]');
      console.log(navLink)
      const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    
      if (!isMobile) {
        console.log("this is not a phone")
          for (let i = 0; i < navLink.length; i++) {
              const parent = navLink[i].parentElement;
              if (parent && parent.tagName === 'LI') {
                  console.log("removed link")
                  parent.style.display = "none";
                } else {
                  console.log("removed link")
                  navLink[i].style.display = "none";
              }
          }
    
          if (["/ar", "/ar-experience"].includes(window.location.pathname)) {
              window.location.href = "/arerror";
          }
      }
    }

    isMobileDevice();

});


