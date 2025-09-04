import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Users, Award, Building, Heart, Target, Shield, Briefcase, FileText, Eye, Settings, Ruler, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';

const About = () => {
  const services = [
    {
      icon: Briefcase,
      title: 'Project Management',
      description: 'Our project management experts offer flexible and highly bespoke services based on robust and well-proven delivery formulas.'
    },
    {
      icon: Building,
      title: 'Architectural Designs',
      description: 'Our teams of Architects create sustainable green buildings that are functional, structurally sound, and aesthetically pleasing.'
    },
    {
      icon: Ruler,
      title: 'Structural Designs',
      description: 'Our Structural Engineers work with Geotechnical engineers to design the most suitable and robust structures for your building.'
    },
    {
      icon: FileText,
      title: 'Cost Planning & Quantity Surveying',
      description: 'Our cost planning experts work with Architects and Engineers to achieve designs within clients\' budgets.'
    },
    {
      icon: Shield,
      title: 'Contract Administration',
      description: 'Our team of construction professionals administers contracts of any size, preparing and monitoring tendering processes.'
    },
    {
      icon: Eye,
      title: 'Construction Supervision',
      description: 'We develop sound strategies and achievable programs to monitor contractors for successful project delivery.'
    },
    {
      icon: Target,
      title: 'Strategic Sourcing & Procurement',
      description: 'Our procurement experts help in global sourcing of products for construction and non-construction purposes.'
    },
    {
      icon: Heart,
      title: 'Cost Management',
      description: 'We provide contractual assurance through intelligent procurement, contract management and dispute resolution.'
    },
    {
      icon: Truck,
      title: 'Construction of Buildings & Roads',
      description: 'We execute construction projects with K3 D3 contractor\'s license, delivering quality construction within time and budget.'
    },
    {
      icon: Award,
      title: 'Refurbishments',
      description: 'Our design and construction team works with clients to plan, design and execute demolition and refurbishment projects.'
    }
  ];

  const stats = [
    { icon: Building, value: '2012', label: 'Founded' },
    { icon: Award, value: 'K3 D3', label: 'Contractor License' },
    { icon: Users, value: '10+', label: 'Years Experience' },
    { icon: Shield, value: '100%', label: 'Quality Focus' }
  ];

  const values = [
    {
      icon: Heart,
      title: 'Accountability',
      description: 'We operate under the principle of accountability, ensuring transparency in all our dealings.'
    },
    {
      icon: Target,
      title: 'Professionalism',
      description: 'Our team of professionals maintains the highest standards of professional conduct.'
    },
    {
      icon: Building,
      title: 'Successful Delivery',
      description: 'We are committed to the successful delivery of projects within time, cost and specifications.'
    },
    {
      icon: Shield,
      title: 'Quality Management',
      description: 'Quality is our hallmark, spanning through managing and delivering construction phases diligently.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="container px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="secondary" className="mb-4">
              About SAK Constructions
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              About SAK CONSTRUCTIONS GH
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed mb-8">
              A multi-disciplinary design and project management firm with capacity to mobilize and execute construction projects on turnkey.
            </p>
          </div>
        </div>
      </section>

      {/* Company Introduction */}
      <section className="py-20">
        <div className="container px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Introducing SAK CONSTRUCTIONS
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              SAK was registered in Ghana in 2012 under the registration of business name act 1962 (No. 151). 
              The company was created under the principle of accountability, professionalism, and successful delivery of projects.
            </p>
          </div>
        </div>
      </section>

      {/* Background Section */}
      <section className="py-20 bg-muted/30">
        <div className="container px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                  Background
                </h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    SAK is a multi-disciplinary design and project management firm with the capacity to mobilize and execute 
                    construction projects on turnkey. SAK is made up of a team of Architects, Engineers, Quantity Surveyors, 
                    Project Managers, Data/IT experts and integrated development experts with tremendous years of collective 
                    individual experience in delivering complex sustainable green projects.
                  </p>
                  <p>
                    The team of Architects develops the conceptual designs based on functionality and client needs, the 
                    Geotechnical/soil engineers investigate and engineer the soil conditions for our Structural engineers 
                    to undertake the Structural design of the building.
                  </p>
                  <p>
                    Finally the team of Quantity Surveyors work alongside the other engineering disciplines through a thorough 
                    value engineering analysis and Information Technology base approach to scale down on the construction cost.
                  </p>
                </div>
              </div>
              <div className="relative">
                <div className="aspect-square bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center">
                  <Building className="w-32 h-32 text-primary/40" />
                </div>
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-br from-secondary/20 to-primary/20 rounded-2xl"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* History Section */}
      <section className="py-20">
        <div className="container px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="relative">
                <div className="aspect-square bg-gradient-to-br from-secondary/20 to-primary/20 rounded-2xl flex items-center justify-center">
                  <Truck className="w-32 h-32 text-secondary/40" />
                </div>
                <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl"></div>
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                  History
                </h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    The traditional way of delivering projects comes with diverse challenges which mostly results in improper 
                    and poor quality of work done, unplanned development, collapse of buildings, poor functionality, and poor 
                    value for money, unwarranted stress and high cost of building in the short and long term.
                  </p>
                  <p>
                    After years of individual experiences the founder with diverse and multifunctional backgrounds saw the need 
                    to adopt a more efficient and professional approach to project delivery by bringing all the construction 
                    professionals under one umbrella to form a one-stop shop for all constructional needs.
                  </p>
                  <p>
                    SAK is a design and Build Company equipped to deliver any construction project be it small or big within 
                    budget, time, quality and required scope.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-20 bg-muted/30">
        <div className="container px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                  Our Mission
                </h2>
                <ul className="space-y-4">
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-lg text-muted-foreground">
                      To achieve the highest possible standards in Architecture and construction
                    </span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-lg text-muted-foreground">
                      To deliver high quality projects at affordable costs
                    </span>
                  </li>
                </ul>
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                  Our Vision
                </h2>
                <ul className="space-y-4">
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-lg text-muted-foreground">
                      To be the clients choice for providing a one-stop shop delivery of projects
                    </span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-lg text-muted-foreground">
                      To be a trade mark in national development
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="container px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Our Credentials
            </h2>
            <p className="text-lg text-muted-foreground">
              Professional qualifications and achievements
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center border-0 shadow-lg bg-gradient-to-br from-primary/5 to-secondary/5">
                <CardContent className="p-6">
                  <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-xl mb-4 mx-auto">
                    <stat.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-3xl font-bold text-foreground mb-2">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-muted/30">
        <div className="container px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Our Core Principles
            </h2>
            <p className="text-lg text-muted-foreground">
              The principles that guide everything we do
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-center w-16 h-16 bg-primary/10 rounded-xl mb-4 mx-auto">
                    <value.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">{value.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20">
        <div className="container px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Our Services
            </h2>
            <p className="text-lg text-muted-foreground">
              Comprehensive construction and project management services
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <service.icon className="text-primary" size={24} />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {service.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Management Section */}
      <section className="py-20 bg-muted/30">
        <div className="container px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Management & Structure
            </h2>
            <p className="text-lg text-muted-foreground">
              Professional team structure and management approach
            </p>
          </div>
          
          <div className="text-center">
            <p className="text-lg text-muted-foreground mb-8">
              SAK unites a consortium of professionals with global network of inventive and highly skilled engineers 
              and design specialists. SAK offers consultancy and construction services team which provides contractual 
              assurance to our clients through design, intelligent procurement, contract management, construction, 
              and best quality management throughout the project life cycle.
            </p>
            <p className="text-lg text-muted-foreground">
              We offer a comprehensive, independent contractual and commercial service designed to guide any major 
              program or complex project successfully through the complexities and challenges of modern construction 
              and engineering procurement, from inception to completion.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Card className="border-0 shadow-2xl bg-gradient-to-r from-primary/10 to-secondary/10">
              <CardContent className="p-12">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Ready to Start Your Project?
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  At SAK, we safeguard your commercial interests at every stage of the project right from conception, 
                  feasibility, design, and procurement and construction process to deliver a return on your investment.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" asChild>
                    <Link to="/services">View Our Services</Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <Link to="/contact">Contact Us</Link>
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

export default About; 