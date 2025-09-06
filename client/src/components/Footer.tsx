import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  ArrowRight, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin,
  FileText,
  Award
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-foreground via-foreground to-foreground/95 text-foreground-foreground relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[size:20px_20px]"></div>
      </div>

      <div className="relative z-10">
              {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {/* Company Info */}
            <div className="lg:col-span-1 space-y-4">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-br from-primary to-secondary rounded-xl blur opacity-30"></div>
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <img 
                      src="/logo.png" 
                      alt="SAK Constructions" 
                      className="h-6 w-auto"
                    />
                  </div>
                </div>
              </div>
              
              <p className="text-muted-foreground leading-relaxed text-sm">
                Building dreams with professional architectural plans. Trusted by Ghana's leading professionals.
              </p>
              
              <div className="flex space-x-3">
                {[
                  { icon: Facebook, href: '#', label: 'Facebook' },
                  { icon: Twitter, href: '#', label: 'Twitter' },
                  { icon: Instagram, href: '#', label: 'Instagram' },
                  { icon: Linkedin, href: '#', label: 'LinkedIn' },
                ].map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    className="w-8 h-8 bg-muted/20 hover:bg-primary/20 rounded-lg flex items-center justify-center text-muted-foreground hover:text-primary transition-all duration-300 group"
                    aria-label={social.label}
                  >
                    <social.icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h4 className="text-base font-semibold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" />
                Quick Links
              </h4>
              <ul className="space-y-2">
                {[
                  { name: 'Browse Plans', href: '/plans' },
                  { name: 'Services', href: '/services' },
                  { name: 'About Us', href: '/about' },
                  { name: 'Contact', href: '/contact' },
                  { name: 'How It Works', href: '/how-it-works' },
                  { name: 'FAQ', href: '/faq' },
                ].map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-muted-foreground hover:text-primary transition-colors duration-300 flex items-center gap-2 group"
                    >
                      <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div className="space-y-4">
              <h4 className="text-base font-semibold text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-primary" />
                Our Services
              </h4>
              <ul className="space-y-2">
                {[
                  'Villa Plans',
                  'Bungalow Designs',
                  'Townhouse Plans',
                  'Custom Architecture',
                  '3D Renderings',
                  'Construction Support',
                ].map((service) => (
                  <li key={service}>
                    <span className="text-muted-foreground hover:text-primary transition-colors duration-300 cursor-pointer">
                      {service}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact & Newsletter */}
            <div className="space-y-4">
              <h4 className="text-base font-semibold text-white flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                Stay Connected
              </h4>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-muted-foreground">
                  <Phone className="w-4 h-4 text-primary" />
                  <span className="text-sm">0246798967 / 0233798967</span>
                </div>
                <div className="flex items-center space-x-3 text-muted-foreground">
                  <Mail className="w-4 h-4 text-primary" />
                  <span className="text-sm">sakconstructiongh@gmail.com</span>
                </div>
                <div className="flex items-center space-x-3 text-muted-foreground">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span className="text-sm">Tema com 25, Greater Accra around Devtraco Estates</span>
                </div>
              </div>

              {/* Newsletter Subscription */}
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">Subscribe to our newsletter</p>
                <div className="flex space-x-2">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 bg-muted/20 border-muted/30 text-white placeholder:text-muted-foreground focus:border-primary focus:bg-muted/30 transition-all duration-300 text-sm py-2"
                  />
                  <Button className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white px-3 py-2 transition-all duration-300">
                    <ArrowRight className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>



        {/* Bottom Bar */}
        <div className="border-t border-muted/20 bg-muted/5">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0">
              <div className="text-xs text-muted-foreground flex items-center space-x-2">
                <img 
                  src="/logo.png" 
                  alt="SAK Constructions" 
                  className="h-4 w-auto opacity-70"
                />
                <span>© {currentYear} All rights reserved.</span>
              </div>
              
              <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                <Link to="/terms" className="hover:text-primary transition-colors duration-300">
                  Terms of Service
                </Link>
                <Link to="/privacy" className="hover:text-primary transition-colors duration-300">
                  Privacy Policy
                </Link>
                <Link to="/cookies" className="hover:text-primary transition-colors duration-300">
                  Cookie Policy
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;