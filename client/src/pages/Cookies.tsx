import { 
  Cookie, 
  Settings, 
  Shield, 
  Eye, 
  Database, 
  Globe,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  Mail,
  Phone,
  Building2,
  Info
} from 'lucide-react';
import Header from '@/components/Header';


const Cookies = () => {
  const cookieTypes = [
    {
      category: "Essential Cookies",
      description: "These cookies are necessary for the website to function properly. They enable basic functions like page navigation and access to secure areas of the website.",
      examples: ["Authentication cookies", "Session management", "Security features"],
      duration: "Session or up to 1 year",
      canDisable: false
    },
    {
      category: "Analytics Cookies",
      description: "These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.",
      examples: ["Page views", "User behavior", "Traffic sources"],
      duration: "Up to 2 years",
      canDisable: true
    },
    {
      category: "Preference Cookies",
      description: "These cookies allow the website to remember choices you make and provide enhanced, more personal features.",
      examples: ["Language preferences", "Theme settings", "Customized content"],
      duration: "Up to 1 year",
      canDisable: true
    },
    {
      category: "Marketing Cookies",
      description: "These cookies are used to track visitors across websites to display relevant and engaging advertisements.",
      examples: ["Ad targeting", "Social media integration", "Campaign tracking"],
      duration: "Up to 2 years",
      canDisable: true
    }
  ];

  const thirdPartyServices = [
    {
      name: "Google Analytics",
      purpose: "Website analytics and performance monitoring",
      cookies: ["_ga", "_gid", "_gat"],
      privacyPolicy: "https://policies.google.com/privacy"
    },
    {
      name: "Paystack",
      purpose: "Payment processing and security",
      cookies: ["paystack_session", "paystack_token"],
      privacyPolicy: "https://paystack.com/privacy"
    },
    {
      name: "Cloudflare",
      purpose: "Content delivery and security",
      cookies: ["__cfduid", "cf_clearance"],
      privacyPolicy: "https://www.cloudflare.com/privacy/"
    }
  ];

  const contactInfo = {
          email: "sakconstructiongh@gmail.com",
            phone: "0246798967",
          address: "Tema com 25, Greater Accra, around Devtraco Estates"
  };

  return (
    <>
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-background via-background to-accent/10">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground">
              Cookie
              <span className="block gradient-text"> Policy</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Learn how we use cookies and similar technologies to enhance your browsing experience and improve our services.
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Cookie className="w-4 h-4" />
              <span>Last updated: {new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-12">
            
            {/* Introduction */}
            <div className="admin-card">
              <h2 className="text-2xl font-bold text-foreground mb-4">What Are Cookies?</h2>
              <p className="text-muted-foreground leading-relaxed">
                Cookies are small text files that are placed on your device when you visit our website. They help us 
                provide you with a better experience by remembering your preferences, analyzing how you use our site, 
                and personalizing content. Cookies cannot access, read, or modify any other data on your device.
              </p>
            </div>

            {/* Cookie Types */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-foreground text-center mb-8">Types of Cookies We Use</h2>
              {cookieTypes.map((cookieType, index) => (
                <div key={index} className="admin-card">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Cookie className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-xl font-semibold text-foreground">{cookieType.category}</h3>
                        {!cookieType.canDisable && (
                          <span className="px-2 py-1 bg-warning/20 text-warning text-xs rounded-full">
                            Required
                          </span>
                        )}
                      </div>
                      <p className="text-muted-foreground mb-4 leading-relaxed">{cookieType.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground mb-1">Examples:</p>
                          <ul className="space-y-1">
                            {cookieType.examples.map((example, exampleIndex) => (
                              <li key={exampleIndex} className="flex items-center gap-2">
                                <CheckCircle className="w-3 h-3 text-success" />
                                {example}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="text-muted-foreground mb-1">Duration:</p>
                          <p className="text-foreground">{cookieType.duration}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground mb-1">Can Disable:</p>
                          <p className="text-foreground">{cookieType.canDisable ? 'Yes' : 'No'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Third-Party Cookies */}
            <div className="admin-card">
              <h2 className="text-2xl font-bold text-foreground mb-6">Third-Party Cookies</h2>
              <p className="text-muted-foreground mb-6">
                Some cookies on our website are set by third-party services that help us provide better functionality 
                and analyze our website performance. These services have their own privacy policies.
              </p>
              <div className="space-y-4">
                {thirdPartyServices.map((service, index) => (
                  <div key={index} className="border border-border/30 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-foreground mb-2">{service.name}</h3>
                        <p className="text-muted-foreground text-sm mb-2">{service.purpose}</p>
                        <p className="text-muted-foreground text-xs">
                          <span className="font-medium">Cookies:</span> {service.cookies.join(', ')}
                        </p>
                      </div>
                      <a
                        href={service.privacyPolicy}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary/80 text-sm font-medium"
                      >
                        Privacy Policy →
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cookie Management */}
            <div className="admin-card">
              <h2 className="text-2xl font-bold text-foreground mb-6">Managing Your Cookie Preferences</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Settings className="w-5 h-5 text-primary" />
                    Browser Settings
                  </h3>
                  <p className="text-muted-foreground text-sm mb-3">
                    You can control cookies through your browser settings. Most browsers allow you to:
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• View and delete existing cookies</li>
                    <li>• Block cookies from specific websites</li>
                    <li>• Block all third-party cookies</li>
                    <li>• Clear cookies when you close your browser</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-primary" />
                    Our Cookie Banner
                  </h3>
                  <p className="text-muted-foreground text-sm mb-3">
                    When you first visit our website, you'll see a cookie banner that allows you to:
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Accept all cookies</li>
                    <li>• Accept only essential cookies</li>
                    <li>• Customize your preferences</li>
                    <li>• Learn more about our cookie policy</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Impact of Disabling Cookies */}
            <div className="admin-card">
              <h2 className="text-2xl font-bold text-foreground mb-4">Impact of Disabling Cookies</h2>
              <div className="bg-muted/30 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-warning" />
                      What Happens If You Disable Cookies
                    </h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Some website features may not work properly</li>
                      <li>• You may need to re-enter information</li>
                      <li>• Personalized content may not be available</li>
                      <li>• Website performance may be affected</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                      <Info className="w-4 h-4 text-primary" />
                      Essential vs. Optional
                    </h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Essential cookies cannot be disabled</li>
                      <li>• Analytics cookies are optional</li>
                      <li>• Marketing cookies require consent</li>
                      <li>• Preference cookies enhance experience</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Updates and Changes */}
            <div className="admin-card">
              <h2 className="text-2xl font-bold text-foreground mb-4">Updates to This Policy</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update this Cookie Policy from time to time to reflect changes in our practices or for other 
                operational, legal, or regulatory reasons. We will notify you of any material changes by posting the 
                updated policy on our website and updating the "Last updated" date.
              </p>
            </div>

            {/* Contact Information */}
            <div className="admin-card">
              <h2 className="text-2xl font-bold text-foreground mb-6">Questions About Cookies?</h2>
              <p className="text-muted-foreground mb-6">
                If you have any questions about our use of cookies or this Cookie Policy, please contact us:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <Mail className="w-8 h-8 text-primary mx-auto mb-2" />
                  <p className="font-medium text-foreground">Email</p>
                  <a href={`mailto:${contactInfo.email}`} className="text-primary hover:text-primary/80 text-sm">
                    {contactInfo.email}
                  </a>
                </div>
                <div className="text-center">
                  <Phone className="w-8 h-8 text-primary mx-auto mb-2" />
                  <p className="font-medium text-foreground">Phone</p>
                  <a href={`tel:${contactInfo.phone}`} className="text-primary hover:text-primary/80 text-sm">
                    {contactInfo.phone}
                  </a>
                </div>
                <div className="text-center">
                  <Building2 className="w-8 h-8 text-primary mx-auto mb-2" />
                  <p className="font-medium text-foreground">Address</p>
                  <p className="text-muted-foreground text-sm">{contactInfo.address}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Control Your Cookie Preferences
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We believe in transparency and giving you control over your data. Use our cookie banner to customize 
              your experience or contact us with any questions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="btn-primary text-lg px-8 py-4 inline-flex items-center gap-2"
              >
                Contact Us
                <ArrowRight className="w-5 h-5" />
              </a>
              <a
                href="/privacy"
                className="btn-outline-modern text-lg px-8 py-4"
              >
                Privacy Policy
              </a>
            </div>
          </div>
        </div>
      </section>


    </>
  );
};

export default Cookies;
