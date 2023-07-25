export type User={
    username:string,
    hash:string,
    salt:string,
    created_at:Date,
}

export type {
    RegisterPayload,
}from "./types.ts";