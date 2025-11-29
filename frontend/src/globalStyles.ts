import {defineConfig, defineTextStyles} from "@chakra-ui/react";
import "@fontsource/roboto";

const textStyles = defineTextStyles({
    body: {
        value: {
            fontFamily: "Roboto, sans-serif",
            fontWeight: "500",
            userSelect: "none",
            // fontSize: "20px",
        },
    },
})

const dark = {
    contrast: "#FFFFFF",
    darker: "#1a1a1a",
    base: "#262626",
    lighter: "#454545",
    lighterer: "#585858"
};

const light = {
    "contrast": "#000000",
    "darker": "#d0d0d0",
    "base": "#ebebeb",
    "lighter": "#FFFFFF",
    "lighterer": "#FFFFFF",
}

export const styles = defineConfig({
    theme: {
        textStyles,
        tokens: {
            colors: {
                primary: dark,
                theme: {
                    "Flame": "#CF5C36",
                    "Red": "#EE2E31",
                    "Success": "#505c48",
                    "Spruit1": "#839c38",
                    "Spruit2": "#a1c339",
                    "Spruit3": "#6a9c38",
                    "Spruit3Hover": "#7eba41",
                    "Reddish": "#f87171",
                    "ReddishHover": "#ff4e4e",
                },
            },
        },
    },
});