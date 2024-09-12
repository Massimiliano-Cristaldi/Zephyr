export interface User {
    id: number,
    username: string,
    phone_number: number,
    icon_url: string | null
    custom_status?: string
}

export interface Message {
    id?: number,
    content: string,
    attachments?: string | null,
    sender_id: number,
    recipient_id: number,
    time_sent?: string
}