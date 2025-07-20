import { useState } from "react";
import { Flex, Input, Box, Show } from "@chakra-ui/react";
import { Tag } from "@/components/ui/tag";
import { Field } from "@/components/ui/field";
import * as React from "react";

type Props = {
  taskTags: string[];
  handleAddTag?: (name: string) => void;
  handleRemoveTag?: (name: string) => void;
};

const Tags = ({ taskTags, handleAddTag, handleRemoveTag }: Props) => {
  const [menuShown, setMenuShown] = useState(false);
  const [newTagName, setNewTagName] = useState("");

  const showTagMenu = () => {
    setMenuShown(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTagName(e.target.value);
  };

  const confirmNewTag = () => {
    setMenuShown(false);
    if (handleAddTag) {
      handleAddTag(newTagName);
    }
    setNewTagName("");
  };

  return (
    <Flex>
      <Show when={!menuShown}>
        {taskTags.map((tag, index) => (
          <Tag key={index} variant="surface" closable={!!handleRemoveTag} onClose={() => handleRemoveTag ? handleRemoveTag(tag) : null}>
            {tag}
          </Tag>
        ))}
      </Show>
      {handleAddTag && taskTags.length <= 2 && !menuShown && (
        <Tag onClick={showTagMenu} variant="surface">
          + tag
        </Tag>
      )}
      <Show when={menuShown}>
        <Box>
          <Tag onClick={() => setMenuShown(false)} variant="surface">
            cancel
          </Tag>
          <Tag onClick={confirmNewTag} variant="surface" disabled={!newTagName}>
            confirm
          </Tag>
          <Field invalid={!newTagName}>
            <Input value={newTagName} onChange={handleInputChange} />
          </Field>
        </Box>
      </Show>
    </Flex>
  );
};
export default Tags;
