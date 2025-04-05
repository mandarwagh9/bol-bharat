
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const Navbar = () => {
  const isMobile = useIsMobile();

  return (
    <nav className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
      <div className="civic-container py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <MapPin className="h-6 w-6 text-civic-teal" />
            <span className="text-xl font-bold text-civic-dark">BOL BHARAT</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-600 hover:text-civic-teal transition-colors">
              Home
            </Link>
            <Link to="/issues" className="text-gray-600 hover:text-civic-teal transition-colors">
              View Issues
            </Link>
            <Link to="/map" className="text-gray-600 hover:text-civic-teal transition-colors">
              Map View
            </Link>
            <Link to="/about" className="text-gray-600 hover:text-civic-teal transition-colors">
              About
            </Link>
          </div>
          
          <Button asChild className="bg-civic-teal hover:bg-civic-teal/90">
            <Link to="/report">Report Issue</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
