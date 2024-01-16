"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useCardModel } from "@/hooks/use-card-model";
import { fetcher } from "@/lib/fetcher";
import { CardWithList } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { Header } from "./header";

export const CardModal = () => {

    const id = useCardModel((state)=> state.id);
    const isOpen = useCardModel((state)=> state.isOpen);
    const onClose = useCardModel((state) => state.onClose);

    const {data: cardData} = useQuery<CardWithList>({
        queryKey: ["card", id],
        queryFn: () => fetcher(`/api/cards/${id}`)
    });

    return (
        <Dialog
            open={isOpen}
            onOpenChange={onClose}
        >
            <DialogContent>
                {!cardData ? <Header.Skeleton /> : <Header data={cardData}/>}
                
            </DialogContent>
        </Dialog>
    );
};

