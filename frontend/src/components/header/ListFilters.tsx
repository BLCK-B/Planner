import {Button, Flex, Heading, Spacer, Show, IconButton} from "@chakra-ui/react";
import {IoCalendarNumber} from "react-icons/io5";
import {useAtom} from 'jotai';
import {showExactDatesAtom} from "@/atoms.ts";

const ListFilters = () => {

    const [showExactDates, setShowExactDates] = useAtom(showExactDatesAtom);

    const activeColor = (active: boolean) => {
        return active ? "black" : "grey";
    };

    return (
        <Flex style={styles.filters} justify="center">
            <IconButton onClick={() => setShowExactDates(!showExactDates)} bg="none">
                <IoCalendarNumber color={activeColor(showExactDates)} aria-label="Complete"/>
            </IconButton>
        </Flex>
    );

};

export default ListFilters;

const styles = {
    filters: {
        height: "3em",
        // backgroundColor: "white",
    },
};