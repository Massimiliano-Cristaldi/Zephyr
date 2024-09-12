import { RefObject, useRef } from "react";
import { isMobile } from "../../utils";
import { User } from "../../types";
import axios from "axios";

interface EditProfileProps {
    user: User | undefined,
    editProfileRef: RefObject<HTMLDivElement>
}

export default function EditProfile({user, editProfileRef}: EditProfileProps){

    const authId = 1;
    const statusInputRef = useRef<HTMLInputElement>(null);
    const statusPRef = useRef<HTMLParagraphElement>(null);

    function changeStatus(){
        statusInputRef.current!.style.display = "block";
        statusInputRef.current!.focus();
        statusPRef.current!.style.display = "none";
        if (user?.customStatus) {
            statusInputRef.current!.value = user.customStatus;
            statusInputRef.current?.select();
        }
    }

    function submitStatusChange(){
        statusInputRef.current!.style.display = "none";
        statusPRef.current!.style.display = "block";
        if (user && statusInputRef.current?.value){
            const new_status = {status: statusInputRef.current.value, authUserId: authId};
            axios.post("http://localhost:8800/updatestatus", new_status);
            statusPRef.current!.textContent = new_status.status;
        }
    }

    function closeEditProfileModal(){
        editProfileRef.current!.style.display = "none";
    }

    return(
        <div id="editProfileWrapper" ref={editProfileRef}>
            <div id="editProfileModal">
                <div id="editIcon"></div>
                <h2>{user?.username}</h2>
                <p
                {...(isMobile() 
                    ? {onClick: changeStatus, ref: statusPRef} 
                    : {onDoubleClick: changeStatus, ref: statusPRef})}
                >
                    {user?.customStatus || "This user hasn't chosen a status yet"}
                </p>
                <form className="d-flex justify-content-center" onSubmit={(e)=>{e.preventDefault()}}>
                    <input type="text"
                    id="newStatusInput"
                    ref={statusInputRef}
                    onBlur={submitStatusChange}
                    maxLength={50}
                    autoComplete="off"
                    />
                </form>
        <i className="fa-solid fa-xmark closeModal" style={{color: "rgb(180, 180, 180)"}} onClick={closeEditProfileModal}/>
            </div>
        </div>
    )
}