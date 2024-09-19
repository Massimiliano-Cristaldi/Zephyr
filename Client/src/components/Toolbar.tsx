import { useEffect, useState, useRef, useContext, RefObject } from "react";
import axios from "axios";
import { AuthUserContext } from "../utils";
import { User } from "../types";
import EditProfile from "./EditProfile";
import AddContact from "./AddContact";
import "./Toolbar.css";

export default function Toolbar(){

    const authId = useContext(AuthUserContext);
    const toolbarOptionsRef = useRef<HTMLUListElement>(null);
    const toolbarAddRef = useRef<HTMLUListElement>(null);
    const addContactRef = useRef<HTMLDivElement>(null);
    const editProfileRef = useRef<HTMLDivElement>(null);
    const [authUser, setAuthUser] = useState<User | undefined>();

    //Fetch logged user's info
    useEffect(()=>{
        async function getAuthUser(){
            try {
                const response = await axios.get(`http://localhost:8800/contact/${authId}`);
                if (response.status !== 200 || response.data.length === 0) {
                    throw new Error("User not found");
                }
                setAuthUser(response.data[0]);
            } catch (err) {
                console.error(err);
            }
        }
        getAuthUser();
    }, [])

    function showDropdown(showRef: RefObject<HTMLUListElement>, hideRef: RefObject<HTMLUListElement>){
        if (showRef.current && hideRef.current) {            
            if (showRef.current.style.display === "none") {
                showRef.current.style.display = "block";
                hideRef.current.style.display = "none";
            } else {
                showRef.current.style.display = "none";
                hideRef.current.style.display = "none";
            }
        }
    }

    function showModal(ref: RefObject<HTMLDivElement>){
        if (ref.current && toolbarOptionsRef.current && toolbarAddRef.current) {
            ref.current.style.display = "flex";
            toolbarOptionsRef.current.style.display = "none";
            toolbarAddRef.current.style.display = "none";
        }
    }

    return(
        <>
        <div id="toolbarWrapper">
            <div id="authUserInfo">
                <div id="userIcon" style={{backgroundImage: `url(/${authUser?.icon_url || "user.png"}`}}/>
                {authUser ? authUser.username : "Loading..."}
            </div>
            <div id="icons">
                <i className="fa-solid fa-plus fa-xl" 
                    style={{color: "white"}}
                    onClick={()=>{showDropdown(toolbarAddRef, toolbarOptionsRef)}}
                    data-toggle="tooltip"
                    title="Add new contact"
                />
                <i className="fa-solid fa-ellipsis-vertical fa-xl" 
                    style={{color: "white"}} 
                    onClick={()=>{showDropdown(toolbarOptionsRef, toolbarAddRef)}}
                    data-toggle="tooltip"
                    title="Options"
                />
            </div>
        </div>
        <ul 
        className="toolbarDropdown" 
        style={{display: "none", right: "60px", borderRight: "3px solid var(--toolbarOptionsBorder)"}} 
        ref={toolbarAddRef}>
            <li onClick={()=>{showModal(addContactRef)}}>New chat</li>
            <li>New group chat</li>
        </ul>
        <ul 
        className="toolbarDropdown" 
        style={{display: "none"}} 
        ref={toolbarOptionsRef}>
            <li onClick={()=>{showModal(editProfileRef)}}>Profile</li>
            <a href="/themes/edit">
                <li>Change themes</li>
            </a>
            <a href="">
                <li>Logout</li>
            </a>
        </ul>
        <div id="addContactWrapper" ref={addContactRef}>
            <AddContact addContactRef={addContactRef}/>
        </div>
        <EditProfile user={authUser} editProfileRef={editProfileRef}/>
        </>
    )
}