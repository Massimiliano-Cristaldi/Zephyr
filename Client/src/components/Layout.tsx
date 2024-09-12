import { useEffect, useRef } from "react";
import Toolbar from "./Toolbar";
import Sidebar from "./Sidebar";
import Body from "./Chat/Body";
import { ContactListRefContext } from "../utils";
import "../StyleVariables.css";
import "../index.css";

export default function Layout(){

    const contact_list_ref = useRef<HTMLDivElement>(null);
    const chat_wrapper_ref = useRef<HTMLDivElement>(null);
    const back_button_ref = useRef<HTMLElement>(null);

    useEffect(()=>{
        const styles = document.documentElement.style;
        const theme = window.localStorage.getItem("theme");
        if (theme) {
            const colorProperties = JSON.parse(theme);
            console.log(colorProperties);
            for (const property in colorProperties) {
                if (Object.prototype.hasOwnProperty.call(colorProperties, property)) {
                    styles.setProperty(`--${property}`, colorProperties[property]);
                }
            }
        console.log(":root values changed");
        }
    }, [])

    return(
        <ContactListRefContext.Provider value={[contact_list_ref, chat_wrapper_ref, back_button_ref]}>
        <div className="container-fluid h-100">
            <div className="row">
                    <Toolbar/>
            </div>
            <div className="row">
                    <Sidebar/>
                <div id="body">
                    <Body/>
                </div>
            </div>
        </div>
        </ContactListRefContext.Provider>
    )
}