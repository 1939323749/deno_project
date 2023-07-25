import {createHash}from "https://deno.land/std/hash/mod.ts"
import {encodeToString}from "https://deno.land/std/encoding/hex.ts"

export const hashWithSalt=(password:string,salt:string)=>{
    const hash=createHash("sha512").update(password+salt).toString();
    return hash;
}

export const generateSalt=()=>{
    const buf=crypto.getRandomValues(new Uint8Array(16));
    return encodeToString(buf);
}