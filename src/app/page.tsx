"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { setToken } from "@/lib/auth";

interface Inputs {
  jwt: string;
  roomId: string;
}

export default function Landing() {
  const router = useRouter();
  const { register, handleSubmit } = useForm<Inputs>();

  // /* auto-skip if token already exists */
  // useEffect(() => {
  //   if (getToken()) router.push("/chat/demo"); // pick any default room
  // }, [router]);

  const onSubmit = ({ jwt, roomId }: Inputs) => {
    setToken(jwt.trim());
    router.push(`/chat/${encodeURIComponent(roomId.trim())}`);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 p-6 bg-white rounded-xl shadow-lg w-full max-w-sm"
      >
        <h1 className="text-xl font-semibold text-center">Enter Chat</h1>

        <input
          {...register("jwt", { required: true })}
          placeholder="Paste JWT token"
          className="w-full border rounded px-3 py-2 text-sm"
        />

        <input
          {...register("roomId", { required: true })}
          placeholder="Room ID (e.g. demo)"
          className="w-full border rounded px-3 py-2 text-sm"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Join
        </button>
      </form>
    </main>
  );
}
