import { useContext, useRef } from "react";
import { getEmojis, IsMobileContext } from "../../utils.tsx";
import { EmojiPickerProps } from "../../types.ts";
import "../../css/EmojiPicker.css";

export default function EmojiPicker({refs}: EmojiPickerProps){

    const isMobile = useContext(IsMobileContext);
    const [emojiPickerWrapperRef, tabIndexSetterRef, chatInputRef] = refs;
    const emojiPickerRef = useRef<HTMLDivElement>(null);
    const category1Ref = useRef<HTMLDivElement>(null);
    const category2Ref = useRef<HTMLDivElement>(null);
    const category3Ref = useRef<HTMLDivElement>(null);
    const category4Ref = useRef<HTMLDivElement>(null);
    
    let peopleEmojis:NodeList | [] = [];
    getEmojis(peopleEmojis, "people");

    let natureEmojis:NodeList | [] = [];
    getEmojis(natureEmojis, "nature");
    
    let foodEmojis:NodeList | [] = [];
    getEmojis(foodEmojis, "food");

    let miscEmojis:NodeList | [] = [];
    getEmojis(miscEmojis, "misc");

    function closeEmojiPicker(){
        // if (emojiPickerWrapperRef.current) {
        //     emojiPickerWrapperRef.current.style.display = "none";
        // }
    }

    function scrollEmojis(category:string){
        if (emojiPickerRef.current && category1Ref.current && category2Ref.current && category3Ref.current && category4Ref.current) {
            const categoryWidth = isMobile ? window.innerWidth * 0.7 : window.innerWidth * 0.245;
            switch (category) {
                case "people":
                    emojiPickerRef.current.scrollTo({left: 0, behavior: "smooth"});
                    category1Ref.current.style.backgroundColor = "rgb(110, 110, 110)";
                    category2Ref.current.style.backgroundColor = "black";
                    category3Ref.current.style.backgroundColor = "black";
                    category4Ref.current.style.backgroundColor = "black";
                    break;
                case "nature":
                    emojiPickerRef.current.scrollTo({left: categoryWidth -7, behavior: "smooth"});
                    category1Ref.current.style.backgroundColor = "black";
                    category2Ref.current.style.backgroundColor = "rgb(110, 110, 110)";
                    category3Ref.current.style.backgroundColor = "black";
                    category4Ref.current.style.backgroundColor = "black";
                    break;
                case "food":
                    emojiPickerRef.current.scrollTo({left: categoryWidth * 2 - 7, behavior: "smooth"});
                    category1Ref.current.style.backgroundColor = "black";
                    category2Ref.current.style.backgroundColor = "black";
                    category3Ref.current.style.backgroundColor = "rgb(110, 110, 110)";
                    category4Ref.current.style.backgroundColor = "black";
                    break;
                case "misc":
                    emojiPickerRef.current.scrollTo({left: categoryWidth * 3, behavior: "smooth"});
                    category1Ref.current.style.backgroundColor = "black";
                    category2Ref.current.style.backgroundColor = "black";
                    category3Ref.current.style.backgroundColor = "black";
                    category4Ref.current.style.backgroundColor = "rgb(110, 110, 110)";
                    break;
                default:
                    break;
            }
        }
    }

    return(
        <div 
        id="emojiPickerWrapper" 
        ref={emojiPickerWrapperRef} 
        // style={{display: "none"}}
        tabIndex={0}
        onBlur={closeEmojiPicker}>
            <div id="emojiCategories">
                <i className="fa-regular fa-face-smile" onMouseDown={()=>{scrollEmojis("people")}}/>
                <i className="fa-solid fa-cat" onMouseDown={()=>{scrollEmojis("nature")}}/>
                <i className="fa-solid fa-utensils" onMouseDown={()=>{scrollEmojis("food")}}/>
                <i className="fa-solid fa-icons" onMouseDown={()=>{scrollEmojis("misc")}}/>
            </div>
            <div id="selectedCategoryWrapper">
                <div className="selectedCategory" ref={category1Ref}/><div ref={category2Ref}/><div ref={category3Ref}/><div ref={category4Ref}/>
            </div>
            <div id="emojiPicker" ref={emojiPickerRef}>
                <input type="text" className="tabIndexSetter" ref={tabIndexSetterRef}/>
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