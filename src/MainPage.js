import { useEffect, useRef, useState } from "react";
import Peer from "peerjs";
import { onSnapshot, updateDoc, doc, getDoc } from "firebase/firestore";
import { db } from "./utils.js";
import "./MainPage.css";
import { useNavigate } from "react-router-dom";
// import { async } from "@firebase/util";
import io from "socket.io-client";
const socket = io.connect("socket-io-server-utb-tele-bot.herokuapp.com");
// const socket = io.connect("http://localhost:3001");

function MainPage() {
  const [peerId, setPeerId] = useState("");
  const [remotePeerIdValue, setRemotePeerIdValue] = useState("UTB");
  const [connectButtonPressed, setconnectButtonPressed] = useState(false);
  const [stopButtonPressed, setStopButtonPressed] = useState(false);
  const [currentPeer, setCurrentPeer] = useState([]);
  // const [screenStream, setScreenStream] = useState([]);
  // const [screenSharing, setScreenSharing] = useState(false);
  const [localStream, setLocalStream] = useState([]);
  const remoteVideoRef = useRef(null);
  const currentUserVideoRef = useRef(null);
  const peerInstance = useRef(null);
  // const currentPeer = useRef(null);
  const navigate = useNavigate();


  // onSnapshot(doc(db, "robots", "UTB-Tele-Bot"), (doc) => {
  //   console.log("Current data: ", doc.data().available);
  //   setrobotStatus(!(doc.data().available))
  // });

  useEffect(() => {
    socket.emit("join_room", "16");
    const peer = new Peer();

    peer.on("open", (id) => {
      setPeerId(id);
    });

    peer.on("call", (call) => {
      var getUserMedia =
        navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.mediaDevices;

      getUserMedia({ video: true, audio: true }, (mediaStream) => {
        currentUserVideoRef.current.srcObject = mediaStream;
        currentUserVideoRef.current.play();
        call.answer(mediaStream);
        call.on("stream", function (remoteStream) {
          remoteVideoRef.current.srcObject = remoteStream;
          remoteVideoRef.current.play();
        });
      });
    });

    peerInstance.current = peer;
  }, []);

  const call = (remotePeerId) => {
    // console.log("HEllo there this is called")

    var getUserMedia =
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia;

    getUserMedia({ video: true, audio: true }, (mediaStream) => {
      setLocalStream(mediaStream)
      currentUserVideoRef.current.srcObject = mediaStream;
      currentUserVideoRef.current.play();

      const call = peerInstance.current.call(remotePeerId, mediaStream);
      // I added
      setCurrentPeer(call)

      call.on("stream", (remoteStream) => {
        remoteVideoRef.current.srcObject = remoteStream;
        remoteVideoRef.current.play();
      });
    });

    // navigator.mediaDevices.getDisplayMedia({ video: true }).then((mediaStream) => {
    //   currentUserVideoRef.current.srcObject = mediaStream;
    //   currentUserVideoRef.current.play();

    //   const call = peerInstance.current.call(remotePeerId, mediaStream);

    //   call.on("stream", (remoteStream) => {
    //     remoteVideoRef.current.srcObject = remoteStream;
    //     remoteVideoRef.current.play();
    //   });
    // });
  };

  var screenStream;
  var screenSharing = false
  
  function startScreenShare() {
    if (screenSharing) {
      stopScreenSharing();
    }
    navigator.mediaDevices.getDisplayMedia({ video: true }).then((stream) => {
      screenStream = stream;
      let videoTrack = screenStream.getVideoTracks()[0];
      // let videoTrack = stream.getVideoTracks()[0];
      videoTrack.onended = () => {
        stopScreenSharing();
      };
      if (peerInstance) {
        let sender = currentPeer.peerConnection.getSenders().find(function (s) {
          return s.track.kind == videoTrack.kind;
        });
        screenSharing = true;
        sender.replaceTrack(videoTrack);
      }
      console.log(screenStream);
      // console.log(stream);
    });
  }


  function stopScreenSharing() {
    console.log(`We are running this ${screenSharing}`)
    if (!screenSharing) return;
    console.log(`We are running this`)
    let videoTrack = localStream.getVideoTracks()[0];
    if (peerInstance) {
      let sender = currentPeer.peerConnection.getSenders().find(function (s) {
        return s.track.kind == videoTrack.kind;
      });
      sender.replaceTrack(videoTrack);
    }
    screenStream.getTracks().forEach(function (track) {
      track.stop();
    });
    screenSharing = false;
  }

  var getStatusOfBot = async () => {
    const docRef = doc(db, "robots", "UTB-Tele-Bot");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      setconnectButtonPressed(false);
      if (docSnap.data().available) {
        updateRobotStatusAsyncFunction(false);
      } else {
        alert("UTB Tele Bot is in use !!");
      }
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
      alert("Error checking status !! Please Try Again");
      setconnectButtonPressed(true);
    }
  };

  var makeCall = () => {
    getStatusOfBot();
    setconnectButtonPressed(true);
  };

  var endCall = () => {
    // navigate("/", { replace: true });
    updateRobotStatusAsyncFunction(true);
    setStopButtonPressed(true);
    // window.location.reload();
  };

  var updateRobotStatusAsyncFunction = async (robotAvailable) => {
    try {
      const docRef = doc(db, "robots", "UTB-Tele-Bot");
      await updateDoc(docRef, {
        available: robotAvailable,
      });
      if (robotAvailable) {
        window.location.reload();
        await updateDoc(docRef, {
          endPressed: true,
        });
      } else {
        call(remotePeerIdValue);
        setStopButtonPressed(false);
      }
      console.log("Document update with ID: ", docRef.id);
    } catch (e) {
      console.error("Error updating document: ", e);
      alert("Error !! Please Try again");
    }
  };

  //Socket Functions to control Bot

  const sendMessage_Front = () => {
    socket.emit("send_message", { message: "F", room: "16" });
    // startScreenShare()
  };

  const sendMessage_Stop = () => {
    socket.emit("send_message", { message: "S", room: "16" });
  };

  const sendMessage_Back = () => {
    socket.emit("send_message", { message: "B", room: "16" });
  };

  const sendMessage_Left = () => {
    socket.emit("send_message", { message: "L", room: "16" });
  };

  const sendMessage_Right = () => {
    socket.emit("send_message", { message: "R", room: "16" });
  };

  return (
    <div className="App">
      <div id="video-container">
        {/* <div id = {"primary-video-container"}> */}
        {/* <video ref={currentUserVideoRef} id = {"primary-video"} playsInline/> */}
        <video ref={remoteVideoRef} id={"primary-video"} playsInline />
        {/* </div> */}
        {/* <div id = {"secondary-video-container"}> */}
        {/* <video ref={remoteVideoRef} id = {"secondary-video"} playsInline/> */}
        <video
          ref={currentUserVideoRef}
          muted
          id={"secondary-video"}
          playsInline
        />
        {/* </div> */}
      </div>
      <div id="control-container">
        <div id="buttonHolder">
          {/* <button id="button" onClick={() => call(remotePeerIdValue)}> */}
          <button id="button" onClick={makeCall}>
            {connectButtonPressed ? "Connecting..." : "Connect"}
          </button>
          <button onClick={endCall} id="buttonStop">
            {stopButtonPressed ? "Ending..." : "End"}
          </button>
        </div>
        {/* <text id="header">Current user ID is: {peerId}</text>
        <input
          id="text-input"
          type="text"
          value={remotePeerIdValue}
          onChange={(e) => setRemotePeerIdValue(e.target.value)}
        /> */}
        <div id="control-holder">
          <button id="button-up" onClick={sendMessage_Front}>
            Front
          </button>
          <button id="button-stop" onClick={sendMessage_Stop}>
            Stop
          </button>
          <button id="button-down" onClick={sendMessage_Back}>
            Back
          </button>
          <button id="button-left" onClick={sendMessage_Left}>
            Left
          </button>
          <button id="button-right" onClick={sendMessage_Right}>
            Right
          </button>
        </div>
        <button id="screen-share-button" onClick={startScreenShare}>
            Share Screen
        </button>
      </div>
    </div>
  );
}

export default MainPage;
