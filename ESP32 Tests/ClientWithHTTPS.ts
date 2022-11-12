const http = require("http");

export async function getButton() {
    try {
        return await holdConnection();
    } catch (error) {
        if (error instanceof Error) {
            console.log("error message: ", error.message);
            return error.message;
        } else {
            console.log("unexpected error: ", error);
            return "An unexpected error occurred";
        }
    }
}

console.log(getButton());

//--------------------------------------------------------------//

async function holdConnection() {
    let value: number = 0;
    await new Promise((resolve) => {
        http.get("http://192.168.2.211:80", (res: any) => {
            let data: any = [];

            res.on("data", (chunk: String) => {
                data.push(chunk);
            });

            res.on("end", () => {
                const parsed = JSON.parse(Buffer.concat(data).toString());
                //console.log(parsed.buttonPressed);
                value = parsed.buttonPressed;
                //console.log("in http: " + value);
                resolve(value);
            });
        }).on("error", (err: any) => {
            console.log("Error: ", err.message);
        });
    });
    return value;
}
