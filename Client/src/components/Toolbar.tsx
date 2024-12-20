import { useRef, useContext, RefObject, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthIdContext, AuthUserContext, ModalsContext } from "../utils.tsx";
import { User, UseStateArray } from "../types";
import EditProfile from "./EditProfile";
import AddContact from "./AddContact";
import "../css/Toolbar.css";
import axios from "axios";
import CreateGroup from "./CreateGroup.tsx";

export default function Toolbar(){

    const navigate = useNavigate();

    const authUser = useContext(AuthUserContext);

    const [addContactRef, createGroupRef, editProfileRef, viewProfileRef, groupDetailsWrapperRef] = useContext(ModalsContext).refs;
    const toolbarOptionsRef = useRef<HTMLUListElement>(null);
    const toolbarAddRef = useRef<HTMLUListElement>(null);

    const [authId, setAuthId]:UseStateArray = useContext(AuthIdContext);
    const [users, setUsers] = useState<User[] | []>([]);
    
    //Fetch all users from database (dev feature, used to test different profiles)
    useEffect(()=>{
        async function fetchData(){
            try {
                const response = await axios.get(`http://localhost:8800/getallusers`);
                if (response.status !== 200 || response.data.length === 0) {
                    throw new Error("Fetch failed");
                }
                setUsers(response.data);
            } catch (err) {
                console.error(err);
            }
        }
        fetchData();
    }, [])

    const closeAllModals:()=>void = useContext(ModalsContext).actions;

    function toggleDropdown(showRef: RefObject<HTMLUListElement>, hideRef: RefObject<HTMLUListElement>){
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

    function hideDropdown(ref: RefObject<HTMLUListElement>){
        if (ref.current) {
            ref.current.style.display = "none";
        }
    }

    function showModal(ref: RefObject<HTMLDivElement>){
        closeAllModals();
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
                <div id="userIcon" style={{backgroundImage: `url(/public/${authUser?.icon_url || "/user_icons/user.png"}`}}/>
                {authUser ? authUser.username : "Loading..."}
            </div>
            <div id="icons">
                <i className="fa-solid fa-plus fa-xl" 
                    style={{color: "white"}}
                    onClick={()=>{toggleDropdown(toolbarAddRef, toolbarOptionsRef)}}
                    onBlur={()=>{hideDropdown(toolbarAddRef)}}
                    tabIndex={0}
                    data-toggle="tooltip"
                    title="New chat or group chat"
                />
                <i className="fa-solid fa-ellipsis-vertical fa-xl" 
                    style={{color: "white"}} 
                    onClick={()=>{toggleDropdown(toolbarOptionsRef, toolbarAddRef)}}
                    onBlur={()=>{hideDropdown(toolbarOptionsRef)}}
                    tabIndex={0}
                    data-toggle="tooltip"
                    title="Options"
                />
            </div>
        </div>
        <ul 
        className="toolbarDropdown" 
        style={{display: "none", right: "60px", borderRight: "3px solid var(--toolbarOptionsBorder)"}} 
        ref={toolbarAddRef}>
            <li onMouseDown={()=>{showModal(addContactRef)}}>New chat</li>
            <li onMouseDown={()=>{showModal(createGroupRef)}}>New group chat</li>
        </ul>
        <ul 
        className="toolbarDropdown" 
        style={{display: "none"}} 
        ref={toolbarOptionsRef}>
            <li onMouseDown={()=>{showModal(editProfileRef)}}>Profile</li>
            <li onMouseDown={()=>{navigate("/themes/edit")}}>Change themes</li>
            <li id="changeProfile">
                <i className="fa-solid fa-chevron-left fa-2xs"/>
                Change profile
                <ul id="profilesList">
                    {users.map((user)=>user.id !== authUser.id && (
                        <li key={user.id} onMouseDown={()=>{navigate("/"); setAuthId(user.id)}}>
                            {user.user_added_as || user.username}
                        </li>
                    ))}
                </ul>
            </li>
        </ul>
        <AddContact/>
        <CreateGroup/>
        <EditProfile/>
        </>
    )
}