
import { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

interface PageLayoutProps {
  children: ReactNode;
  className?: string;
}

const PageLayout = ({ children, className = "" }: PageLayoutProps) => {
  // Update the document title dynamically
  React.useEffect(() => {
    document.title = "BOL BHARAT";
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className={`flex-grow pt-20 ${className}`}>{children}</main>
      <Footer />
    </div>
  );
};

export default PageLayout;
