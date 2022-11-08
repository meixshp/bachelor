import { getButton } from './ConstantClient';

export async function testing() {
    while (true) {
        let value: number = await getButton();
        if (value == 1) 
            console.log("Button is pressed");
        if (value == 0)
            console.log("Nothing");
    }
}

testing();
