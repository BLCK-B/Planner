import {Progress} from "@chakra-ui/react";

type Props = {
    completed: number;
    total: number;
    color: string;
}

const CompletionProgress = ({completed, total, color}: Props) => {

    const progress = total === 0 ? 0 : (completed / total) * 100;

    return (
        <Progress.Root w="100px" size="sm" value={progress}>
            <Progress.Track bg="primary.darker">
                <Progress.Range bg={color}/>
            </Progress.Track>
            <Progress.Label>
                {completed + ' / ' + total}
            </Progress.Label>
        </Progress.Root>
    );
}

export default CompletionProgress;