import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Award, 
  Building, 
  Globe, 
  CheckCircle,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Star
} from 'lucide-react';
import { Link } from 'react-router-dom';

const About = () => {
  const stats = [
    { icon: Building, number: '30+', label: 'House Plans' },
    { icon: Users, number: '2000+', label: 'Happy Customers' },
    { icon: Award, number: '10+', label: 'Years Experience' },
    { icon: Globe, number: '50+', label: 'Cities Served' },
  ];

  const team = [
    {
      name: 'Samuel Kwame',
      role: 'Founder & Lead Architect',
      description: 'Licensed architect with over 15 years of experience in residential design.',
      image: '/api/placeholder/150/150'
    },
    {
      name: 'Ama Osei',
      role: 'Senior Architect',
      description: 'Specializes in contemporary African architecture and sustainable design.',
      image: '/api/placeholder/150/150'
    },
    {
      name: 'Kwame Asante',
      role: 'Construction Manager',
      description: 'Expert in construction management and building code compliance.',
      image: '/api/placeholder/150/150'
    },
  ];

  const values = [
    {
      title: 'Quality First',
      description: 'Every plan is meticulously designed and reviewed by licensed professionals.',
      icon: Award
    },
    {
      title: 'African Heritage',
      description: 'We incorporate traditional African design elements with modern functionality.',
      icon: Globe
    },
    {
      title: 'Customer Focus',
      description: 'Your satisfaction is our priority. We provide ongoing support and guidance.',
      icon: Users
    },
    {
      title: 'Innovation',
      description: 'We embrace new technologies and sustainable building practices.',
      icon: Building
    },
  ];

  const milestones = [
    { year: '2014', event: 'SAK Constructions founded in Accra' },
    { year: '2016', event: 'First 100 house plans completed' },
    { year: '2018', event: 'Expanded to digital platform' },
    { year: '2020', event: 'Reached 1000+ customers milestone' },
    { year: '2022', event: 'Launched premium design services' },
    { year: '2024', event: 'Celebrated 10 years of excellence' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="container px-4">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <Badge variant="secondary" className="mb-4">
              About Us
            </Badge>
            <h1 className="text-3xl md:text-5xl font-bold text-foreground">
              Building Dreams with
              <span className="bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent"> Quality Designs</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              For over a decade, SAK Constructions GH has been Ghana's trusted partner in 
              creating beautiful, functional, and affordable architectural plans. We combine 
              traditional African aesthetics with modern building standards.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="cta" size="lg" asChild>
                <Link to="/contact">Get in Touch</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/plans">Browse Our Plans</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-background">
        <div className="container px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center border-0 bg-gradient-card hover:shadow-construction transition-all duration-300">
                <CardContent className="pt-6">
                  <div className="mx-auto w-16 h-16 bg-construction-orange-light rounded-2xl flex items-center justify-center mb-4">
                    <stat.icon className="h-8 w-8 text-primary" />
                  </div>
                  <div className="text-3xl font-bold text-primary mb-2">{stat.number}</div>
                  <p className="text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 bg-construction-gray-light">
        <div className="container px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Our Story
              </h2>
              <p className="text-lg text-muted-foreground">
                From humble beginnings to Ghana's leading construction plans platform
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-foreground">
                    Founded on Excellence
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    SAK Constructions GH was born from a vision to make quality architectural 
                    designs accessible to every Ghanaian family. Our founder, Samuel Kwame, 
                    started this journey with a simple belief: every family deserves a beautiful, 
                    well-designed home.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    What began as a small architectural firm in Accra has grown into Ghana's 
                    most trusted platform for construction plans, serving thousands of families 
                    across the country and beyond.
                  </p>
                </div>

                <div className="space-y-3">
                  {[
                    'Licensed architectural professionals',
                    'Compliance with local building codes',
                    'Sustainable and eco-friendly designs',
                    'Continuous innovation and improvement'
                  ].map((point, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      <span className="text-muted-foreground">{point}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Card className="border-0 bg-gradient-card">
                <CardContent className="p-6">
                  <h4 className="text-lg font-semibold mb-4">Our Journey</h4>
                  <div className="space-y-4">
                    {milestones.map((milestone, index) => (
                      <div key={index} className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <Calendar className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-semibold text-primary">{milestone.year}</div>
                          <div className="text-sm text-muted-foreground">{milestone.event}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-background">
        <div className="container px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Our Values
            </h2>
            <p className="text-lg text-muted-foreground">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center border-0 bg-gradient-card hover:shadow-construction transition-all duration-300 transform hover:-translate-y-2">
                <CardHeader>
                  <div className="mx-auto w-16 h-16 bg-construction-orange-light rounded-2xl flex items-center justify-center mb-4">
                    <value.icon className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground">
                    {value.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-construction-gray-light">
        <div className="container px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Meet Our Team
            </h2>
            <p className="text-lg text-muted-foreground">
              Experienced professionals dedicated to your success
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {team.map((member, index) => (
              <Card key={index} className="text-center border-0 bg-gradient-card hover:shadow-construction transition-all duration-300">
                <CardHeader>
                  <div className="mx-auto w-24 h-24 bg-muted rounded-full mb-4 flex items-center justify-center">
                    <Users className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <CardTitle className="text-xl">{member.name}</CardTitle>
                  <CardDescription className="text-primary font-medium">
                    {member.role}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">
                    {member.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 bg-construction-gray text-white">
        <div className="container px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">
              Ready to Start Building?
            </h2>
            <p className="text-white/80 text-lg">
              Join thousands of satisfied customers who have built their dream homes 
              with our professional plans.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="cta" size="lg" asChild>
                <Link to="/plans">Browse Plans</Link>
              </Button>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-construction-gray" asChild>
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>

            {/* Quick Contact Info */}
            <div className="grid md:grid-cols-3 gap-6 mt-12 pt-8 border-t border-white/20">
              <div className="flex items-center justify-center gap-3">
                <Phone className="h-5 w-5 text-primary" />
                <span className="text-white/80">+233 24 123 4567</span>
              </div>
              <div className="flex items-center justify-center gap-3">
                <Mail className="h-5 w-5 text-primary" />
                <span className="text-white/80">info@sakconstructionsgh.com</span>
              </div>
              <div className="flex items-center justify-center gap-3">
                <MapPin className="h-5 w-5 text-primary" />
                <span className="text-white/80">Accra, Ghana</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;