import { ChangeEvent, useContext, useState, useRef, RefObject, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import axios from "axios";
import { ContactsContext, closeModal } from "../../utils";
import { Group, GroupChatModalContext, User } from "../../types";
import "../../css/AddParticipant.css";

export default function AddParticipant(){

    const navigate = useNavigate();

    const contacts:User[] = useContext(ContactsContext);
    const [group, groupDetailsWrapperRef]:GroupChatModalContext = useOutletContext();
    const participantList = group.participants?.map(
        (participant)=>{return participant.participant_id}
    );

    const plusSignRef = useRef<HTMLElement>(null);
    const [contactIds, setContactIds] = useState<number[]>([]);
    const [displayedContacts, setDisplayedContacts] = useState<User[]>([...contacts]);

    //Sync displayed contacts with contact list
    useEffect(()=>{
        setDisplayedContacts([...contacts]);
    }, [contacts]);

    //Add/remove contact ids from the list of contacts to be added to the group
    function handleParticipantList(e:ChangeEvent<HTMLInputElement>, id:number){
        setContactIds((prevContactIds) => {
            if (e.target.checked) {
                if (plusSignRef.current) {
                    plusSignRef.current.style.color = "var(--defaultFontColor)";
                }
                return [...prevContactIds, id];
            } else {
                if (plusSignRef.current && prevContactIds.length === 1) {
                    plusSignRef.current.style.color = "rgb(80, 80, 80)";
                }
                return prevContactIds.filter(contactId => contactId !== id);
            }
        });
    }

    //Self-explanatory
    function addParticipants(e:any){
        e.preventDefault();
        const ids = {contactIds: contactIds}
        try {
            axios.post(`http://localhost:8800/addparticipants/${group.id}`, ids)
            .then(()=>{
                const notAddedContacts = displayedContacts.filter((contact) => !contactIds.includes(contact.id))
                setDisplayedContacts(notAddedContacts);
                setContactIds([]);
            });
        } catch (err) {
            console.error(err);
        }
    }    

    return(
        <div id="addParticipantWrapper">
            <h3>Add participants to this group:</h3>
            <ul>
                {displayedContacts.map((contact)=>(
                    !participantList?.includes(contact.id) &&
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
            onClick={(e)=>{addParticipants(e)}}
            disabled={contactIds.length ? false : true}
            id="addParticipantButton">
                <i 
                className="fa-solid fa-plus me-2"
                style={{color: "rgb(80, 80, 80)"}}
                ref={plusSignRef}/>
                <span>
                    Add participants
                </span>
            </button>
            <i 
            id="backToGroupDetails"
            className="fa-solid fa-chevron-left"
            style={{color: "rgb(180, 180, 180)"}} 
            onClick={()=>{navigate(`/groupchat/${group.id}`)}}
            />
            <i 
            id="closeGroupChatModal"
            className="fa-solid fa-xmark" 
            style={{color: "rgb(180, 180, 180)"}} 
            onClick={()=>{closeModal(groupDetailsWrapperRef, false); navigate(`/groupchat/${group.id}`);}}
            />
        </div>
    )
}