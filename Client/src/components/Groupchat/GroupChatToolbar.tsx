import "../../css/GroupChatToolbar.css";

export default function GroupChatToolbar({group}:any){

    return(
        <div id="chatToolbar">
        <div id="contactInfo">
            <div 
            className="contactIcon" 
            style={{backgroundImage: `url(/${group?.icon_url || "user.png"}`}}>
            </div>
            <div className="d-flex flex-column pb-1" id="nameAndNumber">
                <div>
                    {group.title}
                </div>
                <small id="phoneNumber">
                    {group.participants?.map((participant:any)=>(
                        <span key={participant.participant_id}>{participant.participant_username}</span>
                    ))}
                </small>
            </div>
        </div>
    </div>
    )
}