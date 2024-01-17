"use client";

import { stripeRedirect } from "@/actions/stripe-redirect";
import { Button } from "@/components/ui/button";
import { useAction } from "@/hooks/use-action";
import { useProModel } from "@/hooks/use-pro-model";
import { toast } from "sonner";

interface SubscriptionButtonProps {
    isPro: boolean;
}

export const SubscriptionButton = ({isPro}: SubscriptionButtonProps)=>{

    const proModal = useProModel();

    const {execute, isLoading} = useAction(stripeRedirect, {
        onSuccess: (data)=> {
            window.location.href = String(data);
        },
        onError: (error) => {
            toast.error(error);
        }
    });

    const onClick = () => {
        if(isPro){
            execute({});
        }else{
            proModal.onOpen();
        }
    }

    return (
        <Button
            variant="primary"
            disabled={isLoading}
            onClick={onClick}
        >
            {isPro? "Manage Subscription" : "Upgrade to Pro"}
        </Button>
    )
}