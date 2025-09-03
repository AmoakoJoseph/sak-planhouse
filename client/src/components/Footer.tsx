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
  Heart,
  Shield,
  Award,
  Users,
  FileText
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
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Company Info */}
            <div className="lg:col-span-1 space-y-6">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg">
                    <Building2 className="w-7 h-7 text-white" />
                  </div>
                  <div className="absolute -inset-1 bg-gradient-to-br from-primary to-secondary rounded-xl blur opacity-30"></div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">SAK Constructions</h3>
                  <p className="text-sm text-muted-foreground">Premium Plans Platform</p>
                </div>
              </div>
              
              <p className="text-muted-foreground leading-relaxed">
                Building dreams with professional architectural plans. Trusted by Ghana's leading contractors and architects.
              </p>
              
              <div className="flex space-x-4">
                {[
                  { icon: Facebook, href: '#', label: 'Facebook' },
                  { icon: Twitter, href: '#', label: 'Twitter' },
                  { icon: Instagram, href: '#', label: 'Instagram' },
                  { icon: Linkedin, href: '#', label: 'LinkedIn' },
                ].map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    className="w-10 h-10 bg-muted/20 hover:bg-primary/20 rounded-lg flex items-center justify-center text-muted-foreground hover:text-primary transition-all duration-300 group"
                    aria-label={social.label}
                  >
                    <social.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-6">
              <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Quick Links
              </h4>
              <ul className="space-y-3">
                {[
                  { name: 'Browse Plans', href: '/plans' },
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
            <div className="space-y-6">
              <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-primary" />
                Our Services
              </h4>
              <ul className="space-y-3">
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
            <div className="space-y-6">
              <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                <Mail className="w-5 h-5 text-primary" />
                Stay Connected
              </h4>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3 text-muted-foreground">
                  <Phone className="w-4 h-4 text-primary" />
                  <span className="text-sm">+233 20 123 4567</span>
                </div>
                <div className="flex items-center space-x-3 text-muted-foreground">
                  <Mail className="w-4 h-4 text-primary" />
                  <span className="text-sm">info@sakconstructions.com</span>
                </div>
                <div className="flex items-center space-x-3 text-muted-foreground">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span className="text-sm">Accra, Ghana</span>
                </div>
              </div>

              {/* Newsletter Subscription */}
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">Subscribe to our newsletter</p>
                <div className="flex space-x-2">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 bg-muted/20 border-muted/30 text-white placeholder:text-muted-foreground focus:border-primary focus:bg-muted/30 transition-all duration-300"
                  />
                  <Button className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white px-4 transition-all duration-300">
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="border-t border-muted/20 bg-muted/10">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
              <div className="flex items-center space-x-6">
                {[
                  { icon: Shield, label: 'Certified & Secure' },
                  { icon: Award, label: 'Quality Guaranteed' },
                  { icon: Users, label: 'Trusted by 2500+ Users' },
                ].map((indicator) => (
                  <div key={indicator.label} className="flex items-center space-x-2 text-muted-foreground">
                    <indicator.icon className="w-4 h-4 text-primary" />
                    <span className="text-sm">{indicator.label}</span>
                  </div>
                ))}
              </div>
              
              <div className="flex items-center space-x-2 text-muted-foreground">
                <span className="text-sm">Made with</span>
                <Heart className="w-4 h-4 text-primary fill-current" />
                <span className="text-sm">in Ghana</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-muted/20 bg-muted/5">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
              <div className="text-sm text-muted-foreground">
                © {currentYear} SAK Constructions. All rights reserved.
              </div>
              
              <div className="flex items-center space-x-6 text-sm text-muted-foreground">
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