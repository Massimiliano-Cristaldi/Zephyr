import { Dispatch, RefObject, SetStateAction } from "react"

export type UseStateArray = [any, Dispatch<SetStateAction<any>>];

export interface User{
    id: number,
    username: string,
    phone_number: number,
    icon_url: string | null
    custom_status?: string
    user_added_as?: string
}

export interface Participant{
    participant_id: number,
    participant_username: string,
    participant_added_as?: string,
    is_participant_admin: boolean,
    phone_number: number
}

export interface Group{
    id: number,
    title: string,
    icon_url: string | null,
    last_message: string | null,
    participants: Participant[]
}

export interface Message{
    id?: number,
    content: string,
    audio_content?: any,
    attachments?: string | null,
    recipient_id: number,
    sender_id: number,
    sender_username?: string,
    sender_added_as?: string,
    replying_to_message_id?: number | null,
    replied_message_content?: string,
    replied_message_sender_id?: number,
    replied_message_sender_username?: string,
    replied_message_sender_added_as?: string,
    time_sent?: string
}

export interface GroupMessage{
    id?: number,
    content: string,
    audio_content?: any,
    attachments?: string | null,
    group_id: number | undefined,
    sender_id: number,
    sender_username: string,
    sender_added_as?: string,
    replied_message_id?: number | null,
    replied_message_content?: string,
    replied_message_sender_id?: number,
    replied_message_sender_username?: string,
    replied_message_sender_added_as?: string,
    time_sent?: string
}

//Chat
export interface ChatInputProps{
    refs: RefObject<any>[],
    newMessageState: [Message | GroupMessage, Dispatch<SetStateAction<Message | GroupMessage>>],
    selectedTextState: [string, Dispatch<SetStateAction<string>>], 
    actions: ()=>any
}

export interface ChatToolbarProps{
    contact: User
}

export interface ContactListProps{
    contacts: User[] | [],
    groups: any[]
}

export interface MessageElementProps{
    message: Message | GroupMessage,
    refs: RefObject<HTMLDivElement>,
    newMessageState: [Message | GroupMessage, Dispatch<SetStateAction<Message | GroupMessage>>],
    deletedMessageState: [number, Dispatch<SetStateAction<number>>]
}

export interface MessageDropdownProps {
    message: Message | GroupMessage,
    actions: [()=>void, ()=>void]
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

//Groupchat

export interface GroupChatToolbarProps{
    group: Group
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