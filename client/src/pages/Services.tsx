import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, 
  Palette, 
  Ruler, 
  FileText, 
  Phone, 
  Mail, 
  ArrowRight,
  CheckCircle,
  Users,
  Clock,
  Award,
  Home,
  Eye,
  Settings,
  Briefcase,
  Target,
  Heart,
  Shield,
  Truck
} from 'lucide-react';

const Services = () => {
  const services = [
    {
      icon: Briefcase,
      title: 'Project Management',
      description: 'Our project management experts offer a flexible and highly bespoke service based on a robust and well proven formula for delivery. Our team of Project Managers are highly trained in project management softwares for drawing up project plans and sophisticated schedules for complex projects.',
      pricing: 'Cost based on project level and complexity - clients assured of good deals',
      features: [
        'Flexible and bespoke service delivery',
        'Project planning and sophisticated scheduling',
        'Complex project management',
        'Robust delivery formulas',
        'Professional project management software expertise'
      ]
    },
    {
      icon: Building2,
      title: 'Architectural Designs',
      description: 'Our teams of Architects endeavor to create sustainable modern green buildings that are functional, structurally sound, aesthetically pleasing and also within the cost and budget of the client.',
      pricing: 'GHS 70 per square meter for residential projects - cost varies by project complexity',
      features: [
        'Sustainable modern green buildings',
        'Functional and structurally sound designs',
        'Aesthetically pleasing architecture',
        'Budget-conscious planning',
        'Client-focused design approach'
      ]
    },
    {
      icon: Ruler,
      title: 'Structural Designs',
      description: 'Our team of Structural Engineers work along with Architects, and other professionals such as Geotechnical engineers and use their findings to design the most suitable and robust structures for your building.',
      pricing: 'GHS 70 per square meter for residential projects - cost varies by project complexity',
      features: [
        'Collaboration with Architects and Geotechnical engineers',
        'Robust structural design',
        'Suitable building structures',
        'Professional engineering expertise',
        'Comprehensive structural analysis'
      ]
    },
    {
      icon: FileText,
      title: 'Cost Planning and Quantity Surveying',
      description: 'Our cost planning experts work along with the Architects and Engineers and other professionals to plan the Cost of a project and achieve a design within the clients\' budget. They also provide cost estimates, tender and contract documents.',
      pricing: 'Cost based on project level and complexity - clients assured of good deals',
      features: [
        'Project cost planning',
        'Budget-conscious design achievement',
        'Cost estimates and tender documents',
        'Contract documentation',
        'Professional quantity surveying'
      ]
    },
    {
      icon: Shield,
      title: 'Contract Administration',
      description: 'SAK Construction-gh unites a team of construction professionals which makes possible to administer any contract be it big or small. Our team prepares, monitors and administers the tendering and contract award process.',
      pricing: 'Cost based on project level and complexity - clients assured of good deals',
      features: [
        'Contract administration for all project sizes',
        'Tendering process management',
        'Contract award monitoring',
        'Professional construction team',
        'Start-to-finish contract oversight'
      ]
    },
    {
      icon: Eye,
      title: 'Construction Supervision',
      description: 'We use our expertise and knowledge of the entire construction cycle to develop sound strategies which are then translated into fully achievable programs and plans to monitor and supervise contractors/construction teams.',
      pricing: 'Cost based on project level and complexity - clients assured of good deals',
      features: [
        'Entire construction cycle expertise',
        'Sound strategy development',
        'Achievable program planning',
        'Contractor supervision',
        'Construction team monitoring'
      ]
    },
    {
      icon: Target,
      title: 'Strategic Sourcing and Procurement',
      description: 'SAK Construction-gh also has a team of procurement experts that help in the global sourcing of products for the use of construction and non-construction related purposes.',
      pricing: 'Cost based on project level and complexity - clients assured of good deals',
      features: [
        'Global product sourcing',
        'Construction material procurement',
        'Non-construction product sourcing',
        'Procurement expertise',
        'Strategic sourcing solutions'
      ]
    },
    {
      icon: Heart,
      title: 'Cost Management',
      description: 'SAK Construction-gh offers contract service team which provides project cost management, contractual assurance to our clients through intelligent procurement, contract management and dispute resolution.',
      pricing: 'Cost based on project level and complexity - clients assured of good deals',
      features: [
        'Project cost management',
        'Contractual assurance',
        'Intelligent procurement',
        'Contract management',
        'Dispute resolution'
      ]
    },
    {
      icon: Truck,
      title: 'General Construction and Roads',
      description: 'SAK Construction-gh acquired K3 D3 contractor\'s license from Ministry of Works & Housing. We plan, design and deliver projects within constraints of time, cost and specifications. Quality is our hallmark.',
      pricing: 'Cost based on project level and complexity - clients assured of good deals',
      features: [
        'K3 D3 contractor\'s license',
        'One-stop service provider',
        'Time, cost and specification management',
        'Quality-focused delivery',
        'Plant and machinery equipped'
      ]
    },
    {
      icon: Award,
      title: 'Refurbishments',
      description: 'Our design and Construction team work hand in hand with the clients to plan, design and execute demolishing and refurbishment project. We pride in our ability to deliver very beautiful finishes for very complex projects.',
      pricing: 'Cost based on project level and complexity - clients assured of good deals',
      features: [
        'Demolition and refurbishment planning',
        'Design and execution services',
        'Beautiful finish delivery',
        'Complex project handling',
        'Client collaboration approach'
      ]
    },
    {
      icon: Settings,
      title: 'Construction Quality Control and Quality Assurance',
      description: 'Our team undertakes Construction Quality control and Quality assurance on new and ongoing projects to achieve quality works and completion that match international standards.',
      pricing: 'Cost based on project level and complexity - clients assured of good deals',
      features: [
        'Quality control on new projects',
        'Quality assurance on ongoing projects',
        'International standards compliance',
        'Quality works achievement',
        'Project completion quality assurance'
      ]
    }
  ];

  const process = [
    {
      step: '01',
      title: 'Initial Consultation',
      description: 'We discuss your vision, requirements, and budget to understand your project needs.'
    },
    {
      step: '02',
      title: 'Site Analysis',
      description: 'Our team visits your plot to assess conditions, constraints, and opportunities.'
    },
    {
      step: '03',
      title: 'Design Development',
      description: 'We create detailed designs and plans based on your requirements and site conditions.'
    },
    {
      step: '04',
      title: 'Construction Planning',
      description: 'Comprehensive planning including timelines, budgets, and resource allocation.'
    },
    {
      step: '05',
      title: 'Construction & Supervision',
      description: 'Professional construction with continuous supervision and quality control.'
    },
    {
      step: '06',
      title: 'Project Completion',
      description: 'Final inspection, handover, and post-construction support.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-primary/10 to-orange-500/10">
        <div className="container px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="secondary" className="mb-4">
              Our Services
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Smart Modular Plans and 
              <span className="text-primary"> Comprehensive Services</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed mb-8">
              From project management to construction completion, we provide comprehensive 
              construction services with transparent pricing and quality assurance to bring your vision to life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to="/contact">Get Started</Link>
              </Button>
              <Button variant="outline" size="lg">
                View Portfolio
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20">
        <div className="container px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Our Comprehensive Services
            </h2>
            <p className="text-lg text-muted-foreground">
              From project management to construction completion, we provide 11 comprehensive services 
              with transparent pricing and quality assurance
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-center w-16 h-16 bg-primary/10 rounded-xl mb-4 mx-auto">
                    <service.icon className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl text-center">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base mb-4 leading-relaxed">
                    {service.description}
                  </CardDescription>
                  <div className="bg-primary/5 rounded-lg p-3 mb-4">
                    <p className="text-sm font-semibold text-primary">
                      {service.pricing}
                    </p>
                  </div>
                  <ul className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-muted/30">
        <div className="container px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Our Process
            </h2>
            <p className="text-lg text-muted-foreground">
              A systematic approach to ensure your project is completed successfully
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {process.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-muted-foreground">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Card className="border-0 shadow-2xl bg-gradient-to-r from-primary/10 to-orange-500/10">
              <CardContent className="p-12">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Ready to Start Your Project?
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Contact us today for a free consultation and let's discuss how we can help bring your vision to life.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" asChild>
                    <Link to="/contact">Get Free Consultation</Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <Link to="/plans">View Plans</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
