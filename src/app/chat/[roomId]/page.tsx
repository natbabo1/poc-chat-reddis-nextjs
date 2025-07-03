import { SocketProvider } from "@/app/_providers/SocketProvider";
import ChatWindow from "../ChatWindow";
import React from "react";

export default function ChatRoute({ params }: { params: { roomId: string } }) {
  return (
    <SocketProvider>
      <ChatWindow roomId={params.roomId} />
    </SocketProvider>
  );
}
