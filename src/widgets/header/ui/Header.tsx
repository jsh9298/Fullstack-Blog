export const Header = () => (
  <header className="border-b py-4 px-6 flex justify-between items-center bg-white">
    <h1 className="text-xl font-bold">BLOG LOGO</h1>
    <nav className="space-x-4">
      <a href="/" className="hover:text-blue-500">Home</a>
      <a href="/feed" className="hover:text-blue-500">Feed</a>
    </nav>
  </header>
);