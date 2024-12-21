export interface IProject {
    _id: string;
    url: string;
    type: string;
    image?: {
        data: ArrayBuffer;
    };
}