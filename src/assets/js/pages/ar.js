window.addEventListener('DOMContentLoaded', () => {

  //Store mobile slick-street labels in const
  const mobileToggle = document.querySelector(".slickstreet__mobile");

  //Check if user url contains /ar-experience and toggle visibility.
  if (window.location.pathname.includes("/ar-experience")) {
    if (mobileToggle){
      mobileToggle.style.display = "none";
    } 
  } else {
    if (mobileToggle){
      mobileToggle.style.display = "";
    } 
  }

  //If Javascript is detected (it is because this is read), hide AR link
  document.querySelectorAll('.nojs__link').forEach(link => {
    link.style.display = 'block';
  });

  //Get variables necessary for AR experience
  const detect = document.querySelectorAll("#detector")

  const UIScan = document.querySelector(".UI__posterScan p")
  const UIClick = document.querySelector(".UI__clickHere")
  const UILaunch = document.querySelector(".UI__posterLaunch")

  let currentVideo = null;
  let videoStatus = false

  //For each detector
  for (let i = 0; i < detect.length; i++){

    //Get a-video element to get attribute later
    const aVideo = detect[i].querySelector("a-video");

    //When corresponding poster is found
    detect[i].addEventListener("targetFound", () => {

      //Get element attribute
      const videoId = aVideo.getAttribute("src").substring(1);

      //Get video src by attribute value
      currentVideo = document.getElementById(videoId);

      //Fallback if no video is currently selected
      if (!currentVideo) {
        console.warn(`No video element found with id ${videoId}`);
        return;
      }

      //Show play button and link button
      videoStatus = true

      UIScan.style.display = "none"

      UIClick.style.display = "block"

      UILaunch.style.display = "block"
      
    });
    
    //When corresponding poster is lost
    detect[i].addEventListener("targetLost", () => {

      //Check if there is a current video and if it is currently playing, if yes, pause it
      if (currentVideo && !currentVideo.paused) {
        currentVideo.pause();
      }

      //Hide play and link button
      UIScan.style.display = "block"

      UIClick.style.display = "none"

      UILaunch.style.display = "none"

      videoStatus = false
      currentVideo = null
    });

  }

  //Listen for click on play button. If video is valid or paused, play it
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

  //Listen for link button click. If video is valid, get attribute "lead-to", check for path and send user to it
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

  //Function to check if mobile device is detected. If not, do not allow user to reach /ar-experience
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