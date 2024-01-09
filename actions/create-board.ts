"use server";

import { db} from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

export type State = {
  errors?:{
    title?: string[];
  },
  message?: string | null;

}

const createBoard = z.object({
    title: z.string().min(3, {
      message: "Min 3 characters required"
    }),
});

export async function create(prevState: State, formData: FormData){

    const validateFields = createBoard.safeParse({
        title: formData.get("title"),
    });

    if (!validateFields.success){
      return {
        errors: validateFields.error.flatten().fieldErrors,
        message: "Missing Fields",
      }
    }
    const {title} = validateFields.data;

    try{

   
      await db.board.create({
        data: {
          title
        }
      })
    }catch(error){
      return {
        message: "Database error"
      }
    }

    revalidatePath("/organization/org_2aTujGfGuOWhAp2OKEci8g2NSMB");
    redirect("/organization/org_2aTujGfGuOWhAp2OKEci8g2NSMB")
  }