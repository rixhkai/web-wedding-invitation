export type rsvp = {
  id: string,
  name: string,
  email: string,
  phone: string,
  attendance: number,
  is_attend: boolean | 'true' | 'false',
  user_id?: string
}

export type WeddingGift = {
  id?: string,
  name: string,
  account_name: string,
  account_number?: number,
  bank_recipient?: string,
  notes: string,
  user_id?: string,
  amount: number,
  receipt_proof: string | File
}

export type User = {
  id: string,
  name: string,
  email?: string,
  phone?: string,
  date_created?: string,
  date_modified?: string
}

export type UserRequest = {
  name: string,
  email?: string,
  phone?: string
}

export type R2Files = {
  url?: string,
  key: string
}

export type Comment = {
  id: string,
  comment: string,
  user_id?: string,
  date_created: string,
  date_modified?: string,
  user?: User
}