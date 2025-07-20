import { IconButton, Show } from "@chakra-ui/react";
import { CiBookmarkCheck } from "react-icons/ci";
import { useTaskContext } from "../TaskContext.tsx";

const SaveIndicator = () => {
  const { dataIsSaved } = useTaskContext();

  return (
    <Show when={dataIsSaved}>
      <IconButton>
        <CiBookmarkCheck />
      </IconButton>
    </Show>
  );
};
export default SaveIndicator;
