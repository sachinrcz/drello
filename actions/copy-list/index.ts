"use server"

import { auth } from "@clerk/nextjs"
import { InputType , ReturnType} from "./types"
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";
import { CopyListSchema } from "./schema";
import { title } from "process";

const handler = async(data:InputType): Promise<ReturnType> =>{

    const {userId, orgId} = auth();

    if (!userId || !orgId){
        return {
            "error": "Unauthorized",
        }
    }

    const {id, boardId} = data;

    let list;

    try{
        const listToCopy = await db.list.findUnique({
            where: {
                id,
                boardId,
                board: {
                    orgId,
                },
            },
            include: {
                card: true
            }
        })

        if (!listToCopy){
            return {error: "List not found"};
        }

        const lastList = await db.list.findFirst({
            where: {boardId},
            orderBy: {order: "desc"},
            select: {order: true},
        });

        const newOrder = lastList? lastList.order+1 : 1;

        list = await db.list.create({
            data: {
                boardId: listToCopy.boardId,
                title: `${listToCopy.title} - Copy`,
                card: {
                    createMany: {
                        data: listToCopy.card.map((item) => ({
                            title: item.title,
                            description: item.description,
                            order: item.order,
                        }))
                    }
                },
                order: newOrder,
            },
            include: {
                card: true,
            }
        });

    }catch(error){
        return {
            "error": "Failed to copy",
        }
    }

    revalidatePath(`/board/${boardId}`);
    return {data: list}

}

export const copyList = createSafeAction(CopyListSchema, handler);