import { 
  FileText, 
  Shield, 
  Users, 
  CreditCard, 
  Download, 
  Building2,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  Mail
} from 'lucide-react';
import Header from '@/components/Header';

import { Button } from '@/components/ui/button';

const Terms = () => {
  const sections = [
    {
      title: "Acceptance of Terms",
      content: "By accessing and using SAK Constructions' website and services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.",
      icon: CheckCircle
    },
    {
      title: "Service Description",
      content: "SAK Constructions provides architectural house plans, design services, and related construction support. Our services include the sale and licensing of house plans, 3D renderings, and technical specifications for residential construction projects.",
      icon: Building2
    },
    {
      title: "User Accounts",
      content: "To access certain features of our service, you must create an account. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.",
      icon: Users
    },
    {
      title: "Payment Terms",
      content: "All purchases are final and non-refundable except as provided in our refund policy. Prices are subject to change without notice. Payment must be completed before access to purchased plans is granted.",
      icon: CreditCard
    },
    {
      title: "License and Usage",
      content: "Purchased plans are licensed for single-use construction projects. Plans may not be resold, redistributed, or used for multiple projects without additional licensing. Modifications are permitted for personal use only.",
      icon: Download
    },
    {
      title: "Intellectual Property",
      content: "All house plans, designs, and related materials are the exclusive property of SAK Constructions and are protected by copyright laws. Unauthorized use, reproduction, or distribution is strictly prohibited.",
      icon: Shield
    }
  ];

  const importantNotes = [
    "Plans are for residential use only and may require local building permits",
    "We are not responsible for construction costs or project outcomes",
    "Local building codes and regulations must be followed",
    "Professional consultation may be required for complex projects",
    "All measurements and specifications are approximate"
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
              Terms of
              <span className="block gradient-text"> Service</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Please read these terms carefully before using our services. By using our platform, you agree to be bound by these terms.
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <FileText className="w-4 h-4" />
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
                These Terms of Service ("Terms") govern your use of the SAK Constructions website and services. 
                By accessing or using our services, you agree to be bound by these Terms. If you disagree with any 
                part of these terms, then you may not access our services.
              </p>
            </div>

            {/* Key Sections */}
            <div className="space-y-6">
              {sections.map((section, index) => {
                const Icon = section.icon;
                return (
                  <div key={index} className="admin-card">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-orange-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
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

            {/* Important Notes */}
            <div className="admin-card">
              <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                <AlertTriangle className="w-6 h-6 text-warning" />
                Important Notes
              </h2>
              <div className="space-y-3">
                {importantNotes.map((note, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-warning rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-muted-foreground">{note}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Refund Policy */}
            <div className="admin-card">
              <h2 className="text-2xl font-bold text-foreground mb-4">Refund Policy</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We offer a 30-day money-back guarantee for all purchases. If you are not satisfied with your 
                purchase, contact us within 30 days of your purchase date for a full refund. Refunds will be 
                processed within 5-7 business days.
              </p>
              <div className="bg-muted/30 rounded-lg p-4">
                <h3 className="font-semibold text-foreground mb-2">Refund Conditions:</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Request must be made within 30 days of purchase</li>
                  <li>• Plans must not have been downloaded or used</li>
                  <li>• Valid reason for refund must be provided</li>
                  <li>• One refund per customer per plan</li>
                </ul>
              </div>
            </div>

            {/* Limitation of Liability */}
            <div className="admin-card">
              <h2 className="text-2xl font-bold text-foreground mb-4">Limitation of Liability</h2>
              <p className="text-muted-foreground leading-relaxed">
                SAK Constructions shall not be liable for any indirect, incidental, special, consequential, 
                or punitive damages, including without limitation, loss of profits, data, use, goodwill, or 
                other intangible losses, resulting from your use of our services.
              </p>
            </div>

            {/* Changes to Terms */}
            <div className="admin-card">
              <h2 className="text-2xl font-bold text-foreground mb-4">Changes to Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right to modify or replace these Terms at any time. If a revision is material, 
                we will try to provide at least 30 days notice prior to any new terms taking effect. What 
                constitutes a material change will be determined at our sole discretion.
              </p>
            </div>

            {/* Contact Information */}
            <div className="admin-card">
              <h2 className="text-2xl font-bold text-foreground mb-6">Contact Information</h2>
              <p className="text-muted-foreground mb-6">
                If you have any questions about these Terms of Service, please contact us:
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
                  <Building2 className="w-8 h-8 text-primary mx-auto mb-2" />
                  <p className="font-medium text-foreground">Phone</p>
                  <a href={`tel:${contactInfo.phone}`} className="text-primary hover:text-primary/80 text-sm">
                    {contactInfo.phone}
                  </a>
                </div>
                <div className="text-center">
                  <Shield className="w-8 h-8 text-primary mx-auto mb-2" />
                  <p className="font-medium text-foreground">Address</p>
                  <p className="text-muted-foreground text-sm">{contactInfo.address}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-orange-500/5">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Now that you understand our terms, explore our collection of professional house plans and start building your dream home.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/plans"
                className="btn-primary text-lg px-8 py-4 inline-flex items-center gap-2"
              >
                Browse Plans
                <ArrowRight className="w-5 h-5" />
              </a>
              <a
                href="/contact"
                className="btn-outline-modern text-lg px-8 py-4"
              >
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </section>


    </>
  );
};

export default Terms;
