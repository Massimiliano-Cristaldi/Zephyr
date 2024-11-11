import { useContext, useState, useRef, ChangeEvent } from "react";
import axios from "axios";
import { CreateGroupProps } from "../types";
import { AuthUserContext, closeModal, ContactsContext, getFileExt, IsMobileContext } from "../utils";
import "../css/CreateGroup.css";
import { useNavigate } from "react-router-dom";

export default function CreateGroup({createGroupRef}: CreateGroupProps){

    const navigate = useNavigate();

    const isMobile = useContext(IsMobileContext);
    const authUser = useContext(AuthUserContext);
    const [contacts, groups] = useContext(ContactsContext);

    const titleInputRef = useRef<HTMLInputElement>(null);
    const titleH4Ref = useRef<HTMLHeadingElement>(null);
    const iconRef = useRef<HTMLDivElement>(null);
    const plusSignRef = useRef<HTMLElement>(null);
    const [groupTitle, setGroupTitle] = useState(()=>{
        return isMobile ? "Tap to change group title" : "Double click to change group title";
    });
    const [groupIcon, setGroupIcon] = useState<any>(null);
    const [contactIds, setContactIds] = useState<number[]>([]);

    const isValidTitle = groupTitle !== "Tap to change group title" && groupTitle !== "Double click to change group title";

    //Add/remove contact ids from the list of contacts to be added to the group and handle button disabled/enabled status
    function handleParticipantList(e:ChangeEvent<HTMLInputElement>, id:number){
        setContactIds((prevContactIds) => {
            if (e.target.checked) {
                if (plusSignRef.current && isValidTitle) {
                    plusSignRef.current.style.color = "var(--defaultFontColor)";
                }
                return [...prevContactIds, id];
            } else {
                if (plusSignRef.current && (prevContactIds.length === 1 || !isValidTitle)) {
                    plusSignRef.current.style.color = "rgb(80, 80, 80)";
                }
                return prevContactIds.filter(contactId => contactId !== id);
            }
        });
    }

    function showTitleInput(e:React.MouseEvent){
        e.stopPropagation();
        if (titleH4Ref.current && titleInputRef.current) {
            titleH4Ref.current.style.display = "none";
            titleInputRef.current.style.display = "block";
            titleInputRef.current.focus();
        }
    }

    function hideTitleInput(){
        if (titleH4Ref.current && titleInputRef.current) {
            titleH4Ref.current.style.display = "flex";
            titleInputRef.current.style.display = "none";
        }
    }

    //Set group title and handle button disabled/enabled status
    function handleTitleInput(e:ChangeEvent<HTMLInputElement>){
        if (e.currentTarget.value) {
            setGroupTitle(e.currentTarget.value);
            if (contactIds.length && plusSignRef.current) {
                plusSignRef.current.style.color = "var(--defaultFontColor)";
            }
        } else {
            const noTitle = isMobile ? "Tap to change group title" : "Double click to change group title";
            setGroupTitle(noTitle);
            if (plusSignRef.current) {
                plusSignRef.current.style.color = "rgb(80, 80, 80)";
            }
        }
    }

    //Set icon state and iconRef background image (doesn't post image yet)
    function uploadGroupIcon(e:ChangeEvent<HTMLInputElement>){
        const target = e.target as HTMLInputElement & {files: FileList};
        const iconUrl = URL.createObjectURL(target.files[0]);
        if (iconRef.current) {
            iconRef.current.style.backgroundImage = `url('${iconUrl}')`;
        }
        setGroupIcon(target.files[0]);
    }

    //Post image to public folder, post into group_chats table and finally post into group_participants table
    function createGroup(){
        if (isValidTitle && groupIcon && iconRef.current) {
            const fileName = "/group_icons/group_icon_" + authUser.id + "_" + Date.now() + getFileExt(groupIcon.name);
            const formdata = new FormData();
            formdata.append("title", groupTitle);
            formdata.append("icon", groupIcon);
            formdata.append("filename", fileName);
            formdata.append("participants", contactIds.toString());
            formdata.append("founder_id", authUser.id.toString());
            axios.post(`http://localhost:8800/creategroup`, formdata)
            .then((res)=>{
                navigate(`/groupchat/${res.data.insertId}`);
                if (createGroupRef.current && titleInputRef.current && iconRef.current) {
                    createGroupRef.current.style.display = "none";
                    iconRef.current.style.backgroundImage = "none";
                    titleInputRef.current.value = "";
                    setGroupIcon(null);
                    setContactIds([]);
                }
            })
            .catch((err)=>{
                console.error(err);
            });
        }
    }

    return(
        <div id="createGroupWrapper" ref={createGroupRef}>
            <div id="createGroupModal">
                <form onSubmit={(e)=>{e.preventDefault()}}>
                    <label htmlFor="groupTitleInput">Group title</label>
                    <h4 id="groupleTitleH4" 
                    ref={titleH4Ref}
                    onClick={isMobile ? showTitleInput : undefined}
                    onDoubleClick={!isMobile ? showTitleInput : undefined}
                    >
                        {groupTitle}
                    </h4>
                    <input type="text" 
                    id="groupTitleInput" 
                    style={{display: "none"}} 
                    ref={titleInputRef}
                    onChange={handleTitleInput}
                    onBlur={hideTitleInput}
                    maxLength={30}
                    autoComplete="off"/>

                    <h3>Group icon</h3>
                    <div id="uploadGroupIcon" ref={iconRef}>
                        <label htmlFor="groupIconInput" >
                            <i className="fa-solid fa-upload" style={{color: "#505050"}}/>
                        </label>
                    </div>
                    <input 
                    type="file" 
                    id="groupIconInput" 
                    className="d-none" 
                    onChange={uploadGroupIcon}
                    accept="image/*"/>

                    <h3>Participants</h3>
                    <ul>
                    {contacts.map((contact)=>(
                        <li key={contact.id}>
                            <div className="addParticipantIcon" 
                            style={{backgroundImage: `url(/public${contact.icon_url || "/user_icons/user.png"})`}}/>
                            <span className="mx-2">
                                {contact.user_added_as || contact.username}
                            </span>
                            <input 
                            type="checkbox" 
                            className="addParticipantCheck"
                            onChange={(e)=>{handleParticipantList(e, contact.id)}}/>
                        </li>
                    ))}
                    </ul>

                    <button 
                    onClick={createGroup}
                    disabled={(contactIds.length && isValidTitle) ? false : true}
                    id="addParticipantButton">
                    <i 
                    className="fa-solid fa-plus me-2"
                    style={{color: "rgb(80, 80, 80)"}}
                    ref={plusSignRef}/>
                    <span>
                        Create group
                    </span>
                    </button>
                </form>

                <i className="fa-solid fa-xmark closeModal" 
                    style={{color: "rgb(180, 180, 180)"}} 
                    onClick={()=>{closeModal(createGroupRef, false)}}
                />
            </div>
        </div>
    )
}