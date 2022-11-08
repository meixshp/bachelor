import fetch from 'node-fetch';

    export async function getButton() {

        try {
            //while (true) {
                return await holdConnection();
            //}

        } catch (error) {
            if (error instanceof Error) {
            console.log('error message: ', error.message);
            return error.message;
            } else {
            console.log('unexpected error: ', error);
            return 'An unexpected error occurred';
            }
        }
    }

    getButton();


    //--------------------------------------------------------------//


    async function holdConnection() {
        const response = await fetch('http://192.168.2.211:80', {
            method: 'GET',
            headers: {
            Accept: 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Error! status: ${response.status}`);
        }

        const result = (await response.json());

        //console.log('result is: ', JSON.stringify(result, null, 4));
        let stringified = JSON.stringify(result);
        let parsed = JSON.parse(stringified);
        //console.log("value: ");
        //console.log(parsed.buttonPressed);
        return parsed.buttonPressed;
    }