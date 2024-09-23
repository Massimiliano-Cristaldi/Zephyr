import { useContext } from "react";
import { closeModal, ViewProfileContext } from "../utils";
import "../css/ViewProfile.css";

export default function ViewProfile(){

    const viewProfileRef = useContext(ViewProfileContext);

    return(
        <div id="viewProfileWrapper" ref={viewProfileRef}>
            <div id="viewProfileModal">
                
                <i className="fa-solid fa-xmark closeModal" 
                style={{color: "rgb(180, 180, 180)"}} 
                onClick={()=>{closeModal(viewProfileRef, false)}}
                />
            </div>
        </div>
    )
}