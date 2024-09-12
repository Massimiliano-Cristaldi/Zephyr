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
    const usernameInputRef = useRef<HTMLInputElement>(null);
    const usernameH2Ref = useRef<HTMLHeadingElement>(null);
    const statusInputRef = useRef<HTMLInputElement>(null);
    const statusPRef = useRef<HTMLParagraphElement>(null);

    function changeStatus(){
        statusInputRef.current!.style.display = "block";
        statusInputRef.current!.focus();
        statusPRef.current!.style.display = "none";
        if (user?.custom_status) {
            statusInputRef.current!.value = user.custom_status;
            statusInputRef.current?.select();
        }
    }

    function submitStatusChange(){
        statusInputRef.current!.style.display = "none";
        statusPRef.current!.style.display = "block";
        if (user && statusInputRef.current?.value){
            const newStatus = {status: statusInputRef.current.value, authUserId: authId};
            axios.post("http://localhost:8800/updatestatus", newStatus);
            statusPRef.current!.textContent = newStatus.status;
        }
    }

    function changeUsername(){
        usernameInputRef.current!.style.display = "block";
        usernameInputRef.current!.focus();
        usernameH2Ref.current!.style.display = "none";
        if (user?.custom_status) {
            usernameInputRef.current!.value = user.username;
            usernameInputRef.current?.select();
        }
    }

    function submitUsernameChange(){
        usernameInputRef.current!.style.display = "none";
        usernameH2Ref.current!.style.display = "block";
        if (user && usernameInputRef.current?.value){
            const newUsername = {username: usernameInputRef.current.value, authId: authId};
            axios.post("http://localhost:8800/updateusername", newUsername);
            usernameH2Ref.current!.textContent = newUsername.username;
        }
    }

    function closeEditProfileModal(){
        editProfileRef.current!.style.display = "none";
    }

    // FIX: h2 and input for username change have inconsistent heights, gap between the modal elements is inconsistent
    // TODO: add the possibility of changing profile picture

    return(
        <div id="editProfileWrapper" ref={editProfileRef}>
            <div id="editProfileModal">
                <div id="editIcon"></div>
                <h2 
                {...(isMobile() 
                    ? {onClick: changeUsername, ref: usernameH2Ref} 
                    : {onDoubleClick: changeUsername, ref: usernameH2Ref})}
                >{user?.username}</h2>
                <form className="d-flex justify-content-center" onSubmit={(e)=>{e.preventDefault()}}>
                    <input type="text"
                    id="newUsernameInput"
                    ref={usernameInputRef}
                    onBlur={submitUsernameChange}
                    maxLength={50}
                    autoComplete="off"
                    />
                </form>
                <p
                {...(isMobile() 
                    ? {onClick: changeStatus, ref: statusPRef} 
                    : {onDoubleClick: changeStatus, ref: statusPRef})}
                >
                    {user?.custom_status || "This user hasn't chosen a status yet"}
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