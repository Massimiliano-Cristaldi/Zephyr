import { ConfirmPopupProps } from "../../types";

export default function ConfirmPopup({popupRef, confirmAction} : ConfirmPopupProps){

    function cancelAction(){
        if (popupRef.current) {
            popupRef.current.style.display = "none";
        }
    }

    return(
            <div className="confirmPopup" ref={popupRef}>
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