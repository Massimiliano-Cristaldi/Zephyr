import { ChangeEvent, RefObject, useContext, useRef } from "react";
import axios from "axios";
import { AuthUserContext, isMobile } from "../utils";
import { User } from "../types";

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

    //TODO: Limit which kinds of file can be put into the file input (image/jpg, image/png etc.)
    //TODO: Find how to reconstruct the filename as it's processed by multer - see this:
    //file.fieldname + "_" + Date.now() + path.extname(file.originalname) 
    function changeIcon(e:ChangeEvent<HTMLInputElement>){
        const target = e.target as HTMLInputElement & {files: FileList};
        const uploadedImage = target.files[0];
        if (uploadedImage){
            console.log(uploadedImage);
            
            const formdata = new FormData();
            formdata.append("icon", uploadedImage);
            formdata.append("userId", authId.toString());
            axios.post(`http://localhost:8800/updateicon`, formdata)
            // .then(()=>{iconRef.current!.style.backgroundImage = `url(/${uploadedImage})`});
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
            const newUsername = {username: usernameInputRef.current.value, authId: authId};
            axios.post("http://localhost:8800/updateusername", newUsername);
            usernameH2Ref.current!.textContent = newUsername.username;
            user.username = newUsername.username;
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
            const newStatus = {status: statusInputRef.current.value, authUserId: authId};
            axios.post("http://localhost:8800/updatestatus", newStatus);
            statusPRef.current!.textContent = newStatus.status;
            user.custom_status = newStatus.status;
        }
    }

    function discardStatusChange(e:React.KeyboardEvent<HTMLInputElement>){
        if (e.key === "Escape"){
            discarding = true;
            statusInputRef.current!.style.display = "none";
            statusPRef.current!.style.display = "block";
        }
    }
    
    function closeEditProfileModal(){
        editProfileRef.current!.style.display = "none";
        window.location.reload();
    }

    // TODO: add the possibility of changing profile picture

    return(
        <div id="editProfileWrapper" ref={editProfileRef}>

            <div id="editProfileModal">
                <div id="currentIcon" style={{backgroundImage: `url(/${user?.icon_url || "user.png"})`}} ref={iconRef}>
                    <label htmlFor="uploadIcon">
                        <i className="fa-solid fa-upload" style={{color: "#868484"}}/>
                    </label>
                    <input type="file" name="icon_url" id="uploadIcon" onChange={changeIcon}/>
                </div>

                <h2 
                {...(isMobile() 
                    ? {onClick: changeUsername, ref: usernameH2Ref} 
                    : {onClick: changeUsername, ref: usernameH2Ref})}
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
                    : {onClick: changeStatus, ref: statusPRef})}
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
                onClick={closeEditProfileModal}
                />

            </div>
        </div>
    )
}