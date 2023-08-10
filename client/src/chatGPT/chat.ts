import axios from "axios";
import { IChatMSG } from "../interfaces/interfaces";

function promptGPT(message: object):Promise<IChatMSG> {
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
            .catch((error: object) => {
                reject(error);
            });
    })
}

function docPromptGPT(message: object):Promise<IChatMSG> {
    return new Promise((resolve, reject) => {
        axios.post(process.env.VUE_APP_API_URL + "/filechat/",
            { message: JSON.stringify(message) },
            { withCredentials: true }
        )
            .then((response) => {
                if (response.status === 200) {
                    resolve(response.data.data);
                }
            })
            .catch((error: object) => {
                reject(error);
            });
    })
}

export { promptGPT, docPromptGPT };