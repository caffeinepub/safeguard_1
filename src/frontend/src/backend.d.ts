import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export type Time = bigint;
export interface ChecklistItem {
    name: string;
    completed: boolean;
    photo?: ExternalBlob;
}
export interface Submission {
    storeName: string;
    timestamp: Time;
    items: Array<ChecklistItem>;
}
export interface backendInterface {
    getAllSubmissions(): Promise<Array<Submission>>;
    getSubmission(user: Principal): Promise<Submission>;
    submitChecklist(storeName: string, items: Array<ChecklistItem>): Promise<void>;
}
