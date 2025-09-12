import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { api } from '@/lib/api';

type Item = {
  id: string;
  title: string;
  category?: string;
  summary?: string;
  description?: string;
  design_image?: string;
  current_image?: string;
  status?: string;
  features?: string[];
  specifications?: Record<string, string>;
  created_at?: string;
};

const PortfolioDetail = () => {
  const { id } = useParams();
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      try {
        const data = await api.get(`/portfolio/${id}`);
        setItem(data);
      } catch {
        setItem(null);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen">
        <section className="h-64 bg-muted animate-pulse" />
        <div className="container px-4 py-10">
          <div className="h-8 bg-muted rounded w-1/2 mb-4" />
          <div className="h-4 bg-muted rounded w-2/3" />
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="container px-4 py-20 text-center">
        <p className="text-muted-foreground mb-6">Project not found.</p>
        <Button asChild>
          <Link to="/portfolio"><ArrowLeft className="w-4 h-4 mr-2" /> Back to Portfolio</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero with design image */}
      <section className="relative h-[44vh] overflow-hidden">
        <img src={item.design_image || '/placeholder.svg'} alt={item.title} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/50" />
        <div className="container px-4 relative z-10 h-full flex items-end pb-8">
          <div>
            <Badge variant="secondary" className="mb-3 bg-white text-foreground">{item.category || 'Project'}</Badge>
            <h1 className="text-3xl md:text-5xl font-bold text-white">{item.title}</h1>
            <p className="text-white/90 mt-2">{item.summary}</p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container px-4">
          {/* Design vs Current */}
          <div className="grid md:grid-cols-2 gap-6 mb-10">
            <div>
              <h3 className="font-semibold mb-2">Design</h3>
              <div className="rounded-xl overflow-hidden border">
                <img src={item.design_image || '/placeholder.svg'} alt="Design" className="w-full h-full object-cover" />
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Current State</h3>
              <div className="rounded-xl overflow-hidden border">
                <img src={item.current_image || '/placeholder.svg'} alt="Current state" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>

          {item.description && (
            <div className="prose prose-neutral dark:prose-invert max-w-none mb-10">
              <h3>About this project</h3>
              <p>{item.description}</p>
            </div>
          )}

          {/* Features and Specifications */}
          <div className="grid md:grid-cols-2 gap-8 mb-10">
            {item.features && item.features.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold mb-4">Key Features</h3>
                <ul className="space-y-2">
                  {item.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {item.specifications && Object.keys(item.specifications).length > 0 && (
              <div>
                <h3 className="text-xl font-semibold mb-4">Specifications</h3>
                <div className="space-y-2">
                  {Object.entries(item.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b border-muted">
                      <span className="font-medium text-muted-foreground">{key}</span>
                      <span className="text-foreground">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mt-8">
            <Button asChild variant="outline"><Link to="/portfolio"><ArrowLeft className="w-4 h-4 mr-2" /> Back to Portfolio</Link></Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PortfolioDetail;


