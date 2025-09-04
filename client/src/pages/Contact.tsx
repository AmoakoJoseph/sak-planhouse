import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  MessageCircle, 
  Send,
  CheckCircle 
} from 'lucide-react';
import { useState, useRef } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    planType: '',
    message: ''
  });

  const submitButtonRef = useRef<HTMLButtonElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Show loading state
      const submitButton = submitButtonRef.current;
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.innerHTML = '<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>Sending...';
      }
      
      // Prepare email data
      const emailData = {
        to: 'sakconstructiongh@gmail.com',
        subject: formData.subject || 'Inquiry from SAK Constructions Website',
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        planType: formData.planType,
        message: formData.message
      };
      
      // Send email through backend API
      const response = await fetch('/api/contact/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData),
      });
      
      if (response.ok) {
        // Success - reset form and show success message
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          planType: '',
          message: ''
        });
        
        alert('Thank you! Your message has been sent successfully. We will get back to you within 24 hours.');
      } else {
        throw new Error('Failed to send email');
      }
      
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Sorry, there was an error sending your message. Please try again or contact us directly at sakconstructiongh@gmail.com');
    } finally {
      // Reset button state
      const submitButton = submitButtonRef.current;
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.innerHTML = '<Send className="h-5 w-5 mr-2" />Send Message';
      }
    }
  };

  const contactInfo = [
    {
      icon: Phone,
      title: 'Phone',
      details: ['0246798967', '0233798967'],
      description: 'Mon-Fri 8AM-6PM GMT'
    },
    {
      icon: Mail,
      title: 'Email',
      details: ['sakconstructiongh@gmail.com'],
      description: 'We reply within 24 hours'
    },
    {
      icon: MapPin,
      title: 'Address',
      details: ['Tema com 25, Greater Accra', 'around Devtraco Estates'],
      description: 'Ghana'
    },
    {
      icon: Clock,
      title: 'Business Hours',
      details: ['Monday - Friday: 8AM - 6PM', 'Saturday: 9AM - 4PM'],
      description: 'Sunday: Closed'
    }
  ];

  const faqs = [
    {
      question: 'How quickly will I receive my plans after purchase?',
      answer: 'All plans are delivered instantly via email after successful payment. You will receive download links for all included files.'
    },
    {
      question: 'Can I modify the plans to suit my needs?',
      answer: 'Yes! Our Standard and Premium packages include modification rights. We also offer custom modification services for an additional fee.'
    },
    {
      question: 'Do your plans comply with local building codes?',
      answer: 'All our plans are designed by licensed architects and comply with Ghana Building Code. However, we recommend consulting with local authorities for specific requirements.'
    },
    {
      question: 'What file formats do you provide?',
      answer: 'We provide plans in PDF format for all packages. Standard and Premium packages also include AutoCAD (DWG) files for professional use.'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="container px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <Badge variant="secondary" className="mb-4">
              Contact Us
            </Badge>
            <h1 className="text-3xl md:text-5xl font-bold text-foreground">
              Let's Build Something
                              <span className="bg-gradient-to-r from-primary to-primary bg-clip-text text-transparent"> Amazing Together</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Have questions about our plans? Need custom designs? Our team of experts is 
              here to help you create your dream home.
            </p>
          </div>
        </div>
      </section>

      <div className="container px-4 py-16">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="border-0 bg-gradient-card shadow-card">
              <CardHeader>
                <CardTitle className="text-2xl">Send us a Message</CardTitle>
                <CardDescription>
                  Fill out the form below and click "Send Message" to send your inquiry directly to our team. Your message will be sent automatically to sakconstructiongh@gmail.com.
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        placeholder="0246798967"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="planType">Plan Type of Interest</Label>
                      <Select value={formData.planType} onValueChange={(value) => setFormData({...formData, planType: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select plan type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="villa">Villa</SelectItem>
                          <SelectItem value="bungalow">Bungalow</SelectItem>
                          <SelectItem value="townhouse">Townhouse</SelectItem>
                          <SelectItem value="custom">Custom Design</SelectItem>
                          <SelectItem value="consultation">Consultation</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject *</Label>
                    <Input
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                      placeholder="What's this message about?"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      placeholder="Tell us about your project, requirements, or any questions you have..."
                      className="min-h-32"
                      required
                    />
                  </div>

                  <Button type="submit" variant="cta" size="lg" className="w-full" ref={submitButtonRef}>
                    <Send className="h-5 w-5 mr-2" />
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* FAQ Section */}
            <Card className="mt-8 border-0 bg-gradient-card">
              <CardHeader>
                <CardTitle className="text-xl">Frequently Asked Questions</CardTitle>
                <CardDescription>
                  Quick answers to common questions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {faqs.map((faq, index) => (
                  <div key={index} className="space-y-3">
                    <h4 className="font-semibold text-foreground">{faq.question}</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">{faq.answer}</p>
                    {index < faqs.length - 1 && <div className="border-b border-border/50" />}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            {/* Contact Cards */}
            <div className="space-y-4">
              {contactInfo.map((info, index) => (
                <Card key={index} className="border-0 bg-gradient-card hover:shadow-construction transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-construction-orange-light rounded-xl flex items-center justify-center flex-shrink-0">
                        <info.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="font-semibold text-foreground">{info.title}</h3>
                        {info.details.map((detail, idx) => (
                          <p key={idx} className="text-sm text-muted-foreground">{detail}</p>
                        ))}
                        <p className="text-xs text-muted-foreground">{info.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Response Promise */}
            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Quick Response Guarantee</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  We respond to all inquiries within 24 hours during business days. 
                  Urgent matters are handled within 4 hours.
                </p>
                <div className="flex items-center justify-center gap-2 text-sm text-primary">
                  <CheckCircle className="h-4 w-4" />
                  <span>Professional Support</span>
                </div>
              </CardContent>
            </Card>

            {/* Office Hours */}
            <Card className="border-0 bg-gradient-card">
              <CardHeader>
                <CardTitle className="text-lg">Visit Our Office</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground">SAK Constructions GH</p>
                  <p className="text-sm text-muted-foreground">
                    Tema com 25, Greater Accra<br />
                    around Devtraco Estates<br />
                    Ghana
                  </p>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground">Office Hours:</p>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>Monday - Friday: 8:00 AM - 6:00 PM</p>
                    <p>Saturday: 9:00 AM - 4:00 PM</p>
                    <p>Sunday: Closed</p>
                  </div>
                </div>

                <Button variant="outline" size="sm" className="w-full">
                  <MapPin className="h-4 w-4 mr-2" />
                  Get Directions
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <section className="py-16 bg-construction-gray-light">
        <div className="container px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Find Us</h2>
            <p className="text-muted-foreground">
              Visit our office in the heart of Accra for personalized consultation
            </p>
          </div>
          
          {/* Placeholder for map */}
          <Card className="border-0 bg-gradient-card h-96">
            <CardContent className="p-6 h-full flex items-center justify-center">
              <div className="text-center space-y-4">
                <MapPin className="h-16 w-16 text-primary mx-auto" />
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Interactive Map</h3>
                  <p className="text-muted-foreground">
                    Tema com 25, Greater Accra, around Devtraco Estates
                  </p>
                  <Button variant="outline" className="mt-4">
                    Open in Google Maps
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Contact;