import { useContext } from "react"
import { AuthUserContext } from "../../utils"

export default function ParticipantList({group}:any){

    const authUser = useContext(AuthUserContext);

    return(
        <small id="participants">
                    {group.participants?.length > 0 &&
                        (group.participants.length <= 3 ?
                        group.participants.map((participant:any)=>
                            (<span key={participant.participant_id}>
                                    {participant.participant_id === authUser.id ? 
                                    participant.participant_username : 
                                    (participant.participant_added_as || participant.participant_username)}
                                    {Math.max(...group.participants.map((el:any)=> el?.participant_id)) === participant.participant_id ?
                                    " " : ", "}
                            </span>)
                        ) : (<>
                                <span key={group.participants[0].participant_id}>
                                    {group.participants[0].participant_id === authUser.id ? 
                                    group.participants[0].participant_username + ", " : 
                                    group.participants[0].participant_added_as + ", "} 
                                </span>
                                <span key={group.participants[1].participant_id}>
                                    {group.participants[1].participant_id === authUser.id ? 
                                    group.participants[1].participant_username + ", " : 
                                    group.participants[1].participant_added_as + ", "} 
                                </span>
                                <span key={group.participants[2].participant_id}>
                                    {group.participants[2].participant_id === authUser.id ? 
                                    group.participants[2].participant_username + " " : 
                                    group.participants[2].participant_added_as + " "} 
                                </span>
                                and {group.participants.length - 3
                                + (group.participants.length === 4 ? " other" : " others")}
                            </>)
                    )}
                </small>
    )
}