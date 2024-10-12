import { useRef } from "react";
import { formatTime } from "../../utils";
import { AudioElementProps } from "../../types";
import "../../css/AudioElement.css";

export default function AudioElement({audioSrc}: AudioElementProps){

    const audioRef = useRef<HTMLAudioElement>(null);
    const playButtonRef = useRef<HTMLButtonElement>(null);
    const timelineRef = useRef<HTMLInputElement>(null);
    const minutesRef = useRef<HTMLSpanElement>(null);
    const secondsRef = useRef<HTMLSpanElement>(null);

    function setInitialTime(){
        if (audioRef.current && minutesRef.current && secondsRef.current) {
            const time = audioRef.current.duration;
            if (time !== Infinity) {
                secondsRef.current.innerText = formatTime(time, "seconds") as string;
                minutesRef.current.innerText = formatTime(time, "minutes") as string;
            } else {
                secondsRef.current.innerText = "00";
                minutesRef.current.innerText = "00";
            }
        }
    }

    function playPauseAudio(){
        if (audioRef.current?.paused){
            audioRef.current.play()
            playButtonRef.current?.classList.remove("fa-play");
            playButtonRef.current?.classList.add("fa-pause");
        } else {
            audioRef.current?.pause();
            playButtonRef.current?.classList.remove("fa-pause");
            playButtonRef.current?.classList.add("fa-play");
        }
    }

    function updateTimeline(){
        if (timelineRef.current && audioRef.current && minutesRef.current && secondsRef.current) {
            const currentTime = audioRef.current.currentTime;
            timelineRef.current.value = ((currentTime * 100)/audioRef.current.duration).toString();
            if (currentTime > 0) {
                secondsRef.current.innerText = formatTime(currentTime, "seconds") as string;
                minutesRef.current.innerText = formatTime(currentTime, "minutes") as string;
            }
            
        }
    }

    function updateCurrentTime(){
        if (audioRef.current && timelineRef.current){
            const time = (audioRef.current.duration * Number(timelineRef.current.value))/100;
            audioRef.current.currentTime = time;
        }
    }

    function resetTimeline(){
        if (audioRef.current && playButtonRef.current && minutesRef.current && secondsRef.current){
            const duration = audioRef.current.duration;
            audioRef.current.currentTime = 0;
            playButtonRef.current.classList.remove("fa-pause");
            playButtonRef.current.classList.add("fa-play");
            secondsRef.current.innerText = formatTime(duration, "seconds") as string;
            minutesRef.current.innerText = formatTime(duration, "minutes") as string;
        }
    }

    return(
        <div className="audioMessageControls">
            <button onClick={playPauseAudio} className="text-black">
                <i className="fa-solid fa-play" ref={playButtonRef} style={{color: "var(--defaultFontColor)"}}/>
            </button>
            <input type="range" 
            ref={timelineRef}
            onChange={updateCurrentTime}
            />
            <span ref={minutesRef}>00</span>:<span ref={secondsRef}>00</span>
            <audio 
            src={audioSrc} 
            ref={audioRef} 
            onLoadedMetadata={()=>{audioRef.current!.currentTime = 0}}
            onTimeUpdate={updateTimeline}
            onDurationChange={setInitialTime}
            onEnded={resetTimeline}
            />
        </div>
    )
}