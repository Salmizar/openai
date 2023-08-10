export interface IChatMSG {
    role:string,
    content:string,
    document: string | null
}
export interface IChatMessages extends Array<IChatMSG> { }

export interface IFiles {
    name:string,
    fileName:string
}
export interface IFileList extends Array<IFiles> { }