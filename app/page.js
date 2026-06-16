export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-2 px-5 py-8 text-center">
      <p className="text-xss font-semibold uppercase tracking-wide text-content-brand">
        Prototype starter
      </p>
      <h1 className="text-2xl font-bold">Welcome 👋</h1>
      <p className="text-xs text-content-secondary">
        Start building your prototype by editing{" "}
        <code className="font-mono text-content-primary">app/page.js</code>.
      </p>
    </div>
  );
}
