import {toHashString}from "https://deno.land/std@0.195.0/crypto/to_hash_string.ts"
import {crypto}from "https://deno.land/std@0.195.0/crypto/mod.ts"

export const hashWithSalt=(password:string,salt:string)=>{
    const messageBuffer = new TextEncoder().encode(password+salt);
    const hashBuffer = crypto.subtle.digest("SHA-256", messageBuffer);
    return hashBuffer.then(toHashString);
}

export const generateSalt=()=>{
    const buf=crypto.getRandomValues(new Uint8Array(16));
    return toHashString(buf);
}