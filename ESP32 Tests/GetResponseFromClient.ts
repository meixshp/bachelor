import { getButton } from "./ClientWithHTTPS";

/* FOR './ContantClient'
export async function testing() {
    while (true) {
        let value: number = await getButton();
        if (value == 1) 
            console.log("Button is pressed");
        if (value == 0)
            console.log("Nothing");
    }
} */

// FOR './ClientWithHTTPS'
export async function testing() {
    while (true) {
        let value = await getButton();
        console.log(value);
        if (value == 1) console.log("Button is pressed");
        if (value == 0) console.log("Nothing");
    }
}

testing();
