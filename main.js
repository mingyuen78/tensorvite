let net;
let video;
let VIDEOMAX_WIDTH = window.innerWidth;
let VIDEOMAX_HEIGHT = window.innerHeight;
//let VIDEOMAX_WIDTH = 800;
//let VIDEOMAX_HEIGHT = 600;
window._rightWrist = 0;
window._leftWrist = 0;
const loadPoseNet = async () => {
  net = await posenet.load({
    architecture: "MobileNetV1",
    outputStride: 16,
    inputResolution: 513,
    multiplier: 0.75,
  });
  
  video = await loadVideo();
  if (video) {
    let evt = new Event("TensorReady", {data: true});
    window.dispatchEvent(evt);
    detectPoseInRealTime(video);
  }
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
  video.width = VIDEOMAX_WIDTH;
  video.height = VIDEOMAX_HEIGHT;

  const stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: {
      facingMode: "user",
      width: VIDEOMAX_WIDTH,
      height: VIDEOMAX_HEIGHT,
    },
  });
  video.srcObject = stream;
  return new Promise(
    (resolve) => (video.onloadedmetadata = () => resolve(video))
  );
};

const detectPoseInRealTime = async (video) => {
  async function poseDetectionFrame() {
    const imageScaleFactor = 0.5;
    const outputStride = 16; //8/16/32
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
        const rightWrist = keypoints.find((k) => k.part === "rightWrist");
        const leftWrist = keypoints.find((k) => k.part === "leftWrist");
        window._rightWrist = rightWrist.position; 
        console.log(rightWrist.position);
         
      }
    });
    requestAnimationFrame(poseDetectionFrame);
  }
  poseDetectionFrame();
};

import Preload from './src/scenes/preload';
import Track from './src/scenes/track';
import 'phaser';

class GameMain {
  constructor() {
    let config = {
        type: Phaser.WEBGL,
        width: VIDEOMAX_WIDTH,
        height: VIDEOMAX_HEIGHT,
        parent:'phaserApp',
        physics: {
          default: 'arcade',
          arcade: {
              gravity: { y: 1 },
              debug: true
          }
        },
        render: {
          pixelArt: false,
        },
        backgroundColor: '#aaa',
        scale: {
            mode: Phaser.Scale.ENVELOP,
            autoCenter: Phaser.Scale.CENTER_HORIZONTALLY
        },
    };
    this.game = new Phaser.Game(config);
    this.game.scene.add("Preload", Preload, true);    
    this.game.scene.add("Track", Track); 
  }    
}
const gm = new GameMain();
loadPoseNet();