document.addEventListener("DOMContentLoaded", async () => {

  //Get variables needed for switch experience
  const videoSlSt = document.querySelector(".collectionIntroVideoSlSt__container");
  const slstButton = document.querySelector(".collectionIntroVideoSlSt__button");

  const videoSlick = document.getElementById("videoSlick");
  const videoStreet = document.getElementById("videoStreet");

  const slickInput = document.querySelector(".slick__input");
  const streetInput = document.querySelector(".street__input");

  let videoStatus = false;
  const loadedVideos = new WeakSet();

  //Check if user is using IOS
  function isIOS(){
    return /iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  }

  //Test if video CAN be preloaded. 
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

  //Preload video function. Checks if video is playable for a few frames
  function preloadVideo(video) {
    return new Promise((resolve) => {
      video.muted = true;
      video.preload = "auto";

      //Remove event listener when video is ALMOST fully loaded
      function cleanup() {
        video.removeEventListener("loadedmetadata", onLoadedMetadata);
        video.removeEventListener("canplaythrough", onCanPlayThrough);
      }

      //Check if video is playable for a few frames.
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
      
      //When video is playable.
      function onCanPlayThrough() {
        cleanup();
        resolve();
      }

      video.addEventListener("loadedmetadata", onLoadedMetadata, { once: true });
      video.load();
    });
  }

  //Preload all given videos (if allowed previously)
  async function preloadVideos(videos) {
    await Promise.all(videos.map(preloadVideo));
  }

  const preloadCapable = await canPreloadVideo();

  //If video is preloadable, show it
  if (preloadCapable) {
    await preloadVideos([videoSlick, videoStreet]);
    loadedVideos.add(videoSlick);
    loadedVideos.add(videoStreet);
    videoSlSt.style.display = "block";
  } else {
    videoSlSt.style.display = "block";
  }

  //Check if video needs to be loaded
  function loadVideoIfNeeded(video) {
    if (!loadedVideos.has(video)) {
      video.muted = true;
      video.load();
      loadedVideos.add(video);
    }
  }

  //Play function
  function playVideo(video) {
    video.muted = false;
    video.play();
  }

  //Show video function
  function showVideo(video) {
    video.style.visibility = "visible";
    video.style.zIndex = 1;
  }

  //Hide video function
  function hideVideo(video) {
    video.style.visibility = "hidden";
    video.style.zIndex = 0;
  }

  let lastCurrentTime = 0;

  //Function executed when label switch is detected
  function switchVideo(fromVideo, toVideo) {
    const transition = document.querySelector(".slstTransition");
    lastCurrentTime = fromVideo.currentTime;

    if (videoStatus) {
      fromVideo.pause();

      transition.currentTime = 0;
      transition.play();

      //Find the second frame of the animation (approx)
      const transitionSwitch = transition.duration * 0.22;

      const checkSwitchTime = () => {

        if(transition.currentTime >= transitionSwitch){

          transition.removeEventListener('timeupdate', checkSwitchTime);

          loadVideoIfNeeded(toVideo);
          toVideo.currentTime = lastCurrentTime;
  
          hideVideo(fromVideo);
          showVideo(toVideo);
          playVideo(toVideo);

        }
      }

      transition.addEventListener('timeupdate', checkSwitchTime);

    } else {
      toVideo.currentTime = lastCurrentTime;
      hideVideo(fromVideo);
      showVideo(toVideo);
    }
  }

  //Listen for click on play button
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

  //Listen for change in input
  slickInput.addEventListener("change", () => {
    if (slickInput.checked) switchVideo(videoStreet, videoSlick);
  });
  
  //Listen for change in input
  streetInput.addEventListener("change", () => {
    if (streetInput.checked) switchVideo(videoSlick, videoStreet);
  });

  //If IOS is detectes, remove slick street experience container
  if(isIOS()){
    console.log("You are using IOS and they don't allow .webm files, sorryyyyy");
    const pubForIphone = document.querySelector(".pubForIphone");
    pubForIphone.style.display = "block";
    videoSlSt.style.display = "none";
  }

  // Initial setup
  showVideo(slickInput.checked ? videoSlick : videoStreet);
  hideVideo(slickInput.checked ? videoStreet : videoSlick);
});