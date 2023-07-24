import {serve}from "https://deno.land/std@0.195.0/http/server.ts";

const PORT=8000;
const server =Deno.listen({port:PORT});
console.log(`Server running on port ${PORT}`);

for await(const conn of server){
    serveHttp(conn);
}

async function serveHttp(conn:Deno.Conn){
    const httpConn=Deno.serveHttp(conn);
    for await(const requestEvent of httpConn){
        const body=`musuem-api`;
        requestEvent.respondWith(
            new Response(body,{
                status:200,
                headers:{
                    "content-type":"text/plain",
                },
            }),
        );
    }
}