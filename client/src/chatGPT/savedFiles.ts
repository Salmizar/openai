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
function uploadFile(file:any):Promise<number> {
    return new Promise((resolve, reject) => {
        const formData = new FormData();
        formData.append("file", file, file.name);
        axios.post(process.env.VUE_APP_API_URL + "/files/?fileName="+file.name, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        .then((response) => {
            if (response.status === 200) {
                resolve(response.data);
            }
        })
        .catch((error: any) => {
            console.log('uploadFile');
            reject(error);
        });
    })
}
function deleteFile(fileName:string):Promise<number> {
    return new Promise((resolve, reject) => {
        axios.delete(process.env.VUE_APP_API_URL + "/files/?fileName="+fileName,
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