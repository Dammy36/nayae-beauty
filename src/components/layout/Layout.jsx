import Header from "./Header.jsx";
import Footer from "./Footer.jsx";

// Wraps every customer-facing page with the shared header and footer,
// so each page component only has to worry about its own content.
function Layout({ children }) {
  return (
    <>
      <Header />
      <main className="site-main">{children}</main>
      <Footer />
    </>
  );
}

export default Layout;
