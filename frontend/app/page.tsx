export default function Home() {
  console.log("hello there", process.env.NEXT_PUBLIC_API_BASE_URL);
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <h1>Hello there</h1>
    </div>
  );
}
