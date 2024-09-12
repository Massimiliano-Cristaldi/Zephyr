export const defaultTheme = {
    accents: "#7746a4",
    defaultFontColor: "#eef0f2",
    iconBg: "#a654a6",
    iconHoverBg: "#9c2b9c",
    sidebarWrapperBg: "#3f568d",
    toolbarOptionsBg: "#a654a6",
    toolbarOptionsBorder: "#b030b0",
    toolbarWrapperBg: "#00477a",
    chatBodyBg: "#eef0f2",
    chatInputBg: "#eef0f2",
    chatInputWrapperBg: "#3f568d",
    contactListBg: "#eef0f2",
    contactListFontColor: "#00477a",
    scrollbarColor: "#a654a6",
    scrollbarBg: "#00477a",
    sendButtonPrimary: "#eef0f2",
    sendButtonSecondary:" transparent",
    chatToolbarBg: "#3f568d",
    recipientMessageBg: "#7289c0",
    senderMessageBg: "#a654a6",
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
    if (lightness === 0 || lightness === 100) {
        saturation = 0;
    } else {
        saturation = Math.round(chroma/(1 - Math.abs(2*maxComponent - chroma - 1)) * 100);
    }
    return [hue, saturation, lightness];
} else {
    throw new Error("Invalid input format. Please use the format '#nnnnnn', where n is a hexadecimal number.");
}
}

export function hexToHslString(hex:string, lightnessAdjust:number = 0){
const [hue, saturation, lightness] = hexToHsl(hex);

if (hue !== undefined && saturation !== undefined && lightness !== undefined) {   
    const isValidLightness = lightness + lightnessAdjust >= 0 && lightness + lightnessAdjust <= 100;
    if (isValidLightness) {
        return `hsl(${hue}, ${saturation}%, ${lightness + lightnessAdjust}%)`;
    } else if (lightness + lightnessAdjust > 100) {
        return `hsl(${hue}, ${saturation}%, 100%)`;
    } else if (lightness + lightnessAdjust < 0) {
        return `hsl(${hue}, ${saturation}%, 0%)`;
    }
}
}

export function getLightnessFromHex(hex: string){
const lightness = hexToHsl(hex)[2];
return lightness;
}

export function formatColorProperty(property: string){
    const firstWordMatch:RegExpMatchArray|null = property.match(/^[a-z]+/g);
    const otherWordsMatch:RegExpMatchArray|null = property.match(/[A-Z][a-z]+/g);
    if (firstWordMatch) {
        const firstWord = firstWordMatch[0].slice(0, 1).toUpperCase() + firstWordMatch[0].slice(1, firstWordMatch[0].length);
        let result = firstWord;
        if (otherWordsMatch) {
            otherWordsMatch.forEach((el)=>{
                el = el.slice(0, 1).toLowerCase() + el.slice(1, el.length);
                result += (el === "bg" ? " background" : ` ${el}`);
            })
        return (otherWordsMatch.includes("Color") ? result : result + " color");
        }
        return result + " color";
    }
}