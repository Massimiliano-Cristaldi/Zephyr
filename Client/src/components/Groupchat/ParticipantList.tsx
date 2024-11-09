import { useContext } from "react"
import { AuthUserContext } from "../../utils"
import { Participant, ParticipantListProps } from "../../types";

export default function ParticipantList({group}: ParticipantListProps){

    const authUser = useContext(AuthUserContext);

    console.log(group.participants);
    

    return(
        <small id="participants">
            {group.participants?.length > 0 &&
                (group.participants.length <= 3 ?
                group.participants.map((participant:Participant, index)=>
                    (<span key={participant.participant_id}>
                        {participant.participant_id === authUser.id ? 
                        participant.participant_username : 
                        (participant.participant_added_as || participant.participant_username)}
                        {index === group.participants.length - 1 ? " " : ", "}
                    </span>)
                ) : (<>
                    <span key={group.participants[0].participant_id}>
                        {(group.participants[0].participant_added_as || group.participants[0].participant_username) + ", "} 
                    </span>
                    <span key={group.participants[1].participant_id}>
                        {(group.participants[1].participant_added_as || group.participants[1].participant_username) + ", "} 
                    </span>
                    <span key={group.participants[2].participant_id}>
                        {(group.participants[2].participant_added_as || group.participants[2].participant_username) + " "} 
                    </span>
                    and {group.participants.length - 3
                    + (group.participants.length === 4 ? " other" : " others")}
                </>)
                )
            }
        </small>
    )
}