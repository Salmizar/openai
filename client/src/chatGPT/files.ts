import axios from "axios";

function getFileList():Promise<number> {
    return new Promise((resolve, reject) => {
        axios.get(process.env.VUE_APP_API_URL + "/files/",
            { withCredentials: true }
        )
            .then((response) => {
                if (response.status === 200) {
                    resolve(response.data);
                }
            })
            .catch((error: any) => {
                reject(error);
            });
    })
}

export { getFileList };