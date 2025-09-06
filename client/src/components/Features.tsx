import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download, Shield, Clock, Users, Palette, FileText } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: Download,
      title: 'Instant Downloads',
      description: 'Get immediate access to your purchased plans in multiple formats including PDF, DWG, and CAD files.',
      highlight: 'Immediate Access',
      emoji: '⚡',
    },
    {
      icon: Shield,
      title: 'Quality Guaranteed',
      description: 'All plans are designed by licensed architects and comply with local building codes and regulations.',
      highlight: 'Licensed Architects',
      emoji: '🏆',
    },
    {
      icon: Clock,
      title: '24/7 Availability',
      description: 'Browse and purchase plans anytime, anywhere. Our platform is always available when you need it.',
      highlight: 'Always Open',
      emoji: '🌙',
    },
    {
      icon: Users,
      title: 'Expert Support',
      description: 'Get professional assistance from our team of architects and construction experts.',
      highlight: 'Professional Help',
      emoji: '👥',
    },
    {
      icon: Palette,
      title: 'Customization Options',
      description: 'Most plans can be modified to suit your specific needs and preferences.',
      highlight: 'Flexible Designs',
      emoji: '🎨',
    },
    {
      icon: FileText,
      title: 'Complete Documentation',
      description: 'Detailed floor plans, elevations, sections, and construction details included.',
      highlight: 'Full Package',
      emoji: '📋',
    },
  ];

  return (
    <section className="py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900">Services</h2>
            <p className="text-slate-600 mt-1">End‑to‑end delivery, from drawings to handover.</p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div key={feature.title} className="p-6 rounded-3xl border border-slate-200 bg-white">
              <div className="h-10 w-10 rounded-xl grid place-items-center bg-orange-50 mb-4">
                <div className="text-2xl">{feature.emoji}</div>
              </div>
              <h3 className="mt-4 font-bold text-slate-900">{feature.title}</h3>
              <p className="mt-2 text-slate-600 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Features;