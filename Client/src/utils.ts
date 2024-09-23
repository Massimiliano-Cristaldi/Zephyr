import { createContext, RefObject } from "react";

export function isMobile(){
    return window.innerWidth < 776;
}

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

export const fonts = ["Arial", "Times New Roman", "Helvetica", "Century Gothic Paneuropean", "Verdana", "Tahoma", "Trebuchet MS", "Georgia", "Garamond", "Courier New"].sort();

export const ContactListRefContext = createContext<any>([]);
export const AuthUserContext = createContext<number>(1);
export const MessageCountContext = createContext<any>([]);
export const FontStylePopupContext = createContext<any>([]);
export const ViewProfileContext = createContext<any>([]);