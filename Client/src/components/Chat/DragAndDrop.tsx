import { useContext } from "react";
import axios from "axios";
import { AuthUserContext, getFileExt } from "../../utils";
import { DragAndDropProps } from "../../types";
import "../../css/DragAndDrop.css";

export default function DragAndDrop({newMessageState, refs}: DragAndDropProps){
    const authUser = useContext(AuthUserContext);
    const dropZoneRef = refs;
    const [newMessage, setNewMessage] = newMessageState;

    //TODO: give visual feedback for successful attachment; display attachment inside messageElement
    function handleDrop(e: React.DragEvent){
        e.preventDefault();
        if (dropZoneRef.current) {
            dropZoneRef.current.style.display = "none";
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                const file = files[0];
                const reader = new FileReader();
                reader.onload = (e)=>{
                    const fileContent = e.target?.result;
                    const fileObject = new File([fileContent as ArrayBuffer], file.name, {type: file.type});
                    const fileName = "/attachments/attachment_" + authUser.id + "_" + Date.now() + getFileExt(fileObject.name);                    
                    const formData = new FormData();
                    formData.append("attachment", fileObject);
                    formData.append("filename", fileName)
                    try {
                        axios.post("http://localhost:8800/postattachment", formData)
                        .then(()=>{
                            setNewMessage({...newMessage, attachments: fileName});
                        });
                    } catch (err) {
                        console.error("There was an error trying to upload your attachment:" + err);
                    }
                }
                reader.readAsArrayBuffer(file);
            }
        }
    }

    return(
            <div 
            id="dropZone"
            ref={dropZoneRef}
            onDragOver={(e)=>{e.preventDefault()}}
            onDrop={(e)=>{handleDrop(e)}}
            onDragLeave={()=>{if (dropZoneRef.current){dropZoneRef.current.style.display = "none";}}}
            >
                Dropzone
            </div>
    )
}