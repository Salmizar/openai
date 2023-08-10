import axios from "axios";

function getFileList(): Promise<object> {
    return new Promise((resolve, reject) => {
        axios.get(process.env.VUE_APP_API_URL + "/files/",
            { withCredentials: true }
        )
            .then((response) => {
                if (response.status === 200) {
                    resolve(response.data);
                }
            })
            .catch((error: object) => {
                reject(error);
            });
    })
}
function uploadFile(file: File): Promise<number> {
    return new Promise((resolve, reject) => {
        const formData = new FormData();
        formData.append("file", file);
        fetch(process.env.VUE_APP_API_URL + "/files/?fileName=" + file.name, {
            method: 'POST',
            body: formData
        })
            .then((response) => {
                if (response.status === 200) {
                    resolve(response.status);
                }
            })
            .catch((error) => {
                reject(error);
            });
    })
}
function deleteFile(fileName: string): Promise<number> {
    return new Promise((resolve, reject) => {
        axios.delete(process.env.VUE_APP_API_URL + "/files/?fileName=" + fileName,
            { withCredentials: true }
        )
            .then((response) => {
                if (response.status === 200) {
                    resolve(response.status);
                }
            })
            .catch((error: object) => {
                reject(error);
            });
    })
}
export { getFileList, uploadFile, deleteFile };