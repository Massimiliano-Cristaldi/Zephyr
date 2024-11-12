import { FormEvent, useContext, useState } from "react";
import { AuthUserContext, closeModal, ModalsContext } from "../utils.tsx";
import { NewContact } from "../types";
import "../css/AddContact.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AddContact(){

    const authUser = useContext(AuthUserContext);
    const navigate = useNavigate();

    const addContactRef = useContext(ModalsContext).refs[0];

    const [newContact, setNewContact] = useState<NewContact>({
        contact_list_owner_id: authUser.id,
        phone_number: 0, 
        user_added_as: ""
    });
    const [numberError, setNumberError] = useState<boolean>(false); 
    const [nameError, setNameError] = useState<boolean>(false); 
    const [errorMessage, setErrorMessage] = useState<string>("");

    //Set new contact info state every time the inputs' value changes
    function updateNewContactInfo(e: FormEvent<HTMLInputElement>){
        //Prevent the number input from ever surpassing 10 digits
        if (e.currentTarget.name === "phone_number" && e.currentTarget.value.toString().length >= 10) {
            e.currentTarget.value = newContact.phone_number.toString(); 
        }
        setNumberError(false);
        setNameError(false);
        setNewContact({...newContact, [e.currentTarget.name]: e.currentTarget.value});
    }

    //Handle post request and validation
    function addContact(e: FormEvent<HTMLFormElement>){
        e.preventDefault();
        const isValidNumber = newContact.phone_number > 100000000 && newContact.phone_number < 4000000000;
        const isValidName = newContact.user_added_as.length > 0;
        if (isValidNumber && isValidName){
            axios.post("http://localhost:8800/addcontact", newContact)
            .then((res)=>{
                if (addContactRef.current) {
                    addContactRef.current.style.display = "none";
                }
                navigate(`/chat/${res.data}`);
            })
            .catch(()=>{
                setNumberError(true);
                setErrorMessage("Could not find any user with this phone number");
            })
        } else if (isValidNumber && !isValidName){
            setNameError(true);
            setErrorMessage("Please enter a valid username");
        } else if (isValidName && !isValidNumber){
            setNumberError(true);
            setErrorMessage("Please enter a valid phone number");
        } else {
            setNameError(true);
            setNumberError(true);
            setErrorMessage("Please enter a valid username and a valid phone number");
        }
    }

    return(
        <div id="addContactWrapper" ref={addContactRef}>
            <div id="addContactModal">
                {(numberError || nameError) &&
                <div id="addContactError">
                    <i className="fa-solid fa-circle-exclamation me-2" style={{color: "rgb(199, 8, 8)"}}/>
                    {errorMessage}
                </div>
                }
                <form onSubmit={(e)=>{addContact(e)}}>
                        <label htmlFor="phoneNumberInput">Phone number:</label>
                    <div>
                        <span id="prefix">
                            +39 
                        </span>
                        <input 
                        type="number" 
                        id="phoneNumberInput" 
                        className={numberError ? "inputError" : ""}
                        name="phone_number"
                        onChange={updateNewContactInfo}
                        autoComplete="off"
                        max={9999999999}
                        />
                    </div>
                    <label htmlFor="phoneNumberInput">Save contact as:</label>
                    <input 
                    type="text" 
                    id="saveAsInput" 
                    className={nameError ? "inputError" : ""}
                    name="user_added_as" 
                    onChange={updateNewContactInfo}
                    autoComplete="off"
                    />
                    <button>Add contact</button>
                </form>

                <i className="fa-solid fa-xmark closeModal" 
                    style={{color: "rgb(180, 180, 180)"}} 
                    onClick={()=>{closeModal(addContactRef, false)}}
                />
            </div>
        </div>
    )
}