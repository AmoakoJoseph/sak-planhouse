import { 
  Shield, 
  Eye, 
  Lock, 
  Users, 
  Database, 
  Globe,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  Mail,
  Phone,
  Building2
} from 'lucide-react';
import Header from '@/components/Header';


const Privacy = () => {
  const sections = [
    {
      title: "Information We Collect",
      content: "We collect information you provide directly to us, such as when you create an account, make a purchase, or contact our support team. This includes your name, email address, phone number, and payment information.",
      icon: Database
    },
    {
      title: "How We Use Your Information",
      content: "We use the information we collect to provide, maintain, and improve our services, process transactions, send you technical notices and support messages, and respond to your comments and questions.",
      icon: Users
    },
    {
      title: "Information Sharing",
      content: "We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy or as required by law.",
      icon: Lock
    },
    {
      title: "Data Security",
      content: "We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. Your data is encrypted during transmission and storage.",
      icon: Shield
    },
    {
      title: "Your Rights",
      content: "You have the right to access, update, or delete your personal information. You can also opt out of certain communications and request information about how your data is used.",
      icon: Eye
    },
    {
      title: "International Transfers",
      content: "Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your data in accordance with this policy.",
      icon: Globe
    }
  ];

  const dataTypes = [
    {
      category: "Personal Information",
      examples: ["Name", "Email address", "Phone number", "Billing address"],
      purpose: "Account creation, communication, billing"
    },
    {
      category: "Payment Information",
      examples: ["Credit card details", "Payment history", "Transaction records"],
      purpose: "Processing payments, order fulfillment"
    },
    {
      category: "Usage Data",
      examples: ["Website activity", "Download history", "Search queries"],
      purpose: "Service improvement, user experience"
    },
    {
      category: "Technical Data",
      examples: ["IP address", "Browser type", "Device information"],
      purpose: "Security, analytics, troubleshooting"
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
              Privacy
              <span className="block gradient-text"> Policy</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We are committed to protecting your privacy and ensuring the security of your personal information. Learn how we collect, use, and protect your data.
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Shield className="w-4 h-4" />
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
              <h2 className="text-2xl font-bold text-foreground mb-4">Introduction</h2>
              <p className="text-muted-foreground leading-relaxed">
                At SAK Constructions, we respect your privacy and are committed to protecting your personal information. 
                This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use 
                our website and services.
              </p>
            </div>

            {/* Key Sections */}
            <div className="space-y-6">
              {sections.map((section, index) => {
                const Icon = section.icon;
                return (
                  <div key={index} className="admin-card">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-foreground mb-3">
                          {section.title}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">
                          {section.content}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Data Collection Details */}
            <div className="admin-card">
              <h2 className="text-2xl font-bold text-foreground mb-6">Data Collection Details</h2>
              <div className="space-y-6">
                {dataTypes.map((dataType, index) => (
                  <div key={index} className="border border-border/30 rounded-lg p-4">
                    <h3 className="font-semibold text-foreground mb-2">{dataType.category}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground mb-1">Examples:</p>
                        <ul className="space-y-1">
                          {dataType.examples.map((example, exampleIndex) => (
                            <li key={exampleIndex} className="flex items-center gap-2">
                              <CheckCircle className="w-3 h-3 text-success" />
                              {example}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1">Purpose:</p>
                        <p className="text-foreground">{dataType.purpose}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cookies and Tracking */}
            <div className="admin-card">
              <h2 className="text-2xl font-bold text-foreground mb-4">Cookies and Tracking</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We use cookies and similar tracking technologies to enhance your experience on our website. 
                These technologies help us remember your preferences, analyze site traffic, and personalize content.
              </p>
              <div className="bg-muted/30 rounded-lg p-4">
                <h3 className="font-semibold text-foreground mb-2">Types of Cookies We Use:</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Essential cookies for website functionality</li>
                  <li>• Analytics cookies to understand site usage</li>
                  <li>• Preference cookies to remember your settings</li>
                  <li>• Security cookies to protect against fraud</li>
                </ul>
              </div>
            </div>

            {/* Data Retention */}
            <div className="admin-card">
              <h2 className="text-2xl font-bold text-foreground mb-4">Data Retention</h2>
              <p className="text-muted-foreground leading-relaxed">
                We retain your personal information only for as long as necessary to fulfill the purposes outlined 
                in this policy, unless a longer retention period is required or permitted by law. Account data is 
                retained while your account is active and for a reasonable period afterward.
              </p>
            </div>

            {/* Third-Party Services */}
            <div className="admin-card">
              <h2 className="text-2xl font-bold text-foreground mb-4">Third-Party Services</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We may use third-party service providers to help us operate our business and provide services to you. 
                These providers have access to your personal information only to perform specific tasks on our behalf 
                and are obligated not to disclose or use it for any other purpose.
              </p>
              <div className="bg-muted/30 rounded-lg p-4">
                <h3 className="font-semibold text-foreground mb-2">Our Third-Party Partners:</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Payment processors for secure transactions</li>
                  <li>• Cloud hosting providers for data storage</li>
                  <li>• Analytics services for website improvement</li>
                  <li>• Customer support tools for better service</li>
                </ul>
              </div>
            </div>

            {/* Children's Privacy */}
            <div className="admin-card">
              <h2 className="text-2xl font-bold text-foreground mb-4">Children's Privacy</h2>
              <p className="text-muted-foreground leading-relaxed">
                Our services are not intended for children under the age of 18. We do not knowingly collect personal 
                information from children under 18. If you are a parent or guardian and believe your child has provided 
                us with personal information, please contact us immediately.
              </p>
            </div>

            {/* Changes to Privacy Policy */}
            <div className="admin-card">
              <h2 className="text-2xl font-bold text-foreground mb-4">Changes to This Policy</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting 
                the new Privacy Policy on this page and updating the "Last updated" date. We encourage you to review 
                this Privacy Policy periodically for any changes.
              </p>
            </div>

            {/* Contact Information */}
            <div className="admin-card">
              <h2 className="text-2xl font-bold text-foreground mb-6">Contact Us</h2>
              <p className="text-muted-foreground mb-6">
                If you have any questions about this Privacy Policy or our data practices, please contact us:
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
              Your Privacy Matters to Us
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We're committed to transparency and protecting your data. If you have any concerns about your privacy, 
              don't hesitate to reach out to our team.
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
                href="/terms"
                className="btn-outline-modern text-lg px-8 py-4"
              >
                View Terms
              </a>
            </div>
          </div>
        </div>
      </section>


    </>
  );
};

export default Privacy;
