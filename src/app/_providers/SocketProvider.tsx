// app/_providers/SocketProvider.tsx
"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { getToken } from "@/lib/auth";

type MaybeSocket = Socket | null | undefined;

const Ctx = createContext<MaybeSocket>(undefined);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<MaybeSocket>(null);
  const jwt = getToken();

  useEffect(() => {
    if (!jwt) return; // not logged in yet

    const s = io(process.env.NEXT_PUBLIC_CHAT_WS_URL!, {
      path: process.env.NEXT_PUBLIC_CHAT_WS_PATH, // "/socket.io"
      transports: ["websocket"],
      auth: { token: jwt },
    });

    setSocket(s);

    return () => {
      s.disconnect();
    }; // cleanup
  }, [jwt]); // ← triggers on login / logout

  return <Ctx.Provider value={socket}>{children}</Ctx.Provider>;
};

export const useSocket = () => {
  const sock = useContext(Ctx);
  if (sock === undefined) throw new Error("SocketProvider missing");
  return sock;
};
