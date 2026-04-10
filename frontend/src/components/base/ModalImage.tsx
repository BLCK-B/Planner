import {Flex, Image} from "@chakra-ui/react";

type Props = {
    src: string;
}

const ModalImage = ({src}: Props) => {
    return (
        <Flex justifyContent="center" alignItems="center" p="0.6rem 0 0.6rem 0"
              bg="primary.lighter/30" m="0.6rem 0 0.6rem 0" borderRadius="md">
            <Image src={src} boxShadow="xs" borderRadius="md" w="95%"/>
        </Flex>
    );
}

export default ModalImage;