import { AuthUserContext, getFileExt, isImageFile, IsMobileContext } from "../../utils";
import { AttachmentElementProps } from "../../types";
import "../../css/AttachmentElement.css";
import { useContext, useRef } from "react";

export default function AttachmentElement({attachment, senderId}: AttachmentElementProps){

    const authUser = useContext(AuthUserContext);
    const isMobile = useContext(IsMobileContext);
    const imageRef = useRef<HTMLDivElement>(null);
    const captionRef = useRef<HTMLDivElement>(null);

    //Toggle between full image size and image preview
    function toggleImageSize(){
        if (imageRef.current && captionRef.current && imageRef.current.style.width === "100%") {
            imageRef.current.style.width = isMobile ? "30vw" : "5vw";
            captionRef.current.style.display = "block";
        } else if (imageRef.current && captionRef.current){
            imageRef.current.style.width = "100%";
            captionRef.current.style.display = "none";
        }
    }

    return(
        isImageFile(attachment) ? (
            <div 
            className={senderId === authUser.id ? "senderImageAttachment" : "recipientImageAttachment"}
            onClick={toggleImageSize}>
                <div className="attachedImage" 
                style={{backgroundImage: `url(/public/${attachment})`}}
                ref={imageRef}
                />
                <div className="mt-2" ref={captionRef}>
                    <i className={`me-2 fa-regular fa-image ${isMobile ? "" : "fa-2xl"}`}/>
                    <span>Photo <br/> 
                        <small className="attachmentCaption">{isMobile ? "(Tap to expand)" : "(Click to expand)"}</small>
                    </span>
                </div>
            </div>
        ) : (
            <div 
            className={senderId === authUser.id ? "senderFileAttachment" : "recipientFileAttachment"}>
                <a href={`/public${attachment}`} download={`file${getFileExt(attachment)}`}>
                    <div>
                        <i className={`ms-1 me-2 fa-solid fa-paperclip ${isMobile ? "" : "fa-xl"}`}/>
                        <span>{getFileExt(attachment)} file<br/> 
                            <small className="attachmentCaption">{isMobile ? "(Tap to download)" : "(Click to download)"}</small>
                        </span>
                    </div>
                </a>
                <i className={`me-2 fa-solid fa-file-arrow-down ${isMobile ? "" : "fa-xl"}`}/>
            </div>
        )
    )
}