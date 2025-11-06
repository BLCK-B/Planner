import {useQuery} from "@tanstack/react-query";
import loadItemsQuery from "@/queries/LoadItemsQuery.tsx";
import useUpdateAllTasks from "@/queries/UseUpdateAllTasks.tsx";
import {reencrypt} from "@/functions/Crypto.ts";
import type {Task as TaskType} from "@/types/Task.ts";

// TODO: tables separately - fetch all in table, reencrypt all in client, then send
// TODO: special endpoints for this (replace with ids staying the same + verify)

const ReencryptionModal = () => {

    const updateAllTasksMutation = useUpdateAllTasks();

    const {data: itemList} = useQuery<TaskType[]>(loadItemsQuery());

    const reencryptAllData = async () => {
        if (!itemList) return;
        const reencryptedItems = await reencrypt(itemList);
        await updateAllTasksMutation.mutateAsync(reencryptedItems);
    };

    return () => {
        <>
        </>
    };
}

export default ReencryptionModal;