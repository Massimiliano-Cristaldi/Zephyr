import { useEffect, useState, useRef } from "react";
import axios from "axios";
import EditProfile from "./EditProfile";
import { User } from "../types";
import "./Toolbar.css";

export default function Toolbar(){

    const auth_id = 1;
    const [authUser, setAuthUser] = useState<User | undefined>();
    const toolbarDropdownRef = useRef<HTMLUListElement>(null);
    const editProfileRef = useRef<HTMLDivElement>(null);

    useEffect(()=>{
        async function getAuthUser(){
            try {
                const response = await axios.get(`http://localhost:8800/contact/${auth_id}`);
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

    function showDropdown(){
        if (toolbarDropdownRef.current?.style.display === "none") {
            toolbarDropdownRef.current!.style.display = "block";
        } else {
            toolbarDropdownRef.current!.style.display = "none";
        }
    }

    function showEditProfileModal(){
            editProfileRef.current!.style.display = "flex";
            toolbarDropdownRef.current!.style.display = "none";
    }

    return(
        <>
        <div id="toolbarWrapper">
            <div id="authUserInfo">
                <div id="userIcon" style={{backgroundImage: `url(${authUser?.icon_url}`}}/>
                {authUser ? authUser.username : "Loading..."}
            </div>
            <div id="icons">
                <a href="">
                    <i className="fa-solid fa-plus fa-xl" 
                        style={{color: "white"}}
                        data-toggle="tooltip"
                        title="Add new contact"
                    />
                </a>
                <i className="fa-solid fa-ellipsis-vertical fa-xl" 
                    style={{color: "white"}} 
                    onClick={showDropdown}
                    data-toggle="tooltip"
                    title="Options"
                />
            </div>
        </div>
        <ul id="toolbarDropdown" style={{display: "none"}} ref={toolbarDropdownRef}>
            <li onClick={showEditProfileModal}>Profile</li>
            <li>
                <a href="/themes/edit">Change themes</a>
            </li>
            <li>
                <a href="">Logout</a>
            </li>
        </ul>
        <EditProfile user={authUser} editProfileRef={editProfileRef}/>
        </>
    )
}