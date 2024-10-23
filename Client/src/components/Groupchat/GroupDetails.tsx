import { useContext } from "react";
import "../../css/GroupDetails.css";
import { GroupDetailsProps, Participant } from "../../types";
import { AuthUserContext, ChatTypeContext } from "../../utils";
import { useNavigate } from "react-router-dom";

export default function GroupDetails({group}: GroupDetailsProps){

    const authUser = useContext(AuthUserContext);
    const [backToContacts, changeChatType]: Array<()=>void> = useContext(ChatTypeContext).actions;

    const navigate = useNavigate();

    function isAuthUserAdmin(){
        const authParticipant = group.participants.find(participant=>participant.participant_id === authUser.id);
        return authParticipant?.is_participant_admin;
    }

    function goToIndividualChat(userId: number){
        navigate(`/chat/${userId}`)
    }

    function kickUser(userId: number){
        
    }

    return(
        <div id="groupDetailsWrapper">
            <div id="groupDetailsModal">
                <div id="groupDetailIcon" style={{backgroundImage: `url(/public${group.icon_url})`}}/>
                <h2>{group.title}</h2>
                <ul>
                    {group.participants?.map((participant:Participant)=>(
                        <li lang="en" key={participant.participant_id}>
                            <div className={participant.participant_id === authUser.id ? 
                            "col-12 d-flex flex-column" :
                            "col-8 d-flex flex-column"}>
                                {participant.participant_username || participant.participant_added_as}
                                <small className="participantNumber">
                                    +39 {participant.participant_phone_number}
                                </small>
                            </div>
                            {participant.participant_id !== authUser.id &&
                                <div className="col-4 text-center">
                                    {isAuthUserAdmin() && participant.participant_id !== authUser.id &&
                                        <i 
                                        className="fa-solid fa-user-xmark me-3" 
                                        style={{color: "var(--accents)"}}
                                        onClick={()=>{kickUser(participant.participant_id)}}
                                        />
                                    }
                                        <i 
                                        className="fa-regular fa-comment" 
                                        style={{color: "var(--accents)"}} 
                                        onClick={()=>{goToIndividualChat(participant.participant_id)}}
                                        />
                                </div>
                            }
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}