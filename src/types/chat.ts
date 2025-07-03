/* domain ---------------------------------------------------- */

export interface FileMeta {
  url: string;
  name: string;
  size: number;
  mime: string;
}

export type TextMsg = {
  id: string;
  roomId: string;
  senderId: string;
  type: "TEXT";
  text: string;
};

export type FileMsg = {
  id: string;
  roomId: string;
  senderId: string;
  type: "FILE";
  fileMeta: FileMeta;
};

export type Msg = TextMsg | FileMsg;

export type SendPayload =
  | { roomId: string; type: "TEXT"; text: string }
  | { roomId: string; type: "FILE"; fileMeta: FileMeta };

/* helpers --------------------------------------------------- */

export interface Room {
  id: string;
  type: "ONE_TO_ONE" | "GROUP";
  lastMessage: Msg | null;
}

export interface FormValues {
  text: string;
  file: FileList;
}
