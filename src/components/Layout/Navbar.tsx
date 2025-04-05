
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MapPin, Menu } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";

const Navbar = () => {
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-[#FFF5E6] shadow-sm fixed top-0 left-0 right-0 z-50">
      <div className="civic-container py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="/lovable-uploads/e17d1cb2-47cc-4488-b8d1-2527a61f7a46.png" 
              alt="BOL BHARAT Logo" 
              className="h-10 w-auto" 
            />
            <span className="text-xl font-bold text-[#1E3A4F]">BOL BHARAT</span>
          </Link>
          
          {isMobile ? (
            <>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden"
              >
                <Menu className="h-6 w-6 text-[#1E3A4F]" />
              </Button>
              
              {mobileMenuOpen && (
                <div className="absolute top-full left-0 right-0 bg-[#FFF5E6] shadow-md p-4 flex flex-col space-y-4 md:hidden">
                  <Link 
                    to="/" 
                    className="text-[#1E3A4F] hover:text-[#FF7722] transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Home
                  </Link>
                  <Link 
                    to="/issues" 
                    className="text-[#1E3A4F] hover:text-[#FF7722] transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    View Issues
                  </Link>
                  <Link 
                    to="/map" 
                    className="text-[#1E3A4F] hover:text-[#FF7722] transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Map View
                  </Link>
                  <Link 
                    to="/about" 
                    className="text-[#1E3A4F] hover:text-[#FF7722] transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    About
                  </Link>
                  <Button 
                    asChild 
                    className="bg-[#FF7722] hover:bg-[#FF7722]/90 w-full"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Link to="/report">Report Issue</Link>
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="hidden md:flex items-center space-x-6">
              <Link to="/" className="text-[#1E3A4F] hover:text-[#FF7722] transition-colors">
                Home
              </Link>
              <Link to="/issues" className="text-[#1E3A4F] hover:text-[#FF7722] transition-colors">
                View Issues
              </Link>
              <Link to="/map" className="text-[#1E3A4F] hover:text-[#FF7722] transition-colors">
                Map View
              </Link>
              <Link to="/about" className="text-[#1E3A4F] hover:text-[#FF7722] transition-colors">
                About
              </Link>
            </div>
          )}
          
          <Button asChild className="bg-[#FF7722] hover:bg-[#FF7722]/90 hidden md:flex">
            <Link to="/report">Report Issue</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
