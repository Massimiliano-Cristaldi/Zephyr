import { User } from "../../types"

export default function ChatToolbar(contact: User){

    
    return(
            <div id="chatToolbar">
                <div id="contactInfo">
                    <div 
                    className="contactIcon" 
                    style={{backgroundImage: `url(${contact.icon_url || '/user.png'})`}}>
                    </div>
                    <div className="d-flex flex-column pb-1" id="nameAndNumber">
                        <div>
                            {contact.username}
                        </div>
                        <small>
                            +39 {contact.phone_number}
                        </small>
                    </div>
                </div>

            </div>
    )
}