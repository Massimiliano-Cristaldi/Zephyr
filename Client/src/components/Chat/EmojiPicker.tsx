import { useContext, useRef } from "react";
import { getEmojis, IsMobileContext, EmojiPickerContext } from "../../utils.tsx";
import { EmojiPickerProps, UseStateArray } from "../../types.ts";
import "../../css/EmojiPicker.css";

export default function EmojiPicker({refs, currentPositionState}: EmojiPickerProps){

    const isMobile = useContext(IsMobileContext);
    const [emojiPickerWrapperRef, tabIndexSetterRef, chatInputRef] = refs;
    const emojiPickerRef = useRef<HTMLDivElement>(null);
    const category1Ref = useRef<HTMLDivElement>(null);
    const category2Ref = useRef<HTMLDivElement>(null);
    const category3Ref = useRef<HTMLDivElement>(null);
    const category4Ref = useRef<HTMLDivElement>(null);
    const [currentPosition, setCurrentPosition] = currentPositionState;
    const [isSelectingEmoji, setIsSelectingEmoji]:UseStateArray = useContext(EmojiPickerContext).states;

    //Push the individual spans containing each emoji into an array
    let peopleEmojis:NodeList | [] = [];
    getEmojis(peopleEmojis, "people", addEmojiToMessage);
    let natureEmojis:NodeList | [] = [];
    getEmojis(natureEmojis, "nature", addEmojiToMessage);
    let foodEmojis:NodeList | [] = [];
    getEmojis(foodEmojis, "food", addEmojiToMessage);
    let miscEmojis:NodeList | [] = [];
    getEmojis(miscEmojis, "misc", addEmojiToMessage);
    
    //Make the window with all the emojis disappear when clicking out of it
    const closeEmojiPicker:()=>void = useContext(EmojiPickerContext).actions;

    //Cause the window with all the emojis to scroll horizontally upon clicking the category icons
    function scrollEmojis(category:string){
        if (emojiPickerRef.current && category1Ref.current && category2Ref.current && category3Ref.current && category4Ref.current) {
            const categoryWidth = isMobile ? window.innerWidth * 0.7 : window.innerWidth * 0.245;
            switch (category) {
                case "people":
                    emojiPickerRef.current.scrollTo({left: 0, behavior: "smooth"});
                    break;
                case "nature":
                    emojiPickerRef.current.scrollTo({left: categoryWidth -7, behavior: "smooth"});
                    break;
                case "food":
                    emojiPickerRef.current.scrollTo({left: categoryWidth * 2 - 7, behavior: "smooth"});
                    break;
                case "misc":
                    emojiPickerRef.current.scrollTo({left: categoryWidth * 3, behavior: "smooth"});
                    break;
            }
        }
    }

    //Put a grey line under the current emoji category whenever and however it gets scrolled to
    function styleActiveCategory(){
        const categoryWidth = isMobile ? window.innerWidth * 0.7 : window.innerWidth * 0.245;
        if (emojiPickerRef.current && category1Ref.current && category2Ref.current && category3Ref.current && category4Ref.current) {
            switch (true) {
                case emojiPickerRef.current.scrollLeft > categoryWidth * 2.8:
                    category1Ref.current.style.backgroundColor = "black";
                    category2Ref.current.style.backgroundColor = "black";
                    category3Ref.current.style.backgroundColor = "black";
                    category4Ref.current.style.backgroundColor = "rgb(110, 110, 110)";
                    break;
                case emojiPickerRef.current.scrollLeft > categoryWidth * 1.8:
                    category1Ref.current.style.backgroundColor = "black";
                    category2Ref.current.style.backgroundColor = "black";
                    category3Ref.current.style.backgroundColor = "rgb(110, 110, 110)";
                    category4Ref.current.style.backgroundColor = "black";
                    break;
                case emojiPickerRef.current.scrollLeft > categoryWidth - 7:
                    category1Ref.current.style.backgroundColor = "black";
                    category2Ref.current.style.backgroundColor = "rgb(110, 110, 110)";
                    category3Ref.current.style.backgroundColor = "black";
                    category4Ref.current.style.backgroundColor = "black";
                    break;
                case emojiPickerRef.current.scrollLeft === 0:
                    category1Ref.current.style.backgroundColor = "rgb(110, 110, 110)";
                    category2Ref.current.style.backgroundColor = "black";
                    category3Ref.current.style.backgroundColor = "black";
                    category4Ref.current.style.backgroundColor = "black";
                    break;
            }
        }
    }

    //Interpolate chat input's value with the clicked emoji at the current position
    function addEmojiToMessage(entityNumber:number|number[]){
        if (chatInputRef.current) {
            let emoji:string;
            let initialPosition:number|null = chatInputRef.current.selectionStart;
            let text:string = chatInputRef.current.value;

            if (typeof entityNumber === "number"){
                emoji = String.fromCodePoint(entityNumber);
            } else {
                emoji = String.fromCodePoint(entityNumber[0]) + String.fromCodePoint(entityNumber[1]);
            }

            if (emoji && currentPosition) {
                chatInputRef.current.value = text.slice(0, currentPosition) + emoji + text.slice(currentPosition, text.length);
                setCurrentPosition(currentPosition + emoji.length);
                setTimeout(()=>{
                    if (chatInputRef.current) {
                        chatInputRef.current.focus();
                        chatInputRef.current.setSelectionRange(currentPosition + emoji.length, currentPosition + emoji.length);
                    }
                }, 0);
            } else if (initialPosition) {
                setCurrentPosition(initialPosition + emoji.length);
                chatInputRef.current.value = text.slice(0, initialPosition) + emoji + text.slice(initialPosition, text.length);
                chatInputRef.current.focus();
                chatInputRef.current.setSelectionRange(initialPosition + emoji.length, initialPosition + emoji.length);
            } else {
                chatInputRef.current.value = text + emoji;
                chatInputRef.current.focus();
            }
        }
    }

    return(
        <div 
        id="emojiPickerWrapper" 
        ref={emojiPickerWrapperRef} 
        style={{display: "none"}}
        onMouseEnter={()=>{setIsSelectingEmoji(true);}}
        onMouseLeave={()=>{setIsSelectingEmoji(false);}}>
            <div id="emojiCategories">
                <i className="fa-regular fa-face-smile" onMouseDown={()=>{scrollEmojis("people")}}/>
                <i className="fa-solid fa-cat" onMouseDown={()=>{scrollEmojis("nature")}}/>
                <i className="fa-solid fa-utensils" onMouseDown={()=>{scrollEmojis("food")}}/>
                <i className="fa-solid fa-icons" onMouseDown={()=>{scrollEmojis("misc")}}/>
            </div>
            <div id="selectedCategoryWrapper">
                <div style={{backgroundColor: "rgb(110, 110, 110)"}} ref={category1Ref}/>
                <div ref={category2Ref}/>
                <div ref={category3Ref}/>
                <div ref={category4Ref}/>
            </div>
            <div id="emojiPicker" ref={emojiPickerRef} onScroll={styleActiveCategory}>
                <input type="text" className="tabIndexSetter" ref={tabIndexSetterRef} onBlur={()=>{closeEmojiPicker(); console.log("should close")}}/>
                <div>
                    {peopleEmojis}
                </div>
                <div>
                    {natureEmojis}
                </div>
                <div>
                    {foodEmojis}
                </div>
                <div>
                    {miscEmojis}
                </div>
            </div>
        </div>
    )
}