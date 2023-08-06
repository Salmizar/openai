import axios from "axios";

function promptGPT(message: object):Promise<number> {
    return new Promise((resolve, reject) => {
        axios.post(process.env.VUE_APP_API_URL + "/chat/",
            { message: JSON.stringify(message) },
            { withCredentials: true }
        )
            .then((response) => {
                if (response.status === 200) {
                    resolve(response.data.data);
                }
            })
            .catch((error: any) => {
                reject(error);
            });
    })
}

export { promptGPT };