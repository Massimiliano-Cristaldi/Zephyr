import { useContext, useRef, RefObject, createRef } from "react";
import { useNavigate, useOutletContext, Link } from "react-router-dom";
import axios from "axios";
import { AuthUserContext, ChatTypeContext, GroupStateContext, togglePopup } from "../../utils";
import { Group, Participant, UseStateArray } from "../../types";
import KickUserPopup from "./KickUserPopup";
import "../../css/GroupDetails.css";

export default function GroupDetails(){
    const navigate = useNavigate();
    const authUser = useContext(AuthUserContext);
    const group:Group = useOutletContext();
    const [prevGroupState, setGroup]:UseStateArray = useContext(GroupStateContext);
    const confirmApplyRefs = useRef<{[key: number]: RefObject<HTMLDivElement>}>({});
    
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
        const authParticipant = group.participants.find(participant=>participant.participant_id === authUser.id);
        return authParticipant?.is_participant_admin;
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
    function kickUser(userId: number){
        try {
            axios.post(`http://localhost:8800/removeparticipant/${group.id}/${userId}`)
            .then(()=>{
                const participants = group.participants;
                const kickedParticipantId = group.participants.findIndex((participant:Participant)=>{participant.participant_id === userId});
                participants.splice(kickedParticipantId, 1);
                setGroup({...prevGroupState, participants: participants})
            });
        } catch (err) {
            console.error("There was an error trying to remove this user:", err);
        }
    }
    
    return(
        <>
            <div id="groupDetailsIcon" style={{backgroundImage: `url(/public${group.icon_url})`}}/>
            <h2 className="text-center">{group.title}</h2>
            <Link to={"add"}>
                <i 
                className="fa-solid fa-user-plus" 
                id="addParticipantIcon"
                style={{color: "rgb(175, 175, 175)"}}
                />
            </Link>
            <ul id="participantList">
            {group.participants?.map((participant:Participant)=>(
                <li key={participant.participant_id}>
                <div className={participant.participant_id === authUser.id ? 
                    "col-12 d-flex flex-column" :
                    "col-9 d-flex flex-column"}>
                    {participant.participant_username || participant.participant_added_as}
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
                            <KickUserPopup popupRef={setRef(participant.participant_id)} confirmAction={()=>{kickUser(participant.participant_id)}}/>
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
        </>
        )
    }