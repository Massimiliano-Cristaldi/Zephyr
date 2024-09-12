import { LoaderFunctionArgs, useLoaderData } from "react-router-dom";
import axios from "axios";
import { User } from "../../types";
import ChatToolbar from "./ChatToolbar";
import ChatWindow from "./ChatWindow";
import "./Body.css";
import { useContext, useEffect } from "react";
import { ContactListRefContext, isMobile } from "../../utils";

export default function SelectedContact(){
    
    const data = useLoaderData() as User[];
    const contact:User = data[0];
    const [contactListRef, chatWrapperRef, backButtonRef] = useContext(ContactListRefContext)

    useEffect(()=>{
        if (isMobile()) {
            contactListRef.current.style.display = "none";
            chatWrapperRef.current.style.display = "block";
            backButtonRef.current.style.visibility = "visible";
        }
    }, [])
    
    return(
        <>
            <ChatToolbar {...contact}/>
            <ChatWindow/>
        </>
    )
}

export async function loader({params}: LoaderFunctionArgs){
    try {
        const response = await axios.get(`http://localhost:8800/contact/${params.contactId}`);
        if (response.status !== 200 || response.data?.length === 0) {
            throw new Error("Fetch failed");
        }        
        return [response.data[0]];
        
    } catch (err) {
        console.error(err);
    }
}