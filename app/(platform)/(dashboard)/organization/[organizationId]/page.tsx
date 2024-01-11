
import { db } from "@/lib/db";
import { Info } from "./_component/info";
import { Separator } from "@/components/ui/separator";
import { BoardList } from "./_component/board-list";

const OraganizationIdPage = async () => {

  return (
    <div className="w-full mb-20">
      <Info />
      <Separator className="my-4"/>
      <div className="px-2 md:px-4">
        <BoardList />
      </div>
    </div>
  )
}

export default OraganizationIdPage