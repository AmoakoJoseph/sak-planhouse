import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';

const Portfolio = () => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { profile } = useAuth();

  useEffect(() => {
    // Reuse plans as sample portfolio items for now
    const fetchItems = async () => {
      try {
        // Try dedicated portfolio endpoint; fallback to plans
        let data: any[] | undefined;
        try {
          data = await api.get('/portfolio');
        } catch {
          // Ignore and fallback
        }
        if (!data || !Array.isArray(data) || data.length === 0) {
          const plans = await api.getPlans({ status: 'active' });
          data = plans?.slice(0, 12) || [];
        }
        setItems(data);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <img src="/src/assets/hero-construction.jpg" alt="Portfolio banner" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-orange-600/80" />
        <div className="container px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Our Portfolio</h1>
          <p className="text-white/90 max-w-2xl mx-auto">A selection of completed designs and projects.</p>
          </div>
      </section>

      <section className="py-16">
        <div className="container px-4">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-48 bg-muted rounded-t-lg" />
                  <CardContent className="p-6">
                    <div className="h-4 bg-muted rounded mb-2"></div>
                    <div className="h-3 bg-muted rounded w-2/3"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {items.map((item) => (
                <Card key={item.id || item.title} className="group overflow-hidden rounded-2xl shadow-sm hover:shadow-xl transition-all">
                  <div className="relative h-48">
                    <img src={item.image_url || item.design_image || '/placeholder.svg'} alt={item.title} className="w-full h-full object-cover" />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-white text-foreground shadow">{item.category || item.plan_type || 'Project'}</Badge>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Building2 className="w-4 h-4 text-primary" />
                      <h3 className="text-lg font-semibold">{item.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{item.description || item.summary || 'Completed architectural project.'}</p>
                    {item.id && (
                      <div className="mt-3">
                        <Button asChild variant="outline" size="sm">
                          <Link to={`/portfolio/${item.id}`}>View Project <ArrowRight className="w-4 h-4 ml-2" /></Link>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Portfolio;


