import { useRef } from "react";
import axios from "axios";
import "../../css/AudioRecorder.css"

export default function AudioRecorder(){

    const mediaStream = useRef<any>(null);
    const mediaRecorder = useRef<any>(null);
    const chunks = useRef<any>([]);

    async function startRecording(){
        try {
        const stream = await navigator.mediaDevices.getUserMedia(
            { audio: true }
        );
        mediaStream.current = stream;
        mediaRecorder.current = new MediaRecorder(stream);

        mediaRecorder.current.ondataavailable = (e:any) => {
            if (e.data.size > 0) {
                //e.data is a BLOB
                chunks.current.push(e.data);
            }
        };

        mediaRecorder.current.onstop = () => {
            const recordedBlob = new Blob(
                chunks.current, { type: 'audio/wav' }
            );
            const audioFile = new File([recordedBlob], "voice.wav", {type: "audio/wav"});
            console.log(audioFile);
            const formData = new FormData();
            formData.append("audioFile", audioFile);
            axios.post("http://localhost:8800/postaudio", formData);
        };

        mediaRecorder.current.start();
        } catch (err) {
            console.error('Error accessing microphone:', err);
        }
    };

    function stopRecording (){
        if (mediaRecorder.current && mediaRecorder.current.state === 'recording') {
            mediaRecorder.current.stop();
        }
        if (mediaStream.current) {
            mediaStream.current.getTracks().forEach((track:any) => {
            track.stop();
        });
        }
    };

    return(
        <>
            <button onClick={startRecording} className="recordButton">
                <i className="fa-solid fa-microphone" style={{color: "black"}}/>
            </button>
            <button onClick={stopRecording} className="recordButton">
                <i className="fa-regular fa-circle-stop" style={{color: "black"}}/>
            </button>
        </>
    )
}