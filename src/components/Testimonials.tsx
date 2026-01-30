
import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { useAdminContent } from '@/hooks/useAdminContent';

const Testimonials = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const { testimonials, loading } = useAdminContent();
  const testimonialsPerPage = 2;
  
  const featuredTestimonials = testimonials.filter(t => t.featured);
  const pageCount = Math.ceil(featuredTestimonials.length / testimonialsPerPage);
  
  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % pageCount);
  };
  
  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + pageCount) % pageCount);
  };
  
  const start = currentPage * testimonialsPerPage;
  const displayedTestimonials = featuredTestimonials.slice(start, start + testimonialsPerPage);

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container px-4">
          <div className="text-center mb-12">
            <h2 className="mb-3 text-3xl font-bold">What Our Customers Say</h2>
            <p className="max-w-2xl mx-auto text-muted-foreground">
              Trusted by thousands of car buyers, sellers, and renters across Ghana.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {[1, 2].map((i) => (
              <Card key={i} className="border-0 shadow-md animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 rounded mb-4 w-1/3"></div>
                  <div className="h-16 bg-gray-200 rounded mb-6"></div>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gray-200 rounded-full mr-4"></div>
                    <div>
                      <div className="h-4 bg-gray-200 rounded mb-2 w-24"></div>
                      <div className="h-3 bg-gray-200 rounded w-16"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }
  
  return (
    <section className="py-16 bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="container px-4">
        <div className="text-center mb-12">
          <h2 className="mb-3 text-3xl font-bold">What Our Customers Say</h2>
          <p className="max-w-2xl mx-auto text-muted-foreground">
            Trusted by thousands of car buyers, sellers, and renters across Ghana.
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {displayedTestimonials.map((testimonial) => (
            <Card key={testimonial.id} className="border-0 shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-5 h-5 ${
                          i < testimonial.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'
                        }`} 
                      />
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    {testimonial.verified && (
                      <Badge variant="secondary" className="text-xs">Verified</Badge>
                    )}
                    {testimonial.featured && (
                      <Badge variant="outline" className="text-xs">Featured</Badge>
                    )}
                  </div>
                </div>
                <p className="mb-6 italic">&ldquo;{testimonial.content}&rdquo;</p>
                <div className="flex items-center">
                  <Avatar className="mr-4">
                    <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                    <AvatarFallback>
                      {testimonial.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role}
                      {testimonial.company && ` • ${testimonial.company}`}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {featuredTestimonials.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No featured testimonials available.</p>
          </div>
        )}
        
        {pageCount > 1 && (
          <div className="flex items-center justify-center mt-8 space-x-2">
            <Button 
              variant="outline" 
              size="icon"
              onClick={prevPage}
              aria-label="Previous testimonials"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            
            {[...Array(pageCount)].map((_, i) => (
              <Button 
                key={i}
                variant={i === currentPage ? "default" : "outline"}
                size="icon"
                className="w-8 h-8"
                onClick={() => setCurrentPage(i)}
                aria-label={`Page ${i + 1}`}
              >
                <span className="text-xs">{i + 1}</span>
              </Button>
            ))}
            
            <Button 
              variant="outline" 
              size="icon"
              onClick={nextPage}
              aria-label="Next testimonials"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Testimonials;
