import { Dispatch, RefObject, SetStateAction } from "react"

export interface User {
    id: number,
    username: string,
    phone_number: number,
    icon_url: string | null
    custom_status?: string
    user_added_as?: string
}

export interface Message {
    id?: number,
    content: string,
    attachments?: string | null,
    sender_id: number,
    recipient_id: number,
    replying_to_message_id?: number | null,
    replied_message_content?: string,
    time_sent?: string,
    replied_message_sender_id?: number,
    replied_message_sender_username?: string
}

//Components
export interface ChatInputProps{
    refs: RefObject<any>[],
    newMessageState: [Message, Dispatch<SetStateAction<Message>>],
    selectedTextState: [string, Dispatch<SetStateAction<string>>], 
    actions: ()=>any
}

export interface ChatToolbarProps{
    contact: User
}

export interface ContactListProps{
    contacts: User[] | [];
}

export interface MessageDropdownProps {
    message: Message,
    actions: [()=>void, ()=>void]
}

export interface MessageElementProps{
    message: Message,
    refs: RefObject<HTMLDivElement>,
    newMessageState: [Message, Dispatch<SetStateAction<Message>>],
    deletedMessageState: [number, Dispatch<SetStateAction<number>>]
}

export interface EmojiPickerProps{
    refs: [RefObject<HTMLDivElement>, RefObject<HTMLInputElement>, RefObject<HTMLInputElement>],
    currentPositionState: [number|null, Dispatch<SetStateAction<number|null>>],
}

//EditThemes
export interface ConfirmPopupProps{
    popupRef: RefObject<HTMLDivElement>,
    confirmAction: () => void
}

//src
export interface AddContactProps{
    addContactRef: RefObject<HTMLDivElement>
}

export interface EditProfileProps {
    user: User | undefined,
    editProfileRef: RefObject<HTMLDivElement>
}

export type StyleProperties = {
    [key:string]: string
}