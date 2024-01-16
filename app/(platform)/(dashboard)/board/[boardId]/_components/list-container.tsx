"use client";

import { ListWithCards } from "@/types";
import { ListForm } from "./list-form";
import { useEffect, useState } from "react";
import { ListItem } from "./list-item";
import {
    DragDropContext,
    Droppable
} from "@hello-pangea/dnd"

import { useAction } from "@/hooks/use-action";
import { updateListOrder } from "@/actions/update-list-order";
import { updateCardOrder } from "@/actions/update-card-order";
import { toast } from "sonner";


interface ListContainerProps {
    data: ListWithCards[];
    boardId: string;
}

function reorder<T>(list: T[], startIndex: number, endIndex: number){
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
}

export const ListContainer = ({
    data,
    boardId,
}: ListContainerProps) => {

    const [orderedData, setOrderedData] = useState(data);

    const {execute: executeUpdateListOrder} = useAction(updateListOrder,{
        onSuccess: ()=>{
            toast.success("List Reordered");
        },
        onError: (error)=>{
            toast.error(error)
        }

    })

    const {execute: executeUpdateCardOrder} = useAction(updateCardOrder,{
        onSuccess: ()=>{
            toast.success("Card Reordered");
        },
        onError: (error)=>{
            toast.error(error)
        }

    })

    useEffect(()=>{
        setOrderedData(data);
    }, [data])

    const onDragEnd = (result: any) => {
        const {destination, source, type} = result;
        if(!destination){
            return;
        }

        // If Dropped in the same position
        if(
            destination.droppableId === source.droppableId && 
            destination.index === source.index
        ){
            return ;
        }

        // If user is moving a list

        if (type === "list"){
                const items = reorder(
                    orderedData,
                    source.index,
                    destination.index,
                ).map((item, index)=> ({...item, order:index}));
                setOrderedData(items);

                executeUpdateListOrder({items, boardId})

        }

        // if user moves a card

        if(type === "card"){
            let newOrderedData = [...orderedData];

            //source and destination list
            const sourceList = newOrderedData.find(list=> list.id === source.droppableId);
            const destList = newOrderedData.find(list => list.id === destination.droppableId);

            if (!sourceList || !destList){
                return ;
            }

            // check if card exists on the Source List
            if(!sourceList.card){
                sourceList.card = [];
            }
            
            // check if card exists on the Destination List
            if(!destList.card){
                destList.card = [];
            }

            // Moving the card in same list
            if (source.droppableId === destination.droppableId){
                const reorderedCards = reorder(
                    sourceList.card,
                    source.index,
                    destination.index,
                )

                reorderedCards.forEach((card, index)=>{
                    card.order = index;
                });

                sourceList.card = reorderedCards
                
                setOrderedData(newOrderedData)

                executeUpdateCardOrder({
                    boardId: boardId,
                    items: reorderedCards})

                
            } else{
                // User moved to different list

                // removed card from source list
                const [movedCard] = sourceList.card.splice(source.index, 1);

                // assign the new listid to the moved card
                movedCard.listId = destination.droppableId;

                // Add card to the destination list
                destList.card.splice(destination.index, 0, movedCard);

                sourceList.card.forEach((card, idx)=>{
                    card.order = idx;
                })

                // update the order for each card in destination list
                destList.card.forEach((card, idx)=>{
                    card.order = idx;
                })

                executeUpdateCardOrder({
                    boardId: boardId,
                    items: destList.card})
            }
            



        }

    }

    return (
        <DragDropContext
            onDragEnd={onDragEnd}
        >
            <Droppable droppableId="lists" type="list" direction="horizontal">
                {(provided) => (
                    <ol 
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="flex gap-x-3 h-full"
                    >
                        {orderedData.map((list, index)=>{
                            return (
                                <ListItem 
                                    key={list.id}
                                    index={index}
                                    data={list}
                                />
                            )
                        })}
                        {provided.placeholder}
                        <ListForm />
                        <div className="flex-shrink-0 w-1"/>
                    </ol>
                )}
                
            </Droppable>
        </DragDropContext>
    )
}