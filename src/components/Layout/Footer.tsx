import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-civic-dark text-white mt-16 py-12">
      <div className="civic-container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center space-x-2">
              <MapPin className="h-6 w-6 text-civic-teal" />
              <span className="text-xl font-bold">BolBharat</span>
            </Link>
            <p className="mt-4 text-gray-300">
              Empowering citizens to report and track civic issues for a better community.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/issues" className="text-gray-300 hover:text-white transition-colors">
                  View Issues
                </Link>
              </li>
              <li>
                <Link to="/map" className="text-gray-300 hover:text-white transition-colors">
                  Map View
                </Link>
              </li>
              <li>
                <Link to="/report" className="text-gray-300 hover:text-white transition-colors">
                  Report Issue
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-300 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-300 hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-gray-300">
              <li>Email: mandarawagh90@gmail.com</li>
              <li>Phone: +91 9604524079</li>
              <li>Address: CESA FY</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} BolBharat. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
