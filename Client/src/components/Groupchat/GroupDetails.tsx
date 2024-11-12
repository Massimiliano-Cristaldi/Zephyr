import { useContext, useRef, RefObject, createRef, FormEvent, useState, ChangeEvent, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { AuthUserContext, ChatTypeContext, GroupStateContext, togglePopup, closeModal, IsMobileContext, GroupModalContext, getFileExt, ModalsContext } from "../../utils";
import { Group, Participant, UseStateArray } from "../../types";
import KickUserPopup from "./KickUserPopup";
import "../../css/GroupDetails.css";

export default function GroupDetails(){

    const navigate = useNavigate();

    const authUser = useContext(AuthUserContext);
    const isMobile = useContext(IsMobileContext);
    const group:Group = useContext(GroupModalContext).group;

    const groupDetailsWrapperRef = useContext(ModalsContext).refs[4];
    const groupTitleRef = useContext(GroupModalContext).refs;
    const titleH2Ref = useRef<HTMLHeadingElement>(null);
    const titleInputRef = useRef<HTMLInputElement>(null);
    const iconRef = useRef<HTMLDivElement>(null);
    const confirmApplyRefs = useRef<{[key: number]: RefObject<HTMLDivElement>}>({});

    const [prevGroupState, setGroup]:UseStateArray = useContext(GroupStateContext);
    const [isChanged, setIsChanged] = useState<boolean>(false);
    
    const [backToContacts, changeChatType]:Array<()=>void> = useContext(ChatTypeContext).actions;
    
    //Create a ref object for each group participant, so that it can be passed to the KickUserPopup element
    function setRef (key:number){
        if (!confirmApplyRefs.current[key]) {
            confirmApplyRefs.current[key] = createRef<HTMLDivElement>();
        }
        return confirmApplyRefs.current[key];
    } 
    
    //Check if participant.is_participant_admin === true
    function checkAdminRights(){
        if (group.participants) {
            const authParticipant = group.participants.find(participant=>participant.participant_id === authUser.id);
            return authParticipant?.is_participant_admin;
        }
    }

    function showTitleInput(){
        if (titleH2Ref.current && titleInputRef.current) {
            titleH2Ref.current.style.display = "none";
            titleInputRef.current.style.display = "block";
            titleInputRef.current.focus();
        }
    }

    function submitTitleInputChange(e:FormEvent<HTMLInputElement>){
        const title = {title: e.currentTarget.value};
        if (titleH2Ref.current && titleInputRef.current && groupTitleRef.current) {
            titleInputRef.current.style.display = "none";
            titleH2Ref.current.style.display = "block";
            if (e.currentTarget.value) {
                axios.post(`http://localhost:8800/updategrouptitle/${group.id}`, title)
                .then(()=>{
                    setIsChanged(true);
                    titleH2Ref.current!.innerText = title.title;
                    groupTitleRef.current.innerText = title.title;
                })
                .catch((err)=>{console.error(err)});
            }
        }
    }

    function updateGroupIcon(e:ChangeEvent<HTMLInputElement>){
        const target = e.target as HTMLInputElement & {files: FileList};
        const icon = target.files[0];
        const iconUrl = URL.createObjectURL(icon);
        const filename = "/group_icons/group_icon_" + authUser.id + "_" + Date.now() + getFileExt(icon.name);
        const formData = new FormData();
        formData.append("icon", icon);
        formData.append("filename", filename);
        axios.post(`http://localhost:8800/updategroupicon/${group.id}`, formData)
        .then(()=>{
            if (iconRef.current) {
                console.log(`url('${iconUrl}')`);
                
                iconRef.current.style.backgroundImage = `url('${iconUrl}')`;
            }
            setIsChanged(true);
        })
    }
    
    //Redirect to individual chat with the chosen group participant
    function goToIndividualChat(userId: number){
        changeChatType();
        navigate(`/chat/${userId}`);
    }
    
    //Hide all confirm popups, then show the one related to the user you want to kick
    function handlePopups(ref: RefObject<HTMLDivElement>){
        const hideRefs = [...Object.values(confirmApplyRefs.current)];
        hideRefs.forEach((el)=>{
            if (el.current){
                el.current.style.display = "none";
            }
        })
        togglePopup(ref, "show");
    }
    
    //Remove a participant from the group
    function kickUser (userId: number){
        try {
            axios.post(`http://localhost:8800/removeparticipant/${group.id}/${userId}`)
            .then(()=>{
                const filteredParticipants = group.participants.filter((participant:Participant)=>
                    participant.participant_id !== userId
                );
                setGroup({...prevGroupState, participants: filteredParticipants})
            });
        } catch (err) {
            console.error("There was an error trying to remove this user:", err);
        }
    }

    return(
        <>
            <form 
            className="d-flex flex-column align-items-center"
            onSubmit={(e)=>{e.preventDefault()}}>
            <div 
            id="groupDetailsIcon" 
            ref={iconRef}
            style={{backgroundImage: `url(/public${group.icon_url})`}}>
                <label htmlFor="groupDetailsIconInput" >
                    <i className="fa-solid fa-upload" 
                    style={{color: "#505050"}}/>
                </label>
            </div>
            <input 
            type="file" 
            id="groupDetailsIconInput" 
            className="d-none" 
            onChange={(e)=>{updateGroupIcon(e)}}
            accept="image/*"/>
            
            <h2
            id="groupDetailsTitleH2"
            ref={titleH2Ref}
            onClick={isMobile && checkAdminRights() ? showTitleInput : undefined}
            onDoubleClick={!isMobile && checkAdminRights() ? showTitleInput : undefined}>
                {group.title}
            </h2>
            <input 
            type="text"
            id="groupDetailsTitleInput"
            ref={titleInputRef}
            onBlur={submitTitleInputChange}
            autoComplete="off"
            maxLength={30}
            style={{display: "none"}}/>
            {checkAdminRights() && 
                <Link to={"add"}>
                    <i 
                    className="fa-solid fa-user-plus" 
                    id="addParticipantIcon"
                    style={{color: "rgb(175, 175, 175)"}}
                    />
                </Link>
            }
            <ul id="participantList">
                {group.participants?.map((participant:Participant)=>(
                    <li key={participant.participant_id}>
                    <div className={participant.participant_id === authUser.id ? 
                        "col-12 d-flex flex-column" :
                        "col-9 d-flex flex-column"}>
                        {participant.participant_username || participant.participant_added_as}
                        {participant.is_participant_admin ? 
                            <small className="isAdmin">
                                (Group admin)
                            </small>
                        : null}
                        <small className="participantNumber">
                        +39 {participant.participant_phone_number}
                        </small>
                        </div>
                        {participant.participant_id !== authUser.id &&
                            <div className="col-3 text-end" id="groupDetailsActions">
                            {checkAdminRights() && participant.participant_id !== authUser.id &&
                                <>
                                <i 
                                className="fa-solid fa-user-xmark me-2 me-lg-1" 
                                style={{color: "rgb(175, 175, 175)"}}
                                onClick={()=>{handlePopups(confirmApplyRefs.current[participant.participant_id])}}
                                />
                                <KickUserPopup 
                                popupRef={setRef(participant.participant_id)} 
                                confirmAction={()=>{kickUser(participant.participant_id)}}/>
                                </>
                            }
                            <i 
                            className="fa-regular fa-comment" 
                            style={{color: "rgb(175, 175, 175)"}} 
                            onClick={()=>{goToIndividualChat(participant.participant_id)}}
                            />
                            </div>
                        }
                    </li>
                ))}
            </ul>
            </form>

            <i 
            id="closeGroupChatModal"
            className="fa-solid fa-xmark" 
            style={{color: "rgb(180, 180, 180)"}} 
            onClick={()=>{closeModal(groupDetailsWrapperRef, isChanged); navigate(`/groupchat/${group.id}`);}}
            />
        </>
        )
    }