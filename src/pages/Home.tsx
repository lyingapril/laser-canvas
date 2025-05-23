import { CanvasEditor } from "../components/CanvasEditor";

export function Home() {
  return (
    <div className="h-screen w-screen flex flex-col">
      <header className="bg-gray-800 text-white p-4 text-xl font-bold">
        LaserCanvas - 在线图像编辑器
      </header>
      <main className="flex-1 bg-gray-100 p-4">
        <CanvasEditor />
      </main>
    </div>
  );
}