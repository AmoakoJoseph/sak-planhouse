import { 
  Search, 
  CreditCard, 
  Download, 
  Building2, 
  CheckCircle, 
  ArrowRight,
  FileText,
  Users,
  Shield,
  Award,
  Star,
  Heart
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const HowItWorks = () => {
  const steps = [
    {
      icon: Search,
      title: "Browse & Choose",
      description: "Explore our extensive collection of professional house plans. Filter by style, size, budget, and more.",
      features: ["50+ House Plans", "Multiple Styles", "Detailed Descriptions", "3D Renderings"]
    },
    {
      icon: CreditCard,
      title: "Purchase & Pay",
      description: "Select your preferred package and complete secure payment through our trusted payment gateway.",
      features: ["Secure Payments", "Multiple Packages", "Instant Access", "24/7 Support"]
    },
    {
      icon: Download,
      title: "Download & Build",
      description: "Get immediate access to your chosen plans. Download high-quality PDFs and start building your dream home.",
      features: ["Instant Download", "High-Quality Files", "Construction Ready", "Lifetime Access"]
    }
  ];

  const benefits = [
    {
      icon: Building2,
      title: "Professional Quality",
      description: "All plans are designed by certified architects and engineers"
    },
    {
      icon: Shield,
      title: "Secure & Reliable",
      description: "Your data and payments are protected with industry-standard security"
    },
    {
      icon: Award,
      title: "Cost Effective",
      description: "Save thousands on architectural fees while getting professional designs"
    },
    {
      icon: Users,
      title: "Expert Support",
      description: "Get help from our team of construction professionals"
    }
  ];

  const testimonials = [
    {
      name: "Kwame Asante",
      role: "Property Developer",
      content: "SAK Constructions provided excellent house plans that saved us time and money. Highly recommended!",
      rating: 5
    },
    {
      name: "Ama Osei",
      role: "Homeowner",
      content: "The villa plan I purchased was perfect for my family. The quality exceeded my expectations.",
      rating: 5
    },
    {
      name: "Kofi Mensah",
      role: "Contractor",
      content: "Professional plans that make construction smooth and efficient. Great platform for contractors.",
      rating: 5
    }
  ];

  return (
    <>
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-background via-background to-accent/10">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground">
              How It
              <span className="block gradient-text"> Works</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get your dream home plans in just three simple steps. Our platform makes it easy to find, purchase, and download professional architectural designs.
            </p>
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Simple 3-Step Process
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                From browsing to building, we've streamlined the entire process for you
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div key={index} className="relative">
                    {/* Step Number */}
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                      {index + 1}
                    </div>

                    {/* Step Card */}
                    <div className="admin-card pt-12 text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <Icon className="w-8 h-8 text-primary" />
                      </div>
                      
                      <h3 className="text-2xl font-bold text-foreground mb-4">{step.title}</h3>
                      <p className="text-muted-foreground mb-6 leading-relaxed">{step.description}</p>
                      
                      <ul className="space-y-2 text-left">
                        {step.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <CheckCircle className="w-4 h-4 text-success" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Connector Arrow */}
                    {index < steps.length - 1 && (
                      <div className="hidden md:block absolute top-1/2 -right-6 transform -translate-y-1/2">
                        <ArrowRight className="w-8 h-8 text-primary" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-br from-muted/30 to-muted/10">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Why Choose SAK Constructions?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                We provide the best value and quality in architectural plans
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <div key={index} className="metric-card text-center group">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-gradient-to-br group-hover:from-primary/20 group-hover:to-secondary/20 transition-all duration-300">
                      <Icon className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">{benefit.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{benefit.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                What Our Customers Say
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Join thousands of satisfied customers who have built their dream homes with our plans
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="admin-card">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-warning fill-current" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-6 leading-relaxed">"{testimonial.content}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Ready to Start Building?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Browse our collection of professional house plans and find the perfect design for your dream home.
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
                Get in Touch
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default HowItWorks;
