import { useEffect, useRef, useState } from "react";
import Peer from "peerjs";
import { updateDoc, doc } from "firebase/firestore";
import { db } from "./utils.js";
import "./MainPage.css";
import { useNavigate } from "react-router-dom";

function MainPage() {
  const [peerId, setPeerId] = useState("");
  const [remotePeerIdValue, setRemotePeerIdValue] = useState("");
  const remoteVideoRef = useRef(null);
  const currentUserVideoRef = useRef(null);
  const peerInstance = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
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
    var getUserMedia =
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia;

    getUserMedia({ video: true, audio: true }, (mediaStream) => {
      currentUserVideoRef.current.srcObject = mediaStream;
      currentUserVideoRef.current.play();

      const call = peerInstance.current.call(remotePeerId, mediaStream);

      call.on("stream", (remoteStream) => {
        remoteVideoRef.current.srcObject = remoteStream;
        remoteVideoRef.current.play();
      });
    });
  };

  var makeCall = () => {
    // updateRobotStatusAsyncFunction(false);
    call(remotePeerIdValue);
  };

  var endCall = () => {
    // navigate("/", { replace: true });
    // updateRobotStatusAsyncFunction(true);
    window.location.reload();
  };

  var updateRobotStatusAsyncFunction = async (robotAvailable) => {
    try {
      const docRef = doc(db, "robots", "UTB-Tele-Bot");
      await updateDoc(docRef, {
        available: robotAvailable,
      });
      if (robotAvailable) {
        window.location.reload();
      } else {
        call(remotePeerIdValue);
      }
      console.log("Document update with ID: ", docRef.id);
    } catch (e) {
      console.error("Error updating document: ", e);
      alert("Error !! Please Try again");
    }
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
            Connect
          </button>
          <button onClick={endCall} id="buttonStop">
            End
          </button>
        </div>
        <text id="header">Current user ID is: {peerId}</text>
        <input
          id="text-input"
          type="text"
          value={remotePeerIdValue}
          onChange={(e) => setRemotePeerIdValue(e.target.value)}
        />
        <div id="control-holder">
          <button id="button-up">UP</button>
          <button id="button-stop">Stop</button>
          <button id="button-down">Down</button>
          <button id="button-left">Left</button>
          <button id="button-right">Right</button>
        </div>
      </div>
    </div>
  );
}

export default MainPage;
