import { useRef } from "react";
import axios from "axios";
import { AudioRecorderProps } from "../../types";
import "../../css/AudioRecorder.css"

//TODO: find a way to execute sendMessage without having the formevent available in this component
//or rewrite the function in a different way, or make the api post call directly
//TODO: sender_username is not being sent to the database on message post
export default function AudioRecorder({newMessageState, actions}: AudioRecorderProps){
    const audioControlsRef = useRef<HTMLDivElement>(null);
    const startRecordingRef = useRef<HTMLButtonElement>(null);
    const stopRecordingRef = useRef<HTMLButtonElement>(null);
    const cancelRecordingRef = useRef<HTMLButtonElement>(null);
    
    const mediaStream = useRef<MediaStream | null>(null);
    const mediaRecorder = useRef<MediaRecorder | null>(null);
    const audioBlob = useRef<Blob[]>([]);
    let discarding:boolean = false;

    const [newMessage, setNewMessage] = newMessageState;

    const sendMessage = actions;

    async function startRecording(){
        try {
        //Get streaming device
        mediaStream.current = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder.current = new MediaRecorder(mediaStream.current);

        //(When audio data becomes available) save audio file as blob into audioBlob.current
        mediaRecorder.current.ondataavailable = (e:BlobEvent)=>{
            if (e.data.size > 0) {
                audioBlob.current.push(e.data);
            }
        };

        //(When recording starts) (re)set discarding to false
        mediaRecorder.current.onstart = ()=>{
            discarding = false;
        }

        //(When recording is stopped) convert blob to .wav file and post it to public/audio recordings
        mediaRecorder.current.onstop = ()=>{
            if (!discarding) {
                const recordedBlob = new Blob(
                    audioBlob.current, { type: 'audio/wav' }
                );
                const audioFile = new File([recordedBlob], "voice.wav", {type: "audio/wav"});
                const formData = new FormData();
                const timeNow = Date.now().toString();
                formData.append("audioFile", audioFile);
                formData.append("time", timeNow);
                try {
                    axios.post("http://localhost:8800/postaudio", formData)
                    .then(()=>{
                        setNewMessage({
                        ...newMessage, 
                        content: null, 
                        audio_content: `/audio recordings/audio_recording_${timeNow}.wav`
                        });
                        (e:any)=>{sendMessage(e)};
                    });
                } catch (err) {
                    console.error("The application encountered an error trying to save the audio file:" + err);
                }
            }
            if (audioControlsRef.current && startRecordingRef.current && stopRecordingRef.current && cancelRecordingRef.current){
                audioControlsRef.current.style.top = "33px";
                startRecordingRef.current.style.borderRadius = "50%";
                startRecordingRef.current.style.borderTop = "2px solid var(--sendButtonPrimary)";
                stopRecordingRef.current.style.display = "none";
                cancelRecordingRef.current.style.display = "none";
            }
            audioBlob.current = [];
        };

        //Start recording and style audio controls accordingly
        mediaRecorder.current.start();
        if (audioControlsRef.current && startRecordingRef.current && stopRecordingRef.current && cancelRecordingRef.current){
            audioControlsRef.current.style.top = "-1px";
            startRecordingRef.current.style.borderRadius = "0% 0% 50% 50%";
            startRecordingRef.current.style.borderTop = "none";
            stopRecordingRef.current.style.display = "block";
            cancelRecordingRef.current.style.display = "block";
        }
        } catch (err) {
            console.error('Error accessing microphone:', err);
        }
    };

    function stopRecording (){
        if (mediaRecorder.current && mediaRecorder.current.state === 'recording'){
            mediaRecorder.current.stop();
        }
    };

    function cancelRecording(){
        discarding = true;
        if (mediaRecorder.current && mediaRecorder.current.state === 'recording'){
            mediaRecorder.current.stop();
        }
    }

    return(
        <div className="d-flex align-items-center" id="audioControls" ref={audioControlsRef}>
            <button 
            onClick={startRecording} 
            className="recordButton"
            id="startRecording"
            ref={startRecordingRef}>
                <div className="recordButtonBg">
                    <i className="fa-solid fa-microphone" style={{color: "var(--sendButtonPrimary)"}}/>
                </div>
            </button>
            <button 
            onClick={stopRecording} 
            className="recordButton" 
            id="stopRecording"
            ref={stopRecordingRef}>
                <div className="recordButtonBg">
                    <i className="fa-regular fa-circle-stop" style={{color: "var(--sendButtonPrimary)"}}/>
                </div>
            </button>
            <button 
            onClick={cancelRecording}
            className="recordButton"
            id="cancelRecording" 
            ref={cancelRecordingRef}>
                <div className="recordButtonBg">
                    <i className="fa-solid fa-trash" style={{color: "var(--sendButtonPrimary)"}}/>
                </div>
            </button>
        </div>
    )
}