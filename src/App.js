import { useEffect, useRef, useState } from 'react';
import Peer from 'peerjs';
import './App.css';

function App() {
  const [peerId, setPeerId] = useState('');
  const [remotePeerIdValue, setRemotePeerIdValue] = useState('');
  const remoteVideoRef = useRef(null);
  const currentUserVideoRef = useRef(null);
  const peerInstance = useRef(null);

  useEffect(() => {
    const peer = new Peer();

    peer.on('open', (id) => {
      setPeerId(id)
    });

    peer.on('call', (call) => {
      var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.mediaDevices;

      getUserMedia({ video: true, audio: true }, (mediaStream) => {
        currentUserVideoRef.current.srcObject = mediaStream;
        currentUserVideoRef.current.play();
        call.answer(mediaStream)
        call.on('stream', function(remoteStream) {
          remoteVideoRef.current.srcObject = remoteStream
          remoteVideoRef.current.play();
        });
      });
    })

    peerInstance.current = peer;
  }, [])

  const call = (remotePeerId) => {
    var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

    getUserMedia({ video: true, audio: true }, (mediaStream) => {

      currentUserVideoRef.current.srcObject = mediaStream;
      currentUserVideoRef.current.play();

      const call = peerInstance.current.call(remotePeerId, mediaStream)

      call.on('stream', (remoteStream) => {
        remoteVideoRef.current.srcObject = remoteStream
        remoteVideoRef.current.play();
      });
    });
  }

  return (
    <div className="App">
      <div id= "video-container">
        {/* <div id = {"primary-video-container"}> */}
          {/* <video ref={currentUserVideoRef} id = {"primary-video"} playsInline/> */}
          <video ref={remoteVideoRef} id = {"primary-video"} playsInline/>
        {/* </div> */}
        {/* <div id = {"secondary-video-container"}> */}
          {/* <video ref={remoteVideoRef} id = {"secondary-video"} playsInline/> */}
          <video ref={currentUserVideoRef} muted id = {"secondary-video"} playsInline/>
        {/* </div> */}
      </div>
      <div id = "control-container">
        <text id='header'>Current user id is: {peerId}</text>
        <input id='text-input'type="text" value={remotePeerIdValue} onChange={e => setRemotePeerIdValue(e.target.value)} />
        <button id='button'onClick={() => call(remotePeerIdValue)}>Call</button>
      </div>
    </div>
  );
}

export default App;