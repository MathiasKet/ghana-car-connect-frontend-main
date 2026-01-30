import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Save, 
  Plus, 
  Trash2, 
  Edit,
  RefreshCw,
  MessageSquare,
  Star,
  Quote,
  User
} from 'lucide-react';
import { toast } from 'sonner';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  rating: number;
  content: string;
  featured: boolean;
  verified: boolean;
  dateAdded: string;
}

const defaultTestimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Kwame Asante',
    role: 'Business Owner',
    company: 'Accra Logistics Ltd',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    rating: 5,
    content: 'CarConnect Ghana made it so easy to find the perfect vehicle for my business. The process was smooth, and the customer service was exceptional. Highly recommended!',
    featured: true,
    verified: true,
    dateAdded: '2024-01-15'
  },
  {
    id: '2',
    name: 'Adjoa Mensah',
    role: 'Marketing Manager',
    company: 'Tech Ghana',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
    rating: 5,
    content: 'I rented a car for a business trip and was impressed by the quality and service. The vehicle was clean, well-maintained, and the booking process was seamless.',
    featured: true,
    verified: true,
    dateAdded: '2024-01-10'
  },
  {
    id: '3',
    name: 'Kojo Bonsu',
    role: 'Software Developer',
    company: 'Digital Solutions',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    rating: 4,
    content: 'Sold my car through CarConnect Ghana and got a great price. The platform connected me with serious buyers quickly. The whole process took less than a week!',
    featured: false,
    verified: true,
    dateAdded: '2024-01-05'
  }
];

const AdminTestimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(defaultTestimonials);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [formData, setFormData] = useState<Partial<Testimonial>>({
    name: '',
    role: '',
    company: '',
    avatar: '',
    rating: 5,
    content: '',
    featured: true,
    verified: false,
    dateAdded: new Date().toISOString().split('T')[0]
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('testimonials');
    if (saved) {
      setTestimonials(JSON.parse(saved));
    }
  }, []);

  const saveTestimonials = async (updatedTestimonials: Testimonial[]) => {
    setIsSaving(true);
    try {
      localStorage.setItem('testimonials', JSON.stringify(updatedTestimonials));
      setTestimonials(updatedTestimonials);
      toast.success('Testimonials saved successfully!');
    } catch (error) {
      toast.error('Failed to save testimonials');
    } finally {
      setIsSaving(false);
    }
  };

  const resetTestimonials = () => {
    setTestimonials(defaultTestimonials);
    toast.info('Testimonials reset to default');
  };

  const openDialog = (testimonial?: Testimonial) => {
    if (testimonial) {
      setEditingTestimonial(testimonial);
      setFormData(testimonial);
    } else {
      setEditingTestimonial(null);
      setFormData({
        name: '',
        role: '',
        company: '',
        avatar: '',
        rating: 5,
        content: '',
        featured: true,
        verified: false,
        dateAdded: new Date().toISOString().split('T')[0]
      });
    }
    setIsDialogOpen(true);
  };

  const saveTestimonial = () => {
    if (!formData.name || !formData.content) {
      toast.error('Please fill in all required fields');
      return;
    }

    let updatedTestimonials: Testimonial[];
    
    if (editingTestimonial) {
      updatedTestimonials = testimonials.map(testimonial => 
        testimonial.id === editingTestimonial.id 
          ? { ...formData, id: editingTestimonial.id } as Testimonial
          : testimonial
      );
    } else {
      const newTestimonial: Testimonial = {
        ...formData,
        id: Date.now().toString()
      } as Testimonial;
      updatedTestimonials = [...testimonials, newTestimonial];
    }

    saveTestimonials(updatedTestimonials);
    setIsDialogOpen(false);
    setEditingTestimonial(null);
  };

  const deleteTestimonial = (id: string) => {
    const updatedTestimonials = testimonials.filter(testimonial => testimonial.id !== id);
    saveTestimonials(updatedTestimonials);
  };

  const toggleFeatured = (id: string) => {
    const updatedTestimonials = testimonials.map(testimonial =>
      testimonial.id === id ? { ...testimonial, featured: !testimonial.featured } : testimonial
    );
    saveTestimonials(updatedTestimonials);
  };

  const toggleVerified = (id: string) => {
    const updatedTestimonials = testimonials.map(testimonial =>
      testimonial.id === id ? { ...testimonial, verified: !testimonial.verified } : testimonial
    );
    saveTestimonials(updatedTestimonials);
  };

  const renderStars = (rating: number, interactive = false, onChange?: (rating: number) => void) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating 
                ? 'text-yellow-400 fill-current' 
                : 'text-gray-300'
            } ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''}`}
            onClick={() => interactive && onChange && onChange(star)}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Testimonials</h1>
          <p className="text-gray-600">Manage customer testimonials and reviews</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={resetTestimonials}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => openDialog()}>
                <Plus className="h-4 w-4 mr-2" />
                Add Testimonial
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingTestimonial ? 'Edit Testimonial' : 'Add New Testimonial'}</DialogTitle>
                <DialogDescription>
                  {editingTestimonial ? 'Update the testimonial details below.' : 'Fill in the details for the new testimonial.'}
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Kwame Asante"
                  />
                </div>
                <div>
                  <Label htmlFor="role">Role</Label>
                  <Input
                    id="role"
                    value={formData.role}
                    onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                    placeholder="e.g., Business Owner"
                  />
                </div>
                <div>
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                    placeholder="e.g., Accra Logistics Ltd"
                  />
                </div>
                <div>
                  <Label htmlFor="avatar">Avatar URL</Label>
                  <Input
                    id="avatar"
                    value={formData.avatar}
                    onChange={(e) => setFormData(prev => ({ ...prev, avatar: e.target.value }))}
                    placeholder="https://example.com/avatar.jpg"
                  />
                </div>
                <div className="col-span-2">
                  <Label>Rating</Label>
                  <div className="flex items-center space-x-2">
                    {renderStars(formData.rating || 5, true, (rating) => 
                      setFormData(prev => ({ ...prev, rating }))
                    )}
                    <span className="text-sm text-gray-600">({formData.rating || 5} stars)</span>
                  </div>
                </div>
                <div className="col-span-2">
                  <Label htmlFor="content">Testimonial Content *</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Enter the customer's testimonial..."
                    rows={4}
                  />
                </div>
                <div>
                  <Label htmlFor="dateAdded">Date Added</Label>
                  <Input
                    id="dateAdded"
                    type="date"
                    value={formData.dateAdded}
                    onChange={(e) => setFormData(prev => ({ ...prev, dateAdded: e.target.value }))}
                  />
                </div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="featured"
                      checked={formData.featured}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, featured: checked }))}
                    />
                    <Label htmlFor="featured">Featured on homepage</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="verified"
                      checked={formData.verified}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, verified: checked }))}
                    />
                    <Label htmlFor="verified">Verified customer</Label>
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-6">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={saveTestimonial} disabled={isSaving}>
                  {isSaving ? 'Saving...' : 'Save Testimonial'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <MessageSquare className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Testimonials</p>
                <p className="text-2xl font-bold">{testimonials.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Star className="h-8 w-8 text-yellow-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Featured</p>
                <p className="text-2xl font-bold">{testimonials.filter(t => t.featured).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <User className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Verified</p>
                <p className="text-2xl font-bold">{testimonials.filter(t => t.verified).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Quote className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                <p className="text-2xl font-bold">
                  {testimonials.length > 0 
                    ? (testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length).toFixed(1)
                    : '0.0'
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((testimonial) => (
          <Card key={testimonial.id} className={testimonial.featured ? 'ring-2 ring-primary' : ''}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  {testimonial.featured && <Badge variant="outline">Featured</Badge>}
                  {testimonial.verified && <Badge variant="secondary">Verified</Badge>}
                </div>
                <div className="flex space-x-1">
                  <Button variant="ghost" size="sm" onClick={() => openDialog(testimonial)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => deleteTestimonial(testimonial.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                    <AvatarFallback>
                      {testimonial.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{testimonial.name}</h3>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                    {testimonial.company && (
                      <p className="text-xs text-gray-500">{testimonial.company}</p>
                    )}
                  </div>
                </div>

                <div>
                  {renderStars(testimonial.rating)}
                </div>

                <blockquote className="text-gray-700 italic">
                  "{testimonial.content}"
                </blockquote>

                <div className="text-xs text-gray-500">
                  Added: {new Date(testimonial.dateAdded).toLocaleDateString()}
                </div>

                <div className="flex space-x-2 pt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => toggleFeatured(testimonial.id)}
                  >
                    {testimonial.featured ? 'Remove Featured' : 'Make Featured'}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => toggleVerified(testimonial.id)}
                  >
                    {testimonial.verified ? 'Unverify' : 'Verify'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {testimonials.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No testimonials</h3>
            <p className="text-gray-600 mb-4">Get started by adding your first customer testimonial.</p>
            <Button onClick={() => openDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Testimonial
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminTestimonials;
