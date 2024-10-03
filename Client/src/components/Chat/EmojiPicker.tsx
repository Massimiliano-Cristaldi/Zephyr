import { getEmojis } from "../../utils.tsx";
import { EmojiPickerProps } from "../../types.ts";
import "../../css/EmojiPicker.css";

export default function EmojiPicker({refs}: EmojiPickerProps){

    const [emojiPickerRef, emojiInputRef, chatInputRef] = refs;
    
    let peopleEmojis:NodeList | [] = [];
    getEmojis(peopleEmojis, "people");

    let animalEmojis:NodeList | [] = [];
    getEmojis(animalEmojis, "animals");

    function closeEmojiPicker(){
        if (emojiPickerRef.current) {
            emojiPickerRef.current.style.display = "none";
        }
    }

    return(
        <div 
        id="emojiPickerWrapper" 
        ref={emojiPickerRef} 
        // style={{display: "none"}}
        tabIndex={0}
        onBlur={closeEmojiPicker}>
            <div id="emojiCategories">
                <i className="fa-regular fa-face-smile"/>
                <i className="fa-solid fa-cat"/>
                <i className="fa-solid fa-icons"/>
            </div>
            <div id="emojiPicker">
                <input type="text" className="tabIndexSetter" ref={emojiInputRef}/>
                <div>
                    {peopleEmojis}
                </div>
                <hr />
                <div id="test">
                    {animalEmojis}
                </div>
            </div>
        </div>
    )
}