"use server"

import { auth } from "@clerk/nextjs"
import { InputType, ReturnType } from "./types"
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";
import { createBoardSchema } from "./schema";
import { CreateAuditLog } from "@/lib/create-audit-log";
import { ACTION, ENTITY_TYPE } from "@prisma/client";
import { incrementAvailableCount, hasAvailableCount } from "@/lib/org-limit";
import { checkSubscription } from "@/lib/subscription";


const handler  = async(data: InputType): Promise<ReturnType> => {

  const {userId, orgId} = auth();

  if (!userId || !orgId ){
    return {
      error: "Unauthorised",
    }
  }

  const canCreate = await hasAvailableCount();
  const isPro = await checkSubscription();


  if(!canCreate && !isPro){
    return {
      error: "You have reached your limit of free boards. Please upgrade"
    }
  }

  const {title, image} = data;

  const [
    imageId,
    imageThumbUrl, 
    imageFullUrl,
    imageLinkHTML,
    imageUserName,

  ] = image.split("|")
  console.log({
    imageId,
    imageThumbUrl, 
    imageFullUrl,
    imageLinkHTML,
    imageUserName,
  })

  if (!imageId || !imageThumbUrl || !imageFullUrl || !imageUserName || !imageLinkHTML){
    return {
      error: "Missing Fields. Failed to create board"
    }
  }

  let board;

  try{
    board = await db.board.create({
      data: {
        title,
        orgId,
        imageId,
        imageThumbUrl,
        imageFullUrl,
        imageUserName,
        imageLinkHTML
      }
    })

    if(!isPro){
      await incrementAvailableCount();
    }

    await CreateAuditLog({
      entityTitle: board.title,
      entityId: board.id,
      entityType: ENTITY_TYPE.BOARD,
      action: ACTION.CREATE,
    })


  } catch (error){

    return {
      error: "Failed to create",
    }
  }

  revalidatePath(`/board/$(board.id)`);
  return {data: board}
}

export const createBoard = createSafeAction(createBoardSchema, handler)