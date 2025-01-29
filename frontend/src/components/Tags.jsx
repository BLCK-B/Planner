import { Flex } from "@chakra-ui/react";
import PropTypes from "prop-types";
import { Tag } from "@/components/ui/tag";

const Tags = ({ taskTags, handleAddTag, handleRemoveTag }) => {
  return (
    <Flex>
      {taskTags.map((tag, index) => (
        <Tag key={index} variant="surface" closable={!!handleRemoveTag} onClose={() => handleRemoveTag(tag)}>
          {tag}
        </Tag>
      ))}
      {handleAddTag && taskTags.length <= 2 && (
        <Tag onClick={handleAddTag} variant="surface">
          + tag
        </Tag>
      )}
    </Flex>
  );
};

Tags.propTypes = {
  taskTags: PropTypes.array.isRequired,
  handleAddTag: PropTypes.func,
  handleRemoveTag: PropTypes.func,
};

export default Tags;
