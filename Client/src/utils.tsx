import { createContext, RefObject } from "react";
import { User } from "./types";

//Expected input: a datetime string in the format given by the current_timestamp() SQL function
export function getDate(date: string){
    const unformattedYear:RegExpMatchArray | null = date.match(/\d{4}/g);
    const monthAndDay:RegExpMatchArray | null = date.match(/-\d{2}/g);
    if (unformattedYear && monthAndDay) {
        const year:string = unformattedYear[0].slice(2);
        const month:string = monthAndDay[0].slice(1);
        const day:string = monthAndDay[1].slice(1);
        return day + "/" + month + "/" + year;
    }
}

//Expected input: a datetime string in the format given by the current_timestamp() SQL function, and an integer between -12 and 12
//Time adjustment is calculated based on GMT
export function getTime(time: string, time_adjustment:number){
    const hoursAndMinutes:RegExpMatchArray | null = time.match(/T\d{2}:\d{2}/g);
    if (hoursAndMinutes) {
        const unformattedHours:number = Number(hoursAndMinutes[0].slice(1, 3)) + time_adjustment;
        const hours:string =((unformattedHours%12 < 10) && unformattedHours !== 12 && unformattedHours !== 0 ? "0" : "") +
                            (unformattedHours%12 === 0 ? 12 : unformattedHours%12).toString();
        const unformattedMinutes:number = Number(hoursAndMinutes[0].slice(4, 6));
        const minutes:string = (unformattedMinutes < 10 ? "0" : "") + unformattedMinutes.toString();
        const pmOrAm:string = unformattedHours >= 12 ? "PM" : "AM";
        return hours + ":" + minutes + " " + pmOrAm;
    }
}

export function getCaretCoordinates (input: HTMLInputElement, position:number){
    const div = document.createElement("div");
    const style = window.getComputedStyle(input);
    // Copy input styles to the div
    Array.from(style).forEach((prop:any) => {
        div.style[prop] = style[prop];
        });
        div.style.position = "absolute";
        div.style.visibility = "hidden";
        div.style.whiteSpace = "pre-wrap";
        div.style.wordWrap = "break-word";
        // Replicate the input text up to the caret
        div.textContent = input.value.slice(0, position);
        // Insert a zero-width space to get the caret position
        const span = document.createElement("span");
        span.textContent = "\u200B"; // Zero-width space character
        div.appendChild(span);
        document.body.appendChild(div);
        const rect = span.getBoundingClientRect();
        document.body.removeChild(div);
        return rect;
};

export function sanitizeMessageInput(message:string){
    return message.replace(/(<\/?([a-z]|[A-Z]){2,}\/?>)|(<([a-z]|[A-Z])\/>)/g, "");
}

export function closeModal(ref: RefObject<HTMLDivElement>, refresh:boolean){
    if (ref.current) {
        ref.current.style.display = "none";
        if (refresh) {
            window.location.reload();
        }
    }
}

export function getEmojis(emojiArray:any[], setName:string, onClickEvent:(entityNumber:number|number[])=>void){
    switch (setName) {
        case "people":
            for (let i = 128512; i <= 128567; i++) {
                emojiArray.push(<span onMouseDown={()=>{onClickEvent(i)}} key={i}>{String.fromCodePoint(i)}</span>);
            }
            for (let i = 128577; i <= 128580; i++) {
                emojiArray.push(<span onMouseDown={()=>{onClickEvent(i)}} key={i}>{String.fromCodePoint(i)}</span>);
            }
            for (let i = 129296; i <= 129303 && i !== 129302; i++) {
                emojiArray.push(<span onMouseDown={()=>{onClickEvent(i)}} key={i}>{String.fromCodePoint(i)}</span>);
            }
            for (let i = 129312; i <= 129327 && i !== 129302; i++) {
                emojiArray.push(<span onMouseDown={()=>{onClickEvent(i)}} key={i}>{String.fromCodePoint(i)}</span>);
            }
            for (let i = 129392; i <= 129398; i++) {
                emojiArray.push(<span onMouseDown={()=>{onClickEvent(i)}} key={i}>{String.fromCodePoint(i)}</span>);
            }
            emojiArray.push(<span onMouseDown={()=>{onClickEvent(129402)}} key={129402}>{String.fromCodePoint(129402)}</span>);
            emojiArray.push(<span onMouseDown={()=>{onClickEvent(129488)}} key={129488}>{String.fromCodePoint(129488)}</span>);
            emojiArray.push(<span onMouseDown={()=>{onClickEvent(9995)}} key={9995}>{String.fromCodePoint(9995)}</span>);
            emojiArray.push(<span onMouseDown={()=>{onClickEvent(128075)}} key={128075}>{String.fromCodePoint(128075)}</span>);
            emojiArray.push(<span onMouseDown={()=>{onClickEvent(128076)}} key={128076}>{String.fromCodePoint(128076)}</span>);
            emojiArray.push(<span onMouseDown={()=>{onClickEvent(128400)}} key={128400}>{String.fromCodePoint(128400)}</span>);
            emojiArray.push(<span onMouseDown={()=>{onClickEvent(128406)}} key={128406}>{String.fromCodePoint(128406)}</span>);
            emojiArray.push(<span onMouseDown={()=>{onClickEvent(129306)}} key={129306}>{String.fromCodePoint(129306)}</span>);
            emojiArray.push(<span onMouseDown={()=>{onClickEvent(9757)}} key={9757}>{String.fromCodePoint(9757)}</span>);
            for (let i = 128070; i <= 128073; i++) {
                emojiArray.push(<span onMouseDown={()=>{onClickEvent(i)}} key={i}>{String.fromCodePoint(i)}</span>);
            }
            emojiArray.push(<span onMouseDown={()=>{onClickEvent(128405)}} key={128405}>{String.fromCodePoint(128405)}</span>);
            emojiArray.push(<span onMouseDown={()=>{onClickEvent(9994)}} key={9994}>{String.fromCodePoint(9994)}</span>);
            emojiArray.push(<span onMouseDown={()=>{onClickEvent(129295)}} key={129295}>{String.fromCodePoint(129295)}</span>);
            emojiArray.push(<span onMouseDown={()=>{onClickEvent(129304)}} key={129304}>{String.fromCodePoint(129304)}</span>);
            emojiArray.push(<span onMouseDown={()=>{onClickEvent(129305)}} key={129305}>{String.fromCodePoint(129305)}</span>);
            emojiArray.push(<span onMouseDown={()=>{onClickEvent(129310)}} key={129310}>{String.fromCodePoint(129310)}</span>);
            emojiArray.push(<span onMouseDown={()=>{onClickEvent(129311)}} key={129311}>{String.fromCodePoint(129311)}</span>);
            break;
        case "nature":
            for (let i = 128000; i <= 128062; i++) {
                emojiArray.push(<span onMouseDown={()=>{onClickEvent(i)}} key={i}>{String.fromCodePoint(i)}</span>);
            }
            for (let i = 127792; i <= 127797; i++) {
                emojiArray.push(<span onMouseDown={()=>{onClickEvent(i)}} key={i}>{String.fromCodePoint(i)}</span>);
            }
            for (let i = 127799; i <= 127804; i++) {
                emojiArray.push(<span onMouseDown={()=>{onClickEvent(i)}} key={i}>{String.fromCodePoint(i)}</span>);
            }
            for (let i = 127807; i <= 127812; i++) {
                emojiArray.push(<span onMouseDown={()=>{onClickEvent(i)}} key={i}>{String.fromCodePoint(i)}</span>);
            }
            emojiArray.push(<span onMouseDown={()=>{onClickEvent(9748)}} key={9748}>{String.fromCodePoint(9748)}</span>);
            emojiArray.push(<span onMouseDown={()=>{onClickEvent(9889)}} key={9889}>{String.fromCodePoint(9889)}</span>);
            emojiArray.push(<span onMouseDown={()=>{onClickEvent(9978)}} key={9978}>{String.fromCodePoint(9978)}</span>);
            emojiArray.push(<span onMouseDown={()=>{onClickEvent(9973)}} key={9973}>{String.fromCodePoint(9973)}</span>);
            break;
        case "food":
            for (let i = 129361; i <= 129365; i++) {
                emojiArray.push(<span onMouseDown={()=>{onClickEvent(i)}} key={i}>{String.fromCodePoint(i)}</span>);
            }
            emojiArray.push(<span onMouseDown={()=>{onClickEvent(127805)}} key={127805}>{String.fromCodePoint(127805)}</span>);
            emojiArray.push(<span onMouseDown={()=>{onClickEvent(127806)}} key={127806}>{String.fromCodePoint(127806)}</span>);
            emojiArray.push(<span onMouseDown={()=>{onClickEvent(129382)}} key={129382}>{String.fromCodePoint(129382)}</span>);
            emojiArray.push(<span onMouseDown={()=>{onClickEvent(129388)}} key={129388}>{String.fromCodePoint(129388)}</span>);
            emojiArray.push(<span onMouseDown={()=>{onClickEvent(129476)}} key={129476}>{String.fromCodePoint(129476)}</span>);
            emojiArray.push(<span onMouseDown={()=>{onClickEvent(129477)}} key={129477}>{String.fromCodePoint(129477)}</span>);
            for (let i = 127813; i <= 127827; i++) {
                emojiArray.push(<span onMouseDown={()=>{onClickEvent(i)}} key={i}>{String.fromCodePoint(i)}</span>);
            }
            for (let i = 127789; i <= 127791; i++) {
                emojiArray.push(<span onMouseDown={()=>{onClickEvent(i)}} key={i}>{String.fromCodePoint(i)}</span>);
            }
            for (let i = 127828; i <= 127871; i++) {
                emojiArray.push(<span onMouseDown={()=>{onClickEvent(i)}} key={i}>{String.fromCodePoint(i)}</span>);
            }
            break;
        case "misc":
            emojiArray.push(<span onMouseDown={()=>{onClickEvent([10084, 65039])}} key={10084}>{String.fromCodePoint(10084) + String.fromCodePoint(65039)}</span>);
            emojiArray.push(<span onMouseDown={()=>{onClickEvent(129505)}} key={129505}>{String.fromCodePoint(129505)}</span>);
            emojiArray.push(<span onMouseDown={()=>{onClickEvent(128420)}} key={128420}>{String.fromCodePoint(128420)}</span>);
            for (let i = 128153; i <= 128156; i++) {
                emojiArray.push(<span onMouseDown={()=>{onClickEvent(i)}} key={i}>{String.fromCodePoint(i)}</span>);
            }
            emojiArray.push(<span onMouseDown={()=>{onClickEvent(129293)}} key={129293}>{String.fromCodePoint(129293)}</span>);
            emojiArray.push(<span onMouseDown={()=>{onClickEvent(129294)}} key={129294}>{String.fromCodePoint(129294)}</span>);
            for (let i = 128147; i <= 128152; i++) {
                emojiArray.push(<span onMouseDown={()=>{onClickEvent(i)}} key={i}>{String.fromCodePoint(i)}</span>);
            }
            emojiArray.push(<span onMouseDown={()=>{onClickEvent(128517)}} key={128157}>{String.fromCodePoint(128157)}</span>);
            emojiArray.push(<span onMouseDown={()=>{onClickEvent(128158)}} key={128158}>{String.fromCodePoint(128158)}</span>);
            emojiArray.push(<span onMouseDown={()=>{onClickEvent(128159)}} key={128159}>{String.fromCodePoint(128159)}</span>);
            for (let i = 9800; i <= 9811; i++) {
                emojiArray.push(<span onMouseDown={()=>{onClickEvent(i)}} key={i}>{String.fromCodePoint(i)}</span>);
            }
            emojiArray.push(<span onMouseDown={()=>{onClickEvent(9989)}} key={9989}>{String.fromCodePoint(9989)}</span>);
            emojiArray.push(<span onMouseDown={()=>{onClickEvent(10062)}} key={10062}>{String.fromCodePoint(10062)}</span>);
            emojiArray.push(<span onMouseDown={()=>{onClickEvent(10068)}} key={10068}>{String.fromCodePoint(10068)}</span>);
            emojiArray.push(<span onMouseDown={()=>{onClickEvent(10069)}} key={10069}>{String.fromCodePoint(10069)}</span>);
            emojiArray.push(<span onMouseDown={()=>{onClickEvent(10067)}} key={10067}>{String.fromCodePoint(10067)}</span>);
            emojiArray.push(<span onMouseDown={()=>{onClickEvent(10071)}} key={10071}>{String.fromCodePoint(10071)}</span>);
            emojiArray.push(<span onMouseDown={()=>{onClickEvent(10088)}} key={10088}>{String.fromCodePoint(10088)}</span>);
            emojiArray.push(<span onMouseDown={()=>{onClickEvent(10093)}} key={10093}>{String.fromCodePoint(10093)}</span>);
            emojiArray.push(<span onMouseDown={()=>{onClickEvent(10024)}} key={10024}>{String.fromCodePoint(10024)}</span>);
            emojiArray.push(<span onMouseDown={()=>{onClickEvent(10077)}} key={10077}>{String.fromCodePoint(10077)}</span>);
            emojiArray.push(<span onMouseDown={()=>{onClickEvent(10078)}} key={10078}>{String.fromCodePoint(10078)}</span>);
            for (let i = 8592; i <= 8597; i++) {
                emojiArray.push(<span onMouseDown={()=>{onClickEvent(i)}} key={i}>{String.fromCodePoint(i)}</span>);
            }
            emojiArray.push(<span onMouseDown={()=>{onClickEvent(8634)}} key={8634}>{String.fromCodePoint(8634)}</span>);
            emojiArray.push(<span onMouseDown={()=>{onClickEvent(8635)}} key={8635}>{String.fromCodePoint(8635)}</span>);
            emojiArray.push(<span onMouseDown={()=>{onClickEvent(10035)}} key={10035}>{String.fromCodePoint(10035)}</span>);
            emojiArray.push(<span onMouseDown={()=>{onClickEvent(10036)}} key={10036}>{String.fromCodePoint(10036)}</span>);
            break;
    }
}

export const fonts = ["Arial", "Times New Roman", "Helvetica", "Century Gothic Paneuropean", "Verdana", "Tahoma", "Trebuchet MS", "Georgia", "Garamond", "Courier New"].sort();

export const AuthIdContext = createContext<any>(null);
export const AuthUserContext = createContext<User>({
    id: 0,
    username: "Loading...",
    phone_number: 0,
    icon_url: null
});
export const IsMobileContext = createContext<boolean>(false);
export const ContactListRefContext = createContext<any>([]);
export const ChatTypeContext = createContext<any>(null);
export const MessageCountContext = createContext<any>([]);
export const FontStylePopupContext = createContext<any>([]);
export const EmojiPickerContext = createContext<any>([]);
export const ViewProfileContext = createContext<any>([]);
export const MessageReplyContext = createContext<any>([]);
export const GroupMessageReplyContext = createContext<any>([]);