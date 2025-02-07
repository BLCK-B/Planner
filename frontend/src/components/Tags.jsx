import { useState } from "react";
import { Flex, Input, Box, Show } from "@chakra-ui/react";
import PropTypes from "prop-types";
import { Tag } from "@/components/ui/tag";
import { Field } from "@/components/ui/field";

const Tags = ({ taskTags, handleAddTag, handleRemoveTag }) => {
  const [menuShown, setMenuShown] = useState(false);
  const [newTagName, setNewTagName] = useState("");

  const showTagMenu = () => {
    setMenuShown(true);
  };

  const handleInputChange = (e) => {
    setNewTagName(e.target.value);
  };

  const confirmNewTag = () => {
    setMenuShown(false);
    handleAddTag(newTagName);
    setNewTagName("");
  };

  return (
    <Flex>
      <Show when={!menuShown}>
        {taskTags.map((tag, index) => (
          <Tag key={index} variant="surface" closable={!!handleRemoveTag} onClose={() => handleRemoveTag(tag)}>
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

Tags.propTypes = {
  taskTags: PropTypes.array.isRequired,
  handleAddTag: PropTypes.func,
  handleRemoveTag: PropTypes.func,
  newTagName: PropTypes.string,
};

export default Tags;
