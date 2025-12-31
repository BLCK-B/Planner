import {defineConfig, defineTextStyles} from "@chakra-ui/react";
import "@fontsource/roboto";

const textStyles = defineTextStyles({
    body: {
        value: {
            fontFamily: {value: "Roboto, sans-serif"},
            fontWeight: {value: "500"},
            userSelect: {value: "none"},
        },
    },
})

const dark = {
    contrast: "#FFFFFF",
    darker: "#141414",
    base: "#1B1B1B",
    lighter: "#454545",
    lighterer: "#585858"
};

const light = {
    contrast: "#000000",
    darker: "#C8C8C8",
    base: "#E1E1E1",
    lighter: "#FFFFFF",
    lighterer: "#FFFFFF",
}
// spacing: 0.3 rem, 0.6 rem, 1.2 rem, 2.4 rem
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
                    BrightYellow: {value: "#f2d351"},
                },
            },
        },
    },
});