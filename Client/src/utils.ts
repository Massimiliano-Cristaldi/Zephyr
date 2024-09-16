import { createContext } from "react";

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

export const fonts = ["Arial", "Times New Roman", "Helvetica", "Century Gothic Paneuropean", "Verdana", "Tahoma", "Trebuchet MS", "Georgia", "Garamond", "Courier New"].sort();

export const ContactListRefContext = createContext<any>([]);
export const AuthUserContext = createContext<any>(1);