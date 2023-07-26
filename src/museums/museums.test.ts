import {t} from "../deps.ts"
import {Controller,Repository} from "./index.ts"

Deno.test("it is able to get all the museums from storage", async () => {
    const repository = new Repository()

    repository.storage.set("0", {
        description:"museum with id 0",
        name:"museum 0",
        id:"0",
        location:{
            lat:"0",
            lng:"0"
        }
    })

    repository.storage.set("1", {
        description:"museum with id 1",
        name:"museum 1",
        id:"1",
        location:{
            lat:"1",
            lng:"1"
        }
    })

    const controller = new Controller({museumRepository:repository})

    const allMuseums = await controller.getAll()

    t.assertEquals(allMuseums.length,2,"has the correct length")
    t.assertEquals(allMuseums[0].id,"0","has the correct id")
    t.assertEquals(allMuseums[0].name,"museum 0","has the correct name")
    t.assertEquals(allMuseums[0].description,"museum with id 0","has the correct description")
    t.assertEquals(allMuseums[0].location.lat,"0" ,"has the correct lat")
    t.assertEquals(allMuseums[0].location.lng,"0","has the correct lng")
})