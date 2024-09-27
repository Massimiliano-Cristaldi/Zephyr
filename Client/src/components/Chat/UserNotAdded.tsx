import { useState } from "react";

export default function UserNotAdded(){
    
    const [isAdding, setIsAdding] = useState(false);

    function addContact(e: React.FormEvent){
        e.preventDefault();
    }

    return(
        <div id="userNotAddedWrapper">
            <div id="userNotAddedModal">
                {!isAdding ?(
                    <>
                    <i className="fa-solid fa-user-plus"/>
                    <span>
                        This user is not in your contact list yet. Would you like to <u onClick={()=>{setIsAdding(true)}}>add them</u>?
                    </span>
                    </>
                ) : (
                    <>
                    <form onSubmit={addContact}>

                    </form>
                    </>
                )}
            </div>
        </div>
    )
}