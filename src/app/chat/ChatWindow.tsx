"use client";
import { useEffect, useRef, useState } from "react";
import { useSocket } from "../_providers/SocketProvider";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Msg, FileMeta, SendPayload, FormValues } from "@/types/chat";

export default function ChatWindow({ roomId }: { roomId: string }) {
  const socket = useSocket();

  const { register, handleSubmit, reset } = useForm<FormValues>();
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  /* join room & listen once */
  useEffect(() => {
    if (!socket) return;

    /* join & pull history once */
    socket.emit("join", roomId);
    socket.emit("history", { roomId, limit: 50 }, (history: Msg[]) => {
      setMsgs(history.reverse()); // history returns newest first
    });

    /* real-time handlers */
    const onMsg = (m: Msg) => setMsgs((prev) => [...prev, m]);
    const onSystem = (txt: string) =>
      setMsgs((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          roomId,
          senderId: "system",
          type: "TEXT",
          text: txt,
        },
      ]);

    socket.on("message", onMsg);
    socket.on("system", onSystem);

    return () => {
      socket.off("message", onMsg);
      socket.off("system", onSystem);
    };
  }, [roomId, socket]);

  /* autoscroll */
  useEffect(() => bottomRef.current?.scrollIntoView(), [msgs]);

  /* --- form submit --------------------------------------- */
  async function onSend({ text, file }: FormValues) {
    let payload: SendPayload;

    if (file?.[0]) {
      /* upload via REST, then FILE message */
      const form = new FormData();
      form.append("file", file[0]);
      const meta = await axios
        .post<FileMeta>(`${process.env.NEXT_PUBLIC_REST_URL}/uploads`, form)
        .then((r) => r.data);

      payload = { roomId, type: "FILE", fileMeta: meta };
    } else {
      payload = { roomId, type: "TEXT", text };
    }

    socket?.emit("send", payload);
    reset();
  }

  /* --- render -------------------------------------------- */
  if (socket === null) {
    return <p className="p-4 text-sm">Connecting…</p>;
  }

  return (
    <div className="w-full max-w-md h-[80vh] flex flex-col border rounded-xl shadow bg-white p-4">
      <div className="flex-1 overflow-y-auto space-y-2">
        {msgs.map((m) => (
          <div key={m.id} className="text-sm">
            {m.type === "TEXT" ? (
              m.text
            ) : (
              <a
                className="text-blue-600 underline"
                href={m.fileMeta.url}
                target="_blank"
              >
                {m.fileMeta.name}
              </a>
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSubmit(onSend)} className="pt-2 flex gap-2">
        <input
          {...register("text")}
          placeholder="Aa"
          autoComplete="off"
          className="flex-1 border rounded px-2"
        />
        <input type="file" {...register("file")} className="w-24 text-xs" />
        <button className="bg-blue-600 text-white px-3 rounded">Send</button>
      </form>
    </div>
  );
}
