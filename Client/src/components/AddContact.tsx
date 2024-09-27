import { closeModal } from "../utils";
import { AddContactProps } from "../types";
import "../css/AddContact.css";

export default function AddContact({addContactRef}:AddContactProps){
    return(
        <div id="addContactModal">
            <h5>Phone number: +39 5648764424</h5>
            <h5>Save as: Pippo Franco</h5>

            <i className="fa-solid fa-xmark closeModal" 
                style={{color: "rgb(180, 180, 180)"}} 
                onClick={()=>{closeModal(addContactRef, true)}}
            />
        </div>
    )
}