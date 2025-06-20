document.addEventListener("DOMContentLoaded", async () => {
    const videoSlSt = document.querySelector(".collectionIntroVideoSlSt__container");
    const slstButton = document.querySelector(".collectionIntroVideoSlSt__button");
  
    const videoSlick = document.getElementById("videoSlick");
    const videoStreet = document.getElementById("videoStreet");
  
    const slickInput = document.querySelector(".slick__input");
    const streetInput = document.querySelector(".street__input");
  
    let videoStatus = false;
    const loadedVideos = new WeakSet();
  
    async function canPreloadVideo() {
      const testVideo = document.createElement("video");
      testVideo.muted = true;
      testVideo.playsInline = true;
      testVideo.src = "data:video/mp4;base64,AAAAHGZ0eXBtcDQyAAAAAG1wNDFtcDQyaXNvbQ==";
      try {
        await testVideo.play();
        testVideo.pause();
        return true;
      } catch {
        return false;
      }
    }
  
    function preloadVideo(video) {
      return new Promise((resolve) => {
        video.muted = true;
        video.preload = "auto";
  
        function cleanup() {
          video.removeEventListener("loadedmetadata", onLoadedMetadata);
          video.removeEventListener("canplaythrough", onCanPlayThrough);
        }
  
        function onLoadedMetadata() {
          if (video.readyState >= 3) {
            cleanup();
            resolve();
          } else {
            video.addEventListener("canplaythrough", onCanPlayThrough);
            setTimeout(() => {
              cleanup();
              resolve();
            }, 5000);
          }
        }
  
        function onCanPlayThrough() {
          cleanup();
          resolve();
        }
  
        video.addEventListener("loadedmetadata", onLoadedMetadata, { once: true });
        video.load();
      });
    }
  
    async function preloadVideos(videos) {
      await Promise.all(videos.map(preloadVideo));
    }
  
    const preloadCapable = await canPreloadVideo();
  
    if (preloadCapable) {
      await preloadVideos([videoSlick, videoStreet]);
      loadedVideos.add(videoSlick);
      loadedVideos.add(videoStreet);
      videoSlSt.style.display = "block";
    } else {
      videoSlSt.style.display = "block";
    }
  
    function loadVideoIfNeeded(video) {
      if (!loadedVideos.has(video)) {
        video.muted = true;
        video.load();
        loadedVideos.add(video);
      }
    }
  
    function playVideo(video) {
      video.muted = false;
      video.play();
    }
  
    function showVideo(video) {
      video.style.visibility = "visible";
      video.style.zIndex = 1;
    }
  
    function hideVideo(video) {
      video.style.visibility = "hidden";
      video.style.zIndex = 0;
    }
  
    let lastCurrentTime = 0;
  
    function switchVideo(fromVideo, toVideo) {
      lastCurrentTime = fromVideo.currentTime;
  
      if (videoStatus) {
        fromVideo.pause();
        loadVideoIfNeeded(toVideo);
        toVideo.currentTime = lastCurrentTime;
        hideVideo(fromVideo);
        showVideo(toVideo);
        playVideo(toVideo);
      } else {
        toVideo.currentTime = lastCurrentTime;
        hideVideo(fromVideo);
        showVideo(toVideo);
      }
    }
  
    videoSlSt.addEventListener("click", () => {
      if (!videoStatus) {
        videoStatus = true;
        slstButton.style.display = "none";
        loadVideoIfNeeded(videoSlick);
        loadVideoIfNeeded(videoStreet);
        if (slickInput.checked) {
          playVideo(videoSlick);
        } else if (streetInput.checked) {
          playVideo(videoStreet);
        }
      } else {
        videoStatus = false;
        slstButton.style.display = "flex";
        if (slickInput.checked) {
          videoSlick.pause();
          lastCurrentTime = videoSlick.currentTime;
        } else {
          videoStreet.pause();
          lastCurrentTime = videoStreet.currentTime;
        }
      }
    });
  
    slickInput.addEventListener("change", () => {
      if (slickInput.checked) switchVideo(videoStreet, videoSlick);
    });
  
    streetInput.addEventListener("change", () => {
      if (streetInput.checked) switchVideo(videoSlick, videoStreet);
    });
  
    // Initial setup
    showVideo(slickInput.checked ? videoSlick : videoStreet);
    hideVideo(slickInput.checked ? videoStreet : videoSlick);
  });

/*
document.addEventListener("DOMContentLoaded", () => {
    const videoSlSt = document.querySelector(".collectionIntroVideoSlSt__container");
    videoSlSt.style.display = "block"
    
    const slstButton = document.querySelector(".collectionIntroVideoSlSt__button");

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

            slstButton.style.display = "none"
            
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
            
            slstButton.style.display = "flex"

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
*/