import { ChangeEvent, RefObject, useContext, useRef, useState } from "react";
import axios from "axios";
import { AuthUserContext, closeModal, IsMobileContext } from "../utils";
import { EditProfileProps, User } from "../types";
import "../css/EditProfile.css"

//TODO: Clicking on the username H2 while having the status input open with text selected causes weird behavior
export default function EditProfile({user, editProfileRef}: EditProfileProps){

    const authUser = useContext(AuthUserContext);
    const isMobile = useContext(IsMobileContext);
    const iconRef = useRef<HTMLDivElement>(null);
    const usernameInputRef = useRef<HTMLInputElement>(null);
    const usernameH2Ref = useRef<HTMLHeadingElement>(null);
    const statusInputRef = useRef<HTMLInputElement>(null);
    const statusPRef = useRef<HTMLParagraphElement>(null);
    const [isChanged, setIsChanged] = useState<boolean>(false);

    //This flag allows the discard change functions to execute correctly without firing the submit change functions,
    //as hiding the inputs causes them to lose focus, and thus normally trigger any onBlur events
    let discarding = false;
    
    //Post new image to storage, and change user's icon_url property in the database to that image's url
    function changeIcon(e:ChangeEvent<HTMLInputElement>){
        const target = e.target as HTMLInputElement & {files: FileList};
        const uploadedImage = target.files[0];
        if (uploadedImage){
            const formdata = new FormData();
            formdata.append("icon", uploadedImage);
            formdata.append("userId", authUser.id.toString());
            axios.post(`http://localhost:8800/updateicon`, formdata)
            .then(async ()=>{return await axios.get(`http://localhost:8800/geticon/${authUser.id}`)})
            .then((res)=>{iconRef.current!.style.backgroundImage = `url(/${res.data[0].icon_url})`})
            .catch((err)=>{console.error(err)});
        }
    }

    //Set a new value for user's username or custom_status; change is not applied until the input is blurred
    function changeUserProperty(inputElement: RefObject<any>, staticElement: RefObject<any>, property: keyof User){
        if (user && inputElement.current && staticElement.current) {
            inputElement.current.style.display = "block";
            inputElement.current.focus();
            staticElement.current.style.display = "none";
            if (user[property]) {
                inputElement.current.value = user[property];
                inputElement.current.select();
                setIsChanged(true);
            }
        }
    }

    //Apply changes made with changeUserProperty
    function submitPropertyChange(inputElement: RefObject<any>, staticElement: RefObject<any>, property: keyof User){
        if (discarding){
            discarding = false;
            return;
        }
        if (inputElement.current && staticElement.current) {
            inputElement.current.style.display = "none";
            staticElement.current.style.display = "block";
            if (user && inputElement.current.value){
                const newUsername = {field: property, 
                    value: inputElement.current.value, 
                    authUserId: authUser.id};
                axios.post("http://localhost:8800/updateuserinfo", newUsername);
                staticElement.current!.textContent = newUsername.value;
                user.username = newUsername.value;
            }
        }
    }

    //Hide the input and show the static element without applying the changes made with changeUserProperty
    function discardPropertyChange(e:React.KeyboardEvent<HTMLInputElement>, inputElement: RefObject<any>, staticElement: RefObject<any>){
        if (e.key === "Escape" && inputElement.current && staticElement.current){
            discarding = true;
            inputElement.current.style.display = "none";
            staticElement.current.style.display = "block";
        }
    }

    return(
        <div id="editProfileWrapper" ref={editProfileRef}>
            <div id="editProfileModal">

                <div id="currentIcon" style={{backgroundImage: `url(/${user?.icon_url || "/user.png"})`}} ref={iconRef}>
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
                {...(isMobile 
                    ? {onClick: ()=>{changeUserProperty(usernameInputRef, usernameH2Ref, "username")}, ref: usernameH2Ref} 
                    : {onDoubleClick: ()=>{changeUserProperty(usernameInputRef, usernameH2Ref, "username")}, ref: usernameH2Ref})}
                >{user?.username}</h2>
                <form className="d-flex justify-content-center" onSubmit={(e)=>{e.preventDefault()}}>
                    <input type="text"
                    id="newUsernameInput"
                    ref={usernameInputRef}
                    onBlur={()=>{submitPropertyChange(usernameInputRef, usernameH2Ref, "username")}}
                    onKeyDown={(e)=>{discardPropertyChange(e, usernameInputRef, usernameH2Ref)}}
                    maxLength={50}
                    autoComplete="off"
                    />
                </form>

                <p
                {...(isMobile 
                    ? {onClick: ()=>{changeUserProperty(statusInputRef, statusPRef, "custom_status")}, ref: statusPRef} 
                    : {onDoubleClick: ()=>{changeUserProperty(statusInputRef, statusPRef, "custom_status")}, ref: statusPRef})}
                >
                    {user?.custom_status || "This user hasn't chosen a status yet"}
                </p>
                <form className="d-flex justify-content-center" onSubmit={(e)=>{e.preventDefault()}}>
                    <input type="text"
                    id="newStatusInput"
                    ref={statusInputRef}
                    onBlur={()=>{submitPropertyChange(statusInputRef, statusPRef, "custom_status")}}
                    onKeyDown={(e)=>{discardPropertyChange(e, statusInputRef, statusPRef)}}
                    maxLength={100}
                    autoComplete="off"
                    />
                </form>

                <i className="fa-solid fa-xmark closeModal" 
                style={{color: "rgb(180, 180, 180)"}} 
                onClick={()=>{closeModal(editProfileRef, isChanged)}}
                />

            </div>
        </div>
    )
}