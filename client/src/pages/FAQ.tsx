import { 
  HelpCircle, 
  ChevronDown, 
  Search, 
  FileText, 
  CreditCard, 
  Download, 
  Building2,
  Shield,
  Users,
  Phone,
  Mail,
  MessageCircle
} from 'lucide-react';
import { useState } from 'react';
import Header from '@/components/Header';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const FAQ = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());

  const faqData: FAQItem[] = [
    // General Questions
    {
      question: "What is SAK Constructions?",
      answer: "SAK Constructions is a leading platform that provides professional architectural house plans. We offer a wide range of designs including villas, bungalows, and townhouses, all created by certified architects and engineers.",
      category: "general"
    },
    {
      question: "How do I get started with your platform?",
      answer: "Getting started is easy! Simply browse our collection of house plans, choose your preferred design, select a package (Basic, Standard, or Premium), and complete your purchase. You'll get instant access to download your chosen plans.",
      category: "general"
    },
    {
      question: "Are your plans suitable for construction?",
      answer: "Yes! All our plans are construction-ready and include detailed architectural drawings, structural specifications, and material lists. They meet local building codes and standards.",
      category: "general"
    },

    // Plans & Design
    {
      question: "What types of house plans do you offer?",
      answer: "We offer a comprehensive range of house plans including modern villas, traditional bungalows, contemporary townhouses, and custom architectural designs. Each plan comes with multiple package options.",
      category: "plans"
    },
    {
      question: "Can I customize the plans I purchase?",
      answer: "Yes, our Premium package includes customization options. You can work with our team to modify layouts, adjust room sizes, or make other design changes to suit your specific needs.",
      category: "plans"
    },
    {
      question: "Do you provide 3D renderings?",
      answer: "Yes, our Standard and Premium packages include 3D renderings that give you a realistic view of how your house will look when completed.",
      category: "plans"
    },

    // Pricing & Packages
    {
      question: "What's the difference between Basic, Standard, and Premium packages?",
      answer: "Basic: Core architectural drawings. Standard: Includes 3D renderings and additional details. Premium: Full customization, detailed specifications, and ongoing support from our team.",
      category: "pricing"
    },
    {
      question: "Are there any hidden fees?",
      answer: "No hidden fees! The price you see is the price you pay. All packages include the complete set of plans and specifications as described.",
      category: "pricing"
    },
    {
      question: "Do you offer bulk discounts?",
      answer: "Yes, we offer special pricing for contractors and developers purchasing multiple plans. Contact our sales team for custom quotes.",
      category: "pricing"
    },

    // Technical Support
    {
      question: "What file formats do you provide?",
      answer: "We provide plans in PDF format for easy viewing and printing. Premium packages also include CAD files for architects and contractors who need to make modifications.",
      category: "technical"
    },
    {
      question: "How long do I have access to my purchased plans?",
      answer: "You have lifetime access to your purchased plans. You can download them anytime from your account dashboard.",
      category: "technical"
    },
    {
      question: "What if I have technical issues downloading my plans?",
      answer: "Our support team is available 24/7 to help with any technical issues. Contact us via email, phone, or live chat for immediate assistance.",
      category: "technical"
    },

    // Payment & Security
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, debit cards, and mobile money payments through our secure payment gateway. All transactions are encrypted and secure.",
      category: "payment"
    },
    {
      question: "Is my payment information secure?",
      answer: "Absolutely! We use industry-standard SSL encryption and secure payment processing. We never store your payment information on our servers.",
      category: "payment"
    },
    {
      question: "Do you offer refunds?",
      answer: "We offer a 30-day money-back guarantee. If you're not satisfied with your purchase, contact us within 30 days for a full refund.",
      category: "payment"
    },

    // Construction Support
    {
      question: "Do you provide construction support?",
      answer: "Yes, our Premium package includes construction support. Our team of experts can answer questions and provide guidance throughout your building process.",
      category: "construction"
    },
    {
      question: "Can you recommend contractors in my area?",
      answer: "We maintain a network of trusted contractors and can provide recommendations based on your location and project requirements.",
      category: "construction"
    },
    {
      question: "What if I need modifications during construction?",
      answer: "Our team can help with modifications and adjustments during construction. Premium package customers get priority support for these services.",
      category: "construction"
    }
  ];

  const categories = [
    { id: 'all', label: 'All Questions', icon: HelpCircle },
    { id: 'general', label: 'General', icon: Building2 },
    { id: 'plans', label: 'Plans & Design', icon: FileText },
    { id: 'pricing', label: 'Pricing & Packages', icon: CreditCard },
    { id: 'technical', label: 'Technical Support', icon: Download },
    { id: 'payment', label: 'Payment & Security', icon: Shield },
    { id: 'construction', label: 'Construction Support', icon: Users }
  ];

  const filteredFAQs = faqData.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleExpanded = (index: number) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedItems(newExpanded);
  };

  return (
    <>
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-background via-background to-accent/10">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground">
              Frequently Asked
              <span className="block gradient-text"> Questions</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Find answers to common questions about our house plans, pricing, and services. Can't find what you're looking for? Contact our support team.
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search for questions or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 py-4 text-lg border-2 border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-3 justify-center">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <Button
                    key={category.id}
                    variant={activeCategory === category.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveCategory(category.id)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300"
                  >
                    <Icon className="w-4 h-4" />
                    {category.label}
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gradient-to-br from-muted/30 to-muted/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-6">
            {filteredFAQs.length === 0 ? (
              <div className="text-center py-12">
                <HelpCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">No questions found</h3>
                <p className="text-muted-foreground">Try adjusting your search terms or category filter.</p>
              </div>
            ) : (
              filteredFAQs.map((faq, index) => (
                <div key={index} className="admin-card">
                  <button
                    onClick={() => toggleExpanded(index)}
                    className="w-full flex items-center justify-between text-left p-6 hover:bg-muted/50 transition-colors duration-300 rounded-xl"
                  >
                    <h3 className="text-lg font-semibold text-foreground pr-4">
                      {faq.question}
                    </h3>
                    <ChevronDown 
                      className={`w-5 h-5 text-muted-foreground transition-transform duration-300 ${
                        expandedItems.has(index) ? 'rotate-180' : ''
                      }`} 
                    />
                  </button>
                  
                  {expandedItems.has(index) && (
                    <div className="px-6 pb-6">
                      <div className="border-t border-border/30 pt-4">
                        <p className="text-muted-foreground leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Still Have Questions Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Still Have Questions?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our support team is here to help! Get in touch with us through any of these channels.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="metric-card text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-orange-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Call Us</h3>
                <p className="text-muted-foreground mb-4">Speak directly with our experts</p>
                <a href="tel:0246798967" className="text-primary hover:text-primary/80 font-medium">
                  0246798967
                </a>
              </div>

              <div className="metric-card text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-orange-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Email Us</h3>
                <p className="text-muted-foreground mb-4">Get detailed responses via email</p>
                <a href="mailto:sakconstructiongh@gmail.com" className="text-primary hover:text-primary/80 font-medium">
                  sakconstructiongh@gmail.com
                </a>
              </div>

              <div className="metric-card text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-orange-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Live Chat</h3>
                <p className="text-muted-foreground mb-4">Chat with us in real-time</p>
                <Button className="btn-primary">
                  Start Chat
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>


    </>
  );
};

export default FAQ;
