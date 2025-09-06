import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Bed, Bath, Square, Star } from 'lucide-react';
import villaImage from '@/assets/villa-plan.jpg';
import bungalowImage from '@/assets/bungalow-plan.jpg';
import townhouseImage from '@/assets/townhouse-plan.jpg';

const PlanCategories = () => {
  const categories = [
    {
      title: 'Luxury Villas',
      description: 'Spacious multi-story homes with premium features and modern amenities',
      image: villaImage,
      plans: 10,
      startingPrice: '₵2,100',
      features: ['4-6 Bedrooms', '3-5 Bathrooms', '2600-4200 sq ft'],
      popular: true,
    },
    {
      title: 'Modern Bungalows',
      description: 'Single-story comfort with contemporary design and family-friendly layouts',
      image: bungalowImage,
      plans: 10,
      startingPrice: '₵1,500',
      features: ['2-4 Bedrooms', '2-3 Bathrooms', '1200-2200 sq ft'],
      popular: false,
    },
    {
      title: 'Stylish Townhouses',
      description: 'Multi-level urban living solutions with smart space utilization',
      image: townhouseImage,
      plans: 10,
      startingPrice: '₵1,700',
      features: ['2-5 Bedrooms', '2-4 Bathrooms', '1600-2800 sq ft'],
      popular: false,
    },
  ];

  const features = [
    {
      icon: Bed,
      title: 'Flexible Layouts',
      description: 'From cozy 2-bedroom homes to spacious 6-bedroom estates',
    },
    {
      icon: Bath,
      title: 'Modern Amenities',
      description: 'Contemporary bathrooms, kitchens, and living spaces',
    },
    {
      icon: Square,
      title: 'Various Sizes',
      description: 'Plans ranging from 1,200 to 4,200+ square feet',
    },
    {
      icon: Star,
      title: 'Premium Quality',
      description: 'Professionally designed by licensed architects',
    },
  ];

  return (
    <section className="bg-slate-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 flex-wrap mb-8">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900">Selected Projects</h2>
            <p className="text-slate-600 mt-2">A snapshot of our recent work across sectors.</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Filter</span>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 rounded-xl text-sm font-semibold border bg-slate-900 text-white">All</button>
              <button className="px-3 py-1.5 rounded-xl text-sm font-semibold border bg-white text-slate-700">Villas</button>
              <button className="px-3 py-1.5 rounded-xl text-sm font-semibold border bg-white text-slate-700">Bungalows</button>
              <button className="px-3 py-1.5 rounded-xl text-sm font-semibold border bg-white text-slate-700">Townhouses</button>
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div key={category.title} className="group">
              <div className="aspect-[4/3] w-full rounded-2xl bg-gradient-to-br from-slate-300 to-slate-100 border border-slate-200 grid place-items-center overflow-hidden">
                <img
                  src={category.image}
                  alt={category.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <div className="mt-3 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-slate-900">{category.title}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{category.plans} Plans Available</p>
                </div>
                <Button variant="outline" className="px-4 py-2 rounded-xl text-sm font-semibold border hover:bg-slate-50">
                  View Plans
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="py-10 bg-gradient-to-r from-orange-600 to-amber-500 text-white rounded-3xl mt-12">
          <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
            <h3 className="text-2xl font-extrabold">Let's build something great together.</h3>
            <Button className="inline-flex items-center gap-2 bg-white text-slate-900 px-5 py-3 rounded-2xl font-semibold hover:bg-slate-50">
              View All Plans
            </Button>
          </div>
        </div>

      </div>
    </section>
  );
};

export default PlanCategories;