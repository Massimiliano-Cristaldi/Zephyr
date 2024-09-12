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

//Expected input: 0 <= h <= 360, 0 <= s <= 1, 0 <= l <= 1
//E.g: hslToHex(271, 0.4, 0.46) => #7746a4
export function hslToHex(h: number, s: number, l:number){
    const isValidColor = h >= 0 && h <= 360 && s >= 0 && s <= 1 && l >= 0 && l <= 1;
    if (isValidColor) {
        const chroma = (1 - Math.abs(2*l - 1)) * s;
        const h1 = h/60;
        const x = chroma * (1 - Math.abs(h1%2 - 1));
        let r = 0;
        let g = 0;
        let b = 0;
        switch (true) {
            case h1 >= 0 && h1 < 1:
                [r, g, b] = [chroma, x, 0];
                break;
            case h1 >= 1 && h1 < 2:
                [r, g, b] = [x, chroma, 0];
                break;
            case h1 >= 2 && h1 < 3:
                [r, g, b] = [0, chroma, x];
                break;
            case h1 >= 3 && h1 < 4:
                [r, g, b] = [0, x, chroma];
                break;
            case h1 >= 4 && h1 < 5:
                [r, g, b] = [x, 0, chroma];
                break;
            case h1 >= 5 && h1 < 6:
                [r, g, b] = [chroma, 0, x];
                break;
        }
        const m = l - chroma/2;
        [r, g, b] = [Math.round((r + m) * 255), Math.round((g + m) * 255), Math.round((b + m) * 255)];
        const [rHex, gHex, bHex] = [r.toString(16), g.toString(16), b.toString(16)];
        return "#" + rHex + gHex + bHex;
    } else {
        throw new Error("Invalid color input. Please input hue as a value between 0 and 360, and saturation and lightness each as values between 0 and 1.");
    }
}

//Expected input: "hsl(h, s%, l%)", where 0 <= h <= 360, 0 <= s <= 100, 0 <= l <= 100
//E.g: hslStringToHex("hsl(271, 40%, 46%)") => #7746a4
export function hslStringToHex(hsl: string){
        const hueMatch:RegExpMatchArray|null = hsl.match(/\(\d{1,3}/);
        const saturationMatch:RegExpMatchArray|null = hsl.match(/\d{1,3}%,/);
        const lightnessMatch:RegExpMatchArray|null = hsl.match(/\d{1,3}%\)/);   
        if (hueMatch && saturationMatch && lightnessMatch) {
            const hue = Number(hueMatch[0].slice(1, hueMatch[0].length));
            const saturation = Number(saturationMatch[0].slice(0, (saturationMatch[0].length - 2)))/100;
            const lightness = Number(lightnessMatch[0].slice(0, (lightnessMatch[0].length - 2)))/100;
            return hslToHex(hue, saturation, lightness);
        } else {
            throw new Error("Invalid input format. Please use the format 'hsl(h, s%, l%)', where 0 <= h <= 360, 0 <= s <= 100, 0 <= l <= 100.");
        }
}

export function hexToHsl(hex: string){
    const isValidString = (/#((\d|[a-f]){2}){3}/g).test(hex);
    if (isValidString) {
        const r = parseInt(hex.slice(1, 3), 16)/255; //0.666
        const g = parseInt(hex.slice(3, 5), 16)/255; //0.266
        const b = parseInt(hex.slice(5), 16)/255; //0.337
        const maxComponent = Math.max(r, g, b);
        const minComponent = Math.min(r, g, b);
        const chroma = maxComponent - minComponent;
        const lightness = Math.round((maxComponent + minComponent)/2 * 100);
        
        let hue;
        switch (true) {
            case chroma === 0:
                hue = 0;
                break;
            case maxComponent === r:
                hue = (360 + Math.round(60 * (((g - b)/chroma)%6))) % 360;
                break;
            case maxComponent === g:
                hue = (360 + Math.round(60 * ((b - r)/chroma + 2))) % 360;
                break;
            case maxComponent === b:
                hue = (360 + Math.round(60 * ((r - g)/chroma + 4))) % 360;
                break;
        }
        let saturation;
        if (lightness === 0 || lightness === 1) {
            saturation = 0;
        } else {
            saturation = Math.round(chroma/(1 - Math.abs(2*maxComponent - chroma - 1)) * 100);
        }
        return [hue, saturation, lightness];
    } else {
        throw new Error("Invalid input format. Please use the format '#nnnnnn', where n is a hexadecimal number.");
    }
}

export function hexToHslString(hex:string, lightnessAdjust: number = 0){
    const [hue, saturation, lightness] = hexToHsl(hex);
    if (hue && saturation && lightness) {   
        const isValidLightness = lightness + lightnessAdjust >= 0 && lightness + lightnessAdjust <= 100;
        if (isValidLightness) {
            return `hsl(${hue}, ${saturation}%, ${lightness + lightnessAdjust}%)`;
        } else {
            throw new Error("'Lightness' value exceeded the range [0, 100].");
        }
    }
}

export const ContactListRefContext = createContext<any>([]);