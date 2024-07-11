import Chat from "@/components/prebuilt/chat";

export default function Home() {
  return (
    <main className="flex h-screen flex-col items-center justify-between px-24">
      <div className="w-full min-w-[600px] flex flex-col gap-4">
        <p className="text-[28px] text-center font-medium">
          Generative UI {" "}
          <a
            href="https://github.com/virattt/financial-agent-ui"
            target="_blank"
            className="text-blue-600 hover:underline hover:underline-offset-2"
          >
            Financial Agent {" "}
          </a>
          with LangChain 🦜🔗
        </p>
        <Chat />
      </div>
    </main>
  );
}
