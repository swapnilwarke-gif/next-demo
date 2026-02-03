import Navbar from "../components/Navbar";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-100 p-6">
        {children}
      </main>
    </>
  );
}