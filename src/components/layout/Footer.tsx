import Link from 'next/link';
import { 
  Heart, 
  HeartPulse, 
  Shield, 
  Mail, 
  Phone, 
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <HeartPulse className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold">AutiScan</span>
            </div>
            <p className="mt-4 text-gray-400 text-sm">
              Empowering parents with AI-powered early autism screening tools and support.
            </p>
            <div className="mt-6 flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-400 hover:text-white">Home</Link></li>
              <li><Link href="/screening" className="text-gray-400 hover:text-white">Screening Tool</Link></li>
              <li><Link href="/chat" className="text-gray-400 hover:text-white">AI Assistant</Link></li>
              <li><Link href="/reports" className="text-gray-400 hover:text-white">Reports</Link></li>
              <li><Link href="/about" className="text-gray-400 hover:text-white">About Us</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><Link href="/resources" className="text-gray-400 hover:text-white">Resource Center</Link></li>
              <li><Link href="/faq" className="text-gray-400 hover:text-white">FAQ</Link></li>
              <li><Link href="/privacy" className="text-gray-400 hover:text-white">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-gray-400 hover:text-white">Terms of Service</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-white">Contact Us</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-blue-400" />
                <span className="text-gray-400">support@autiscan.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-blue-400" />
                <span className="text-gray-400">1-800-AUTISCAN</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-blue-400 mt-1" />
                <span className="text-gray-400">
                  123 Health Street<br />
                  San Francisco, CA 94107
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-blue-400" />
              <span className="text-sm text-gray-400">
                HIPAA Compliant • 256-bit SSL Encryption
              </span>
            </div>
            <div className="mt-4 md:mt-0">
              <p className="text-sm text-gray-400">
                © {new Date().getFullYear()} AutiScan. All rights reserved.
              </p>
            </div>
          </div>
          
          <div className="mt-4 text-sm text-gray-500 text-center md:text-left">
            <p className="text-xs">
              <span className="font-semibold">Important:</span> This tool is for screening purposes only and is not a diagnostic tool. 
              Always consult with a healthcare professional for medical advice.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;