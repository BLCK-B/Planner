import {defineConfig, defineTextStyles} from "@chakra-ui/react";
import "@fontsource/roboto";

const textStyles = defineTextStyles({
    body: {
        value: {
            fontFamily: "Roboto, sans-serif",
            fontWeight: "500",
            // fontSize: "20px",
        },
    },
})

export const styles = defineConfig({
    theme: {
        textStyles,
        tokens: {
            colors: {
                // primary: {
                //     "contrast": "#000000",
                //     "lighter": "#FFFFFF",
                //     "base": "#ebebeb",
                //     "darker": "#d0d0d0",
                // },
                primary: {
                    "contrast": "#FFFFFF",
                    "darker": "#1a1a1a",
                    "base": "#262626",
                    "lighter": "#454545",
                    "lighterer": "#585858"
                },
                theme: {
                    "Peach": "#F4C095",
                    "Flame": "#CF5C36",
                    "Red": "#EE2E31",
                    "Success": "#505c48",
                    "Spruit1": "#839c38",
                    "Spruit2": "#a1c339",
                    "Reddish": "#f87171",
                    "ReddishLight": "#f9dbdb",
                    "Main": "#619324",
                },
            },
        },
    },
});