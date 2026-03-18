import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Star, Truck, Shield, Clock, Sparkles, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/ProductCard';
import { productService, type ProductData } from '@/lib/firebase';
import { categories } from '@/data/products';

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    icon: Truck,
    title: 'Free Worldwide Shipping',
    description: 'Complimentary delivery on all orders over $100',
  },
  {
    icon: Star,
    title: 'Premium Quality',
    description: 'Crafted with the finest materials by skilled artisans',
  },
  {
    icon: Shield,
    title: 'Secure Payment',
    description: '256-bit SSL encryption for your complete safety',
  },
  {
    icon: Clock,
    title: '24/7 Concierge',
    description: 'Round-the-clock personal shopping assistance',
  },
];

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Fashion Editor, Vogue',
    content: 'Absolutely stunning quality. Every piece feels like a work of art. The attention to detail is unparalleled.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
  },
  {
    name: 'Michael Chen',
    role: 'CEO, Luxe Holdings',
    content: 'The shipping was incredibly fast, and the packaging was exquisite. A true luxury experience from start to finish.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
  },
  {
    name: 'Emily Rodriguez',
    role: 'Interior Designer',
    content: 'A brand I trust implicitly for all my luxury needs. Their curation is simply unmatched in the industry.',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
  },
];

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const heroImageRef = useRef<HTMLDivElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const [featuredProducts, setFeaturedProducts] = useState<ProductData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load featured products
    const loadProducts = async () => {
      try {
        const products = await productService.getFeaturedProducts(6);
        setFeaturedProducts(products);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadProducts();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero entrance animation
      const tl = gsap.timeline();
      
      tl.from('.hero-title-line', {
        y: 100,
        opacity: 0,
        duration: 1.2,
        stagger: 0.15,
        ease: 'power4.out',
      })
      .from('.hero-subtitle', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
      }, '-=0.6')
      .from('.hero-cta', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
      }, '-=0.4');

      // Hero parallax on scroll
      gsap.to(heroImageRef.current, {
        yPercent: 30,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });

      gsap.to(heroContentRef.current, {
        yPercent: -20,
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: '50% top',
          scrub: true,
        },
      });

      // Section reveals
      gsap.utils.toArray<HTMLElement>('.reveal-section').forEach((section) => {
        gsap.from(section.querySelectorAll('.reveal-item'), {
          y: 60,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        });
      });

      // Gold line animation
      gsap.utils.toArray<HTMLElement>('.gold-line').forEach((line) => {
        gsap.from(line, {
          scaleX: 0,
          duration: 1.5,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: line,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        });
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="bg-black min-h-screen">
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative h-screen w-full overflow-hidden"
      >
        {/* Background Image with Parallax */}
        <div
          ref={heroImageRef}
          className="absolute inset-0 w-full h-[120%] -top-[10%]"
        >
          <img
            src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1920&h=1080&fit=crop&q=90"
            alt="Luxury Fashion"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60" />
        </div>

        {/* Animated Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-gold/30 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`,
              }}
            />
          ))}
        </div>

        {/* Hero Content */}
        <div
          ref={heroContentRef}
          className="relative z-10 h-full flex flex-col items-center justify-center text-center section-padding"
        >
          {/* Badge */}
          <div className="hero-subtitle mb-8">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm border border-gold/30 rounded-full">
              <Sparkles className="w-4 h-4 text-gold" />
              <span className="text-gold text-sm tracking-wider uppercase">Welcome to Luxxy-rious</span>
            </span>
          </div>

          {/* Title */}
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-white mb-6 leading-[0.9] tracking-tight">
            <span className="hero-title-line block overflow-hidden">
              <span className="inline-block">Luxury for the</span>
            </span>
            <span className="hero-title-line block overflow-hidden">
              <span className="inline-block text-gold-gradient">Modern Era</span>
            </span>
          </h1>

          {/* Subtitle */}
          <p className="hero-subtitle text-white/70 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed">
            Experience the epitome of sophistication with our curated collection of timeless essentials, 
            crafted for those who demand nothing but the extraordinary.
          </p>

          {/* CTAs */}
          <div className="hero-cta flex flex-col sm:flex-row gap-4">
            <Link to="/products">
              <Button
                size="lg"
                className="group bg-gold text-black hover:bg-gold-light font-medium px-8 py-6 text-base relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center">
                  Explore Collection
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-gold-light to-gold opacity-0 group-hover:opacity-100 transition-opacity" />
              </Button>
            </Link>
            <Link to="/register">
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/5 hover:border-gold px-8 py-6 text-base backdrop-blur-sm"
              >
                Join the Elite
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="hero-subtitle mt-16 flex flex-wrap justify-center gap-8 md:gap-16">
            {[
              { value: '50K+', label: 'Happy Clients' },
              { value: '10K+', label: 'Products' },
              { value: '150+', label: 'Luxury Brands' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl md:text-4xl font-display text-gold">{stat.value}</p>
                <p className="text-white/50 text-sm uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10">
          <div className="flex flex-col items-center gap-2">
            <span className="text-white/40 text-xs uppercase tracking-widest">Scroll</span>
            <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
              <div className="w-1.5 h-3 bg-gold rounded-full animate-bounce" />
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-24 section-padding reveal-section">
        <div className="text-center mb-16">
          <div className="gold-line w-16 h-px bg-gold mx-auto mb-6 origin-left" />
          <p className="reveal-item text-gold uppercase tracking-[0.3em] text-sm mb-4">Browse by Category</p>
          <h2 className="reveal-item font-display text-4xl md:text-5xl lg:text-6xl text-white">
            Curated Collections
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.slice(0, 6).map((category, index) => (
            <Link
              key={category.id}
              to={`/products/${category.id}`}
              className="reveal-item group relative aspect-[3/4] overflow-hidden rounded-xl"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
              <div className="absolute inset-0 border border-white/10 rounded-xl group-hover:border-gold/50 transition-colors duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="font-body font-medium text-white group-hover:text-gold transition-colors text-sm">
                  {category.name}
                </h3>
                <div className="flex items-center gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-gold text-xs">Explore</span>
                  <ChevronRight className="w-3 h-3 text-gold" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 section-padding reveal-section">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <div className="reveal-item relative">
            <div className="relative overflow-hidden rounded-2xl">
              <img
                src="https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&h=1000&fit=crop&q=90"
                alt="About Luxxy-rious"
                className="w-full aspect-[3/4] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
            {/* Decorative elements */}
            <div className="absolute -bottom-6 -right-6 w-48 h-48 border border-gold/30 rounded-2xl -z-10" />
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-gold/10 rounded-2xl -z-10" />
            
            {/* Floating badge */}
            <div className="absolute bottom-8 left-8 bg-black/80 backdrop-blur-xl border border-gold/30 rounded-xl p-4">
              <p className="text-gold text-3xl font-display">15+</p>
              <p className="text-white/60 text-sm">Years of Excellence</p>
            </div>
          </div>

          {/* Content */}
          <div className="reveal-item">
            <div className="gold-line w-16 h-px bg-gold mb-6 origin-left" />
            <p className="text-gold uppercase tracking-[0.3em] text-sm mb-4">
              Our Story
            </p>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-white mb-6 leading-tight">
              Crafted for the<br />
              <span className="text-gold-gradient">Discerning Individual</span>
            </h2>
            <p className="text-white/70 text-lg leading-relaxed mb-6">
              We believe luxury is not just about price, but about the feeling of perfection. 
              Our materials are sourced from the finest artisans worldwide, ensuring every piece 
              meets our exacting standards of excellence.
            </p>
            <p className="text-white/60 leading-relaxed mb-8">
              From the moment you browse our collection to the day your order arrives, 
              we strive to create an experience that transcends the ordinary. This is luxury, 
              redefined for the modern era.
            </p>
            
            {/* Features list */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {[
                'Handpicked Selection',
                'Authentic Guarantee',
                'White Glove Service',
                'Global Shipping',
              ].map((feature) => (
                <div key={feature} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-gold rounded-full" />
                  <span className="text-white/80 text-sm">{feature}</span>
                </div>
              ))}
            </div>

            <Link to="/products">
              <Button className="btn-luxury group">
                <span className="flex items-center gap-2">
                  Discover More
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-24 section-padding bg-gradient-to-b from-black via-white/[0.02] to-black reveal-section">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
          <div>
            <div className="gold-line w-16 h-px bg-gold mb-6 origin-left" />
            <p className="reveal-item text-gold uppercase tracking-[0.3em] text-sm mb-4">Handpicked Selection</p>
            <h2 className="reveal-item font-display text-4xl md:text-5xl lg:text-6xl text-white">
              Featured Products
            </h2>
          </div>
          <Link to="/products" className="reveal-item mt-4 md:mt-0 group flex items-center gap-2 text-gold hover:text-gold-light transition-colors">
            <span className="text-sm uppercase tracking-wider">View All Products</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="aspect-[4/5] bg-white/5 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product, index) => (
              <div 
                key={product.id} 
                className="reveal-item"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Features Section */}
      <section className="py-24 section-padding reveal-section">
        <div className="text-center mb-16">
          <div className="gold-line w-16 h-px bg-gold mx-auto mb-6 origin-center" />
          <p className="reveal-item text-gold uppercase tracking-[0.3em] text-sm mb-4">Why Choose Us</p>
          <h2 className="reveal-item font-display text-4xl md:text-5xl lg:text-6xl text-white">
            The Luxxy-rious Experience
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="reveal-item group p-8 rounded-2xl bg-gradient-to-br from-white/[0.03] to-transparent border border-white/5 hover:border-gold/30 transition-all duration-500"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-16 h-16 mb-6 rounded-xl bg-gold/10 flex items-center justify-center group-hover:bg-gold/20 group-hover:scale-110 transition-all duration-300">
                <feature.icon className="w-7 h-7 text-gold" />
              </div>
              <h3 className="font-body font-semibold text-white text-lg mb-3 group-hover:text-gold transition-colors">
                {feature.title}
              </h3>
              <p className="text-white/60 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 section-padding bg-gradient-to-b from-black via-white/[0.02] to-black reveal-section">
        <div className="text-center mb-16">
          <div className="gold-line w-16 h-px bg-gold mx-auto mb-6 origin-center" />
          <p className="reveal-item text-gold uppercase tracking-[0.3em] text-sm mb-4">Testimonials</p>
          <h2 className="reveal-item font-display text-4xl md:text-5xl lg:text-6xl text-white">
            Voices of Distinction
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.name}
              className="reveal-item relative p-8 rounded-2xl bg-gradient-to-br from-white/[0.03] to-transparent border border-white/5 hover:border-gold/20 transition-all duration-500 group"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              {/* Quote icon */}
              <div className="absolute top-6 right-6 text-6xl font-display text-gold/10 leading-none">
                &ldquo;
              </div>
              
              <div className="flex items-center gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-gold text-gold" />
                ))}
              </div>
              
              <p className="text-white/80 italic mb-8 leading-relaxed relative z-10">
                &ldquo;{testimonial.content}&rdquo;
              </p>
              
              <div className="flex items-center gap-4">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-gold/30 group-hover:border-gold transition-colors"
                />
                <div>
                  <p className="font-body font-medium text-white group-hover:text-gold transition-colors">
                    {testimonial.name}
                  </p>
                  <p className="text-white/50 text-sm">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&h=800&fit=crop&q=90"
            alt="CTA Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/80" />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black" />
        </div>

        {/* Animated border */}
        <div className="absolute inset-8 border border-gold/20 rounded-3xl pointer-events-none" />
        <div className="absolute inset-8 border border-gold/10 rounded-3xl scale-105 pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 text-center section-padding">
          <div className="gold-line w-16 h-px bg-gold mx-auto mb-6" />
          <p className="text-gold uppercase tracking-[0.3em] text-sm mb-4">Join the Elite</p>
          <h2 className="font-display text-4xl md:text-6xl lg:text-7xl text-white mb-6">
            Elevate Your<br />
            <span className="text-gold-gradient">Lifestyle</span>
          </h2>
          <p className="text-white/70 text-lg max-w-xl mx-auto mb-10">
            Join the inner circle and be the first to discover our exclusive collections, 
            limited editions, and members-only offers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button
                size="lg"
                className="bg-gold text-black hover:bg-gold-light font-medium px-10 py-6 text-base animate-pulse-gold"
              >
                Become a Member
              </Button>
            </Link>
            <Link to="/products">
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/5 hover:border-gold px-10 py-6 text-base"
              >
                Browse Collection
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-24 section-padding reveal-section">
        <div className="max-w-3xl mx-auto text-center">
          <div className="gold-line w-16 h-px bg-gold mx-auto mb-6" />
          <h2 className="reveal-item font-display text-3xl md:text-4xl text-white mb-4">
            Stay in the Loop
          </h2>
          <p className="reveal-item text-white/60 mb-8">
            Subscribe to receive exclusive offers, early access to new collections, and luxury lifestyle inspiration.
          </p>
          <div className="reveal-item flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-4 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:border-gold focus:outline-none transition-colors"
            />
            <Button className="bg-gold text-black hover:bg-gold-light font-medium px-8 py-4">
              Subscribe
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
