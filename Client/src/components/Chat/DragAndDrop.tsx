import { useContext } from "react";
import { AuthUserContext, getFileExt } from "../../utils";
import { DragAndDropProps } from "../../types";
import "../../css/DragAndDrop.css";

export default function DragAndDrop({newMessageState, attachmentState, attachmentNameState, refs}: DragAndDropProps){
    const authUser = useContext(AuthUserContext);
    const [dropZoneRef, inputAttachmentRef] = refs;
    const [newMessage, setNewMessage] = newMessageState;
    const [attachment, setAttachment] = attachmentState;
    const [attachmentName, setAttachmentName] = attachmentNameState;

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
                    formData.append("filename", fileName);
                    setAttachment(formData);
                    setAttachmentName(fileObject.name);
                    setNewMessage({...newMessage, attachments: fileName});
                    if (inputAttachmentRef.current) {
                        inputAttachmentRef.current.style.display = "block";
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
                <i className="fa-solid fa-file-arrow-up" style={{color: "#868484"}}/>
                Release file to attach
            </div>
    )
}