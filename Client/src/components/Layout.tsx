import { useEffect, useRef } from "react";
import Toolbar from "./Toolbar";
import Sidebar from "./Sidebar";
import Body from "./Chat/Body";
import { ContactListRefContext } from "../utils";
import "../StyleVariables.css";
import "../index.css";

export default function Layout(){

    const contactListRef = useRef<HTMLDivElement>(null);
    const chatWrapperRef = useRef<HTMLDivElement>(null);
    const backButtonRef = useRef<HTMLElement>(null);

    useEffect(()=>{
        const styles = document.documentElement.style;
        const theme = window.localStorage.getItem("theme");
        if (theme) {
            const colorProperties = JSON.parse(theme);
            for (const property in colorProperties) {
                if (Object.prototype.hasOwnProperty.call(colorProperties, property)) {
                    styles.setProperty(`--${property}`, colorProperties[property]);
                }
            }
        }
    }, [])

    return(
        <ContactListRefContext.Provider value={[contactListRef, chatWrapperRef, backButtonRef]}>
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