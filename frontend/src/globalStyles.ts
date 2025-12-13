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
        semanticTokens: {
            colors: {
                primary: {
                    base: {
                        value: {base: light.base, _dark: dark.base},
                    },
                    contrast: {
                        value: {base: light.contrast, _dark: dark.contrast},
                    },
                    darker: {
                        value: {base: light.darker, _dark: dark.darker},
                    },
                    lighter: {
                        value: {base: light.lighter, _dark: dark.lighter},
                    },
                    lighterer: {
                        value: {base: light.lighterer, _dark: dark.lighterer},
                    },
                },
                theme: {
                    Flame: {value: "#CF5C36"},
                    Red: {value: "#EE2E31"},
                    Success: {value: "#505c48"},
                    Spruit1: {value: "#839c38"},
                    Spruit2: {value: "#a1c339"},
                    Spruit3: {value: "#519c38"},
                    Spruit3Hover: {value: "#5bba41"},
                    Reddish: {value: "#f87171"},
                    ReddishHover: {value: "#ff4e4e"},
                },
            },
        },
    },
});