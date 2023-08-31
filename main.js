let net;
let video;
const loadPoseNet = async () => {
  net = await posenet.load({
    architecture: "MobileNetV1",
    outputStride: 16,
    inputResolution: 513,
    multiplier: 0.75,
  });

  video = await loadVideo();

  detectPoseInRealTime(video);
};

const loadVideo = async () => {
  const video = await setupCamera();
  video.play();
  return video;
};

const setupCamera = async () => {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    throw new Error(
      "Browser API navigator.mediaDevices.getUserMedia not available"
    );
  }

  const video = document.getElementById("video");
  video.width = window.innerWidth;
  video.height = window.innerHeight;

  const stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: {
      facingMode: "user",
      width: window.innerWidth,
      height: window.innerHeight,
    },
  });
  video.srcObject = stream;
  console.log('r u running');
  return new Promise(
    (resolve) => (video.onloadedmetadata = () => resolve(video))
  );
};

const detectPoseInRealTime = async (video) => {
  async function poseDetectionFrame() {
    const imageScaleFactor = 0.5;
    const outputStride = 16;
    const flipHorizontal = false;
    let poses = [];

    const pose = await net.estimateSinglePose(
          video,
          imageScaleFactor,
          flipHorizontal,
          outputStride
    );
    poses.push(pose);

    let minPoseConfidence = 0.1;
    let minPartConfidence = 0.5;

    poses.forEach(({ score, keypoints }) => {
      if (score >= minPoseConfidence) {
          const leftWrist = keypoints.find((k) => k.part === "leftWrist");
          const rightWrist = keypoints.find((k) => k.part === "rightWrist");

          console.log(leftWrist.position); // will return an object with shape {x: 320, y: 124};
          console.log(rightWrist.position); // will return an object with shape {x: 320, y: 124};
      }
    });
    requestAnimationFrame(poseDetectionFrame);
  }
  poseDetectionFrame();
};
loadPoseNet();