import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Car, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  Star,
  TrendingUp,
  Calendar,
  MapPin,
  DollarSign,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  Image,
  Loader2
} from 'lucide-react';
import SupabaseService from '@/services/supabaseService';
import { CarListing } from '@/lib/supabase';

interface AdminCarListing extends CarListing {
  sellerName: string;
  sellerEmail: string;
  sellerPhone: string;
  paymentStatus: 'paid' | 'pending' | 'failed';
}

const AdminCarListings = () => {
  const [listings, setListings] = useState<AdminCarListing[]>([]);
  const [filteredListings, setFilteredListings] = useState<AdminCarListing[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedListing, setSelectedListing] = useState<AdminCarListing | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadListings();
  }, []);

  const loadListings = async () => {
    try {
      setLoading(true);
      
      // Fetch listings with user data
      const { data: listings, error } = await SupabaseService.supabase
        .from('car_listings')
        .select(`
          *,
          users!car_listings_user_id_fkey (
            name,
            email,
            phone
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Transform data to match AdminCarListing interface
      const adminListings = (listings || []).map(listing => ({
        ...listing,
        sellerName: listing.users?.name || 'Unknown',
        sellerEmail: listing.users?.email || 'Unknown',
        sellerPhone: listing.users?.phone || 'Unknown',
        paymentStatus: 'paid' // You can implement actual payment status tracking
      }));
      
      setListings(adminListings);
      setFilteredListings(adminListings);
      
    } catch (error) {
      console.error('Failed to load listings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = listings;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(listing => 
        listing.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.sellerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(listing => listing.status === statusFilter);
    }

    // Apply type filter
    if (typeFilter !== 'all') {
      const isFeatured = typeFilter === 'featured';
      filtered = filtered.filter(listing => listing.featured === isFeatured);
    }

    // Apply tab filter
    if (activeTab !== 'all') {
      filtered = filtered.filter(listing => listing.status === activeTab);
    }

    setFilteredListings(filtered);
  }, [listings, searchTerm, statusFilter, typeFilter, activeTab]);

  const handleStatusChange = async (listingId: string, newStatus: string) => {
    setIsLoading(true);
    try {
      const { error } = await SupabaseService.supabase
        .from('car_listings')
        .update({ status: newStatus })
        .eq('id', listingId);
      
      if (error) throw error;
      
      setListings(listings.map(listing => 
        listing.id === listingId ? { ...listing, status: newStatus as any } : listing
      ));
      
    } catch (error) {
      console.error('Failed to update listing status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFeaturedToggle = async (listingId: string) => {
    setIsLoading(true);
    try {
      const listing = listings.find(l => l.id === listingId);
      const newFeaturedState = !listing?.featured;
      
      const { error } = await SupabaseService.supabase
        .from('car_listings')
        .update({ featured: newFeaturedState })
        .eq('id', listingId);
      
      if (error) throw error;
      
      setListings(listings.map(listing => 
        listing.id === listingId ? { ...listing, featured: newFeaturedState } : listing
      ));
      
    } catch (error) {
      console.error('Failed to toggle featured status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'sold': return 'bg-blue-100 text-blue-800';
      case 'rejected': return 'red-100 text-red-800';
      case 'expired': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const totalListings = listings.length;
  const activeListings = listings.filter(l => l.status === 'active').length;
  const pendingListings = listings.filter(l => l.status === 'pending').length;
  const soldListings = listings.filter(l => l.status === 'sold').length;
  const totalRevenue = listings.filter(l => l.paymentStatus === 'paid').reduce((sum, listing) => 
    sum + (listing.featured ? 150 : 50), 0
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Car Listings Management</h1>
          <p className="text-gray-600">Manage all car listings and their status</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Listings</p>
                <p className="text-2xl font-bold text-gray-900">{totalListings}</p>
              </div>
              <Car className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold text-gray-900">{activeListings}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{pendingListings}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Sold</p>
                <p className="text-2xl font-bold text-gray-900">{soldListings}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Revenue</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalRevenue)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search listings by make, model, seller, or location..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="w-full md:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="sold">Sold</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full md:w-48">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="featured">Featured</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Listings Table */}
      <Card>
        <CardHeader>
          <CardTitle>Car Listings</CardTitle>
          <CardDescription>
            Manage all car listings on the platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList>
              <TabsTrigger value="all">All ({totalListings})</TabsTrigger>
              <TabsTrigger value="active">Active ({activeListings})</TabsTrigger>
              <TabsTrigger value="pending">Pending ({pendingListings})</TabsTrigger>
              <TabsTrigger value="sold">Sold ({soldListings})</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab}>
              <ListingsTable 
                listings={filteredListings}
                onStatusChange={handleStatusChange}
                onFeaturedToggle={handleFeaturedToggle}
                onViewDetails={(listing) => {
                  setSelectedListing(listing);
                  setIsViewDialogOpen(true);
                }}
                isLoading={isLoading}
              />
            </TabsContent>

            <TabsContent value="all">
              <ListingsTable 
                listings={filteredListings}
                onStatusChange={handleStatusChange}
                onFeaturedToggle={handleFeaturedToggle}
                onViewDetails={(listing) => {
                  setSelectedListing(listing);
                  setIsViewDialogOpen(true);
                }}
                isLoading={isLoading}
              />
            </TabsContent>

            <TabsContent value="pending">
              <ListingsTable 
                listings={filteredListings}
                onStatusChange={handleStatusChange}
                onFeaturedToggle={handleFeaturedToggle}
                onViewDetails={(listing) => {
                  setSelectedListing(listing);
                  setIsViewDialogOpen(true);
                }}
                isLoading={isLoading}
              />
            </TabsContent>

            <TabsContent value="sold">
              <ListingsTable 
                listings={filteredListings}
                onStatusChange={handleStatusChange}
                onFeaturedToggle={handleFeaturedToggle}
                onViewDetails={(listing) => {
                  setSelectedListing(listing);
                  setIsViewDialogOpen(true);
                }}
                isLoading={isLoading}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Listing Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Listing Details</DialogTitle>
            <DialogDescription>
              View detailed information about this car listing
            </DialogDescription>
          </DialogHeader>
          
          {selectedListing && (
            <div className="space-y-6">
              {/* Car Images */}
              <div className="grid grid-cols-3 gap-2">
                {selectedListing.images.map((image, index) => (
                  <div key={index} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={image}
                      alt={`${selectedListing.make} ${selectedListing.model} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>

              {/* Basic Info */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold">
                    {selectedListing.make} {selectedListing.model}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(selectedListing.status)}>
                      {selectedListing.status}
                    </Badge>
                    {selectedListing.featured && (
                      <Badge className="bg-blue-100 text-blue-800">
                        <Star className="h-3 w-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Year</p>
                    <p className="font-medium">{selectedListing.year}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Price</p>
                    <p className="font-medium text-primary">{formatCurrency(selectedListing.price)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Mileage</p>
                    <p className="font-medium">{selectedListing.mileage.toLocaleString()} km</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Condition</p>
                    <p className="font-medium capitalize">{selectedListing.condition}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Transmission</p>
                    <p className="font-medium capitalize">{selectedListing.transmission}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Fuel Type</p>
                    <p className="font-medium capitalize">{selectedListing.fuel_type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="font-medium">{selectedListing.location}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-2">Description</p>
                  <p className="text-sm">{selectedListing.description}</p>
                </div>
              </div>

              {/* Seller Info */}
              <div className="space-y-4 border-t pt-4">
                <h4 className="font-semibold">Seller Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="font-medium">{selectedListing.sellerName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{selectedListing.sellerEmail}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium">{selectedListing.sellerPhone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Payment Status</p>
                    <Badge className={getPaymentStatusColor(selectedListing.paymentStatus)}>
                      {selectedListing.paymentStatus}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Performance */}
              <div className="space-y-4 border-t pt-4">
                <h4 className="font-semibold">Performance</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Views</p>
                    <p className="font-medium">{selectedListing.views}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Inquiries</p>
                    <p className="font-medium">{selectedListing.inquiries}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Listed</p>
                    <p className="font-medium">{new Date(selectedListing.created_at).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Expires</p>
                    <p className="font-medium">{new Date(selectedListing.expires_at).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-2 border-t pt-4">
                {selectedListing.status === 'pending' && (
                  <>
                    <Button
                      onClick={() => handleStatusChange(selectedListing.id, 'active')}
                      disabled={isLoading}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleStatusChange(selectedListing.id, 'rejected')}
                      disabled={isLoading}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                  </>
                )}
                <Button
                  variant="outline"
                  onClick={() => handleFeaturedToggle(selectedListing.id)}
                  disabled={isLoading}
                >
                  <Star className="h-4 w-4 mr-2" />
                  {selectedListing.featured ? 'Remove Featured' : 'Make Featured'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Separate component for the listings table to avoid repetition
const ListingsTable = ({ 
  listings, 
  onStatusChange, 
  onFeaturedToggle, 
  onViewDetails, 
  isLoading 
}: {
  listings: AdminCarListing[];
  onStatusChange: (id: string, status: string) => void;
  onFeaturedToggle: (id: string) => void;
  onViewDetails: (listing: AdminCarListing) => void;
  isLoading: boolean;
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'sold': return 'bg-blue-100 text-blue-800';
      case 'rejected': return 'red-100 text-red-800';
      case 'expired': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Vehicle</TableHead>
            <TableHead>Seller</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Performance</TableHead>
            <TableHead>Listed</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {listings.map((listing) => (
            <TableRow key={listing.id}>
              <TableCell>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden">
                    <img
                      src={listing.images[0] || '/placeholder-car.jpg'}
                      alt={`${listing.make} ${listing.model}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <p className="font-medium">{listing.make} {listing.model}</p>
                      {listing.featured && (
                        <Star className="h-4 w-4 text-yellow-500" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{listing.year} • {listing.location}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <p className="font-medium">{listing.sellerName}</p>
                  <p className="text-sm text-gray-600">{listing.sellerEmail}</p>
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <Badge className={getStatusColor(listing.status)}>
                    {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
                  </Badge>
                  <div>
                    <Badge className={getPaymentStatusColor(listing.paymentStatus)}>
                      {listing.paymentStatus}
                    </Badge>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <p className="font-medium">{formatCurrency(listing.price)}</p>
                <p className="text-sm text-gray-600">
                  {listing.featured ? 'Featured' : 'Standard'}
                </p>
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  <p>{listing.views} views</p>
                  <p className="text-gray-600">{listing.inquiries} inquiries</p>
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  <p>{new Date(listing.created_at).toLocaleDateString()}</p>
                  <p className="text-gray-600">Expires: {new Date(listing.expires_at).toLocaleDateString()}</p>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewDetails(listing)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onFeaturedToggle(listing.id)}
                    disabled={isLoading}
                  >
                    <Star className="h-4 w-4" />
                  </Button>
                  {listing.status === 'pending' && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onStatusChange(listing.id, 'active')}
                        disabled={isLoading}
                      >
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onStatusChange(listing.id, 'rejected')}
                        disabled={isLoading}
                      >
                        <XCircle className="h-4 w-4 text-red-500" />
                      </Button>
                    </>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminCarListings;
