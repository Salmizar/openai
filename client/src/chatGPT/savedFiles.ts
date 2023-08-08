import axios from "axios";

function getFileList(): Promise<number> {
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
function uploadFile(file: any): Promise<number> {
    return new Promise((resolve, reject) => {
        const formData = new FormData();
        formData.append("file", file);
        fetch(process.env.VUE_APP_API_URL + "/files/?fileName=" + file.name, {
            method: 'POST',
            body: formData
        })
            .then((res) => {
                if (res.status === 200) {
                    resolve(res.status);
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
                    resolve(response.data);
                }
            })
            .catch((error: any) => {
                reject(error);
            });
    })
}
export { getFileList, uploadFile, deleteFile };