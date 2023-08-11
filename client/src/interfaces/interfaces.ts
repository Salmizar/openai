export interface IChatMSG {
    role:string,
    content:string,
    document: string | null
}
export type IChatMessages = Array<IChatMSG>

export interface IFile {
    name:string,
    fileName:string
}
export type IFileList = Array<IFile>

export interface IAnswer {
    text:string,
    index:number,
    correctAnswer:boolean
}
export type IAnswers = Array<IAnswer>