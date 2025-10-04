import {Tag} from "@chakra-ui/react";

type Props = {
    name: string;
};

const TagView = ({name}: Props) => {
    return (
        <Tag.Root variant="surface" style={styles.tag} bg="primary.base" color="primary.contrast">
            <Tag.Label>
                {name}
            </Tag.Label>
        </Tag.Root>
    );
};

export default TagView;

const styles = {
    tag: {
        height: "25px",
    },
};
