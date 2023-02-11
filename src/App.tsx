import { useEffect, useRef, useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'

function App() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [showVideo, setShowVideo] = useState(false)
  const [stream, setStream] = useState<MediaStream | null>(null)


  const setVideoRef = (_stream: MediaStream | null) => {
    if (videoRef.current) {
      videoRef.current.srcObject = _stream
    }
  }

  const handleUserMedia = (_stream: MediaStream) => {
    setStream(_stream)
    setVideoRef(_stream)
  }

  const requestUserMedia = () => {
    if (!('mediaDevices' in navigator)) {
      throw new Error('This browser not able to use media devices')
    }

    if (showVideo) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then(stream => {
          // Should be check if exist a old stream open
          handleUserMedia(stream)
        })
    } else {
      if (stream) {
        stream.getTracks().forEach(track => {
          stream.removeTrack(track)
          track.stop()
          setVideoRef(null)
        })
      }

    }
  }


  useEffect(() => {
    requestUserMedia()
  }, [showVideo])

  return (
    <div className="App">
      <video ref={videoRef} style={{ transform: 'scaleX(-1)' }} autoPlay />
      <div className="card">
        <button>
          Take a photo
        </button>
        <button onClick={() => setShowVideo(!showVideo)}>
          {showVideo ? 'Turn off cam' : 'Turn on cam'}
        </button>
        <p>
          Smile! you're being recorded
        </p>
      </div>
    </div>
  )
}

export default App
