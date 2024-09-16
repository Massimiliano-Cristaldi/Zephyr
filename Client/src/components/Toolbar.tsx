import { useEffect, useState, useRef, useContext } from "react";
import axios from "axios";
import EditProfile from "./EditProfile";
import { User } from "../types";
import "./Toolbar.css";
import { AuthUserContext } from "../utils";

export default function Toolbar(){

    const [authUser, setAuthUser] = useState<User | undefined>();
    const authId = useContext(AuthUserContext);
    const toolbarDropdownRef = useRef<HTMLUListElement>(null);
    const editProfileRef = useRef<HTMLDivElement>(null);

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
                <div id="userIcon" style={{backgroundImage: `url(${authUser?.icon_url || "/user.png"}`}}/>
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
            <a href="/themes/edit">
                <li>Change themes</li>
            </a>
            <a href="">
                <li>Logout</li>
            </a>
        </ul>
        <EditProfile user={authUser} editProfileRef={editProfileRef}/>
        </>
    )
}