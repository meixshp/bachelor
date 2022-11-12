namespace Script {
    import test = Test;

    export async function getPosition() {

        try {
            return await holdConnection();
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

    //--------------------------------------------------------------//

    async function holdConnection() {
        const response = await test.fetching('http://192.168.2.211:90', {
            method: 'GET',
            headers: {
            Accept: 'application/json',
            },
        });
        return response;
    }
}