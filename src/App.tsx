import { useEffect, useMemo, useRef, useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'

function App() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [showVideo, setShowVideo] = useState(false)
  const [stream, setStream] = useState<MediaStream | null>(null)

  const videoDimensions = useMemo(() => ({ width: 600, height: 400 }), [])


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
        .getUserMedia({ video: true, audio: true })
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

  const getCanvas = () => {
    if (!videoRef.current) return
    const { height, width } = videoDimensions
    const canvas = document.createElement('canvas')
    canvas.height = height
    canvas.width = width
    canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0, width, height)
    return canvas

  }

  const takeScreenShot = () => {
    const canvas = getCanvas()
    console.log(canvas?.toDataURL())
  }

  useEffect(() => {
    requestUserMedia()
  }, [showVideo])

  return (
    <div className="App">
      <video ref={videoRef} style={{ ...videoDimensions, transform: 'scaleX(-1)' }} autoPlay />
      <div className="card">
        {showVideo && (<button onClick={takeScreenShot}>
          Take a photo
        </button>)}
        <button onClick={() => setShowVideo(!showVideo)}>
          {showVideo ? 'Turn off cam' : 'Turn on cam'}
        </button>
        {showVideo && (<p>
          Smile! you're being recorded
        </p>)}
      </div>
    </div>
  )
}

export default App
