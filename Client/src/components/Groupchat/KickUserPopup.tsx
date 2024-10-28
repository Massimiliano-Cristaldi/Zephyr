import { useEffect } from "react";
import { KickUserPopupProps } from "../../types";

export default function KickUserPopup({popupRef, confirmAction} : KickUserPopupProps){

    //Add event listener that allows the confirm action popup to close upon clicking outside of it
    useEffect(()=>{
        function handleClickOutside(event:any) {
            if (popupRef.current && !popupRef.current.contains(event.target)){
                cancelAction();
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [])

    //Hide the confirm action popup
    function cancelAction(){
        if (popupRef.current) {
            popupRef.current.style.display = "none";
        }
    }

    return(
            <div 
            className="kickUserPopup" 
            ref={popupRef} 
            >
                Confirm?
                <div>
                    <i
                    className="fa-solid fa-check"
                    style={{color: "#19a617"}}
                    onClick={confirmAction}
                    />
                    <i 
                    className="fa-solid fa-xmark" 
                    style={{color: "#cb1515"}}
                    onClick={cancelAction}
                    />
                </div>
            </div>
    )
}