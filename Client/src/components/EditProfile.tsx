import { ChangeEvent, RefObject, useContext, useRef } from "react";
import axios from "axios";
import { AuthUserContext, isMobile, closeModal } from "../utils";
import { User } from "../types";
import "../css/EditProfile.css"

interface EditProfileProps {
    user: User | undefined,
    editProfileRef: RefObject<HTMLDivElement>
}

export default function EditProfile({user, editProfileRef}: EditProfileProps){

    const authId = useContext(AuthUserContext);
    const iconRef = useRef<HTMLDivElement>(null);
    const usernameInputRef = useRef<HTMLInputElement>(null);
    const usernameH2Ref = useRef<HTMLHeadingElement>(null);
    const statusInputRef = useRef<HTMLInputElement>(null);
    const statusPRef = useRef<HTMLParagraphElement>(null);

    //This flag allows the discard change functions to execute correctly without firing the submit change functions,
    //as hiding the inputs causes them to lose focus, and thus normally trigger any onBlur events
    let discarding = false;
    
    //I tried to lump some of these functions together, but it made them extremely verbose and less clear, especially
    //with Typescript's specific event type requirements, so I ultimately decided to leave them like this
    function changeIcon(e:ChangeEvent<HTMLInputElement>){
        const target = e.target as HTMLInputElement & {files: FileList};
        const uploadedImage = target.files[0];
        if (uploadedImage){
            const formdata = new FormData();
            formdata.append("icon", uploadedImage);
            formdata.append("userId", authId.toString());
            axios.post(`http://localhost:8800/updateicon`, formdata)
            .then(async ()=>{return await axios.get(`http://localhost:8800/geticon/${authId}`)})
            .then((res)=>{iconRef.current!.style.backgroundImage = `url(/${res.data[0].icon_url})`})
            // .then((res)=>{console.log(res.data[0].icon_url)})
            .catch((err)=>{console.error(err)});
        }
    }

    function changeUsername(){
        usernameInputRef.current!.style.display = "block";
        usernameInputRef.current!.focus();
        usernameH2Ref.current!.style.display = "none";
        if (user?.username) {
            usernameInputRef.current!.value = user.username;
            usernameInputRef.current?.select();
        }
    }

    function submitUsernameChange(){
        if (discarding){
            discarding = false;
            return;
        }
        usernameInputRef.current!.style.display = "none";
        usernameH2Ref.current!.style.display = "block";
        if (user && usernameInputRef.current?.value){
            const newUsername = {field: "username", 
                                value: usernameInputRef.current.value, 
                                authId: authId};
            axios.post("http://localhost:8800/updateuserinfo", newUsername);
            usernameH2Ref.current!.textContent = newUsername.value;
            user.username = newUsername.value;
        }
    }
    
    function discardUsernameChange(e:React.KeyboardEvent<HTMLInputElement>){
        if (e.key === "Escape"){
            discarding = true;
            usernameInputRef.current!.style.display = "none";
            usernameH2Ref.current!.style.display = "block";
        }
    }
    
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
        if (discarding){
            discarding = false;
            return;
        }
        statusInputRef.current!.style.display = "none";
        statusPRef.current!.style.display = "block";
        if (user && statusInputRef.current?.value){
            const newStatus = {field: "custom_status", 
                                value: statusInputRef.current.value, 
                                authId: authId};
            axios.post("http://localhost:8800/updateuserinfo", newStatus);
            statusPRef.current!.textContent = newStatus.value;
            user.custom_status = newStatus.value;
        }
    }

    function discardStatusChange(e:React.KeyboardEvent<HTMLInputElement>){
        if (e.key === "Escape"){
            discarding = true;
            statusInputRef.current!.style.display = "none";
            statusPRef.current!.style.display = "block";
        }
    }

    return(
        <div id="editProfileWrapper" ref={editProfileRef}>
            <div id="editProfileModal">

                <div id="currentIcon" style={{backgroundImage: `url(/${user?.icon_url || "user.png"})`}} ref={iconRef}>
                    <label htmlFor="uploadIcon">
                        <i className="fa-solid fa-upload" style={{color: "#868484"}}/>
                    </label>
                    <input
                    type="file" 
                    name="icon_url" 
                    id="uploadIcon" 
                    onChange={changeIcon}
                    accept="image/*"
                    />
                </div>

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
                    onKeyDown={discardUsernameChange}
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
                    onKeyDown={discardStatusChange}
                    maxLength={100}
                    autoComplete="off"
                    />
                </form>

                <i className="fa-solid fa-xmark closeModal" 
                style={{color: "rgb(180, 180, 180)"}} 
                onClick={()=>{closeModal(editProfileRef, true)}}
                />

            </div>
        </div>
    )
}