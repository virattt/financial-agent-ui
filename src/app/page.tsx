import { AI } from "@/app/action";
import { Chat } from "@/components/llm/chat";

export default function Home() {
  return (
    <AI>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <Chat />
      </main>
    </AI>
  );
}
