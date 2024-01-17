"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useCardModel } from "@/hooks/use-card-model";
import { fetcher } from "@/lib/fetcher";
import { CardWithList } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { Header } from "./header";
import { Description } from "./description";
import { CardActions } from "./actions";
import { AuditLog } from "@prisma/client";
import { Activity } from "./activity";

export const CardModal = () => {

    const id = useCardModel((state)=> state.id);
    const isOpen = useCardModel((state)=> state.isOpen);
    const onClose = useCardModel((state) => state.onClose);

    const {data: cardData} = useQuery<CardWithList>({
        queryKey: ["card", id],
        queryFn: () => fetcher(`/api/cards/${id}`)
    });

    const {data: auditLogData} = useQuery<AuditLog[]>({
        queryKey: ["card-logs", id],
        queryFn: () => fetcher(`/api/cards/${id}/logs`)
    });

    return (
        <Dialog
            open={isOpen}
            onOpenChange={onClose}
        >
            <DialogContent>
                {!cardData ? <Header.Skeleton /> : <Header data={cardData}/>}
                <div className="grid grid-cols-1 md:grid-cols-4 md:gap-4">
                <div className="col-span-3">
                    <div className="w-full space-y-6">
                    {!cardData
                        ? <Description.Skeleton />
                        : <Description data={cardData} />
                    }
                    {!auditLogData
                        ? <Activity.Skeleton />
                        : <Activity items={auditLogData} />
                    }
                    </div>
                </div>
                {!cardData
                    ? <CardActions.Skeleton />
                    : <CardActions data={cardData} />
                }
        </div>
                
                
            </DialogContent>
        </Dialog>
    );
};

