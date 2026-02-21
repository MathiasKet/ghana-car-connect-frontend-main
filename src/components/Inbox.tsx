import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    Mail,
    MessageSquare,
    Trash2,
    CheckCircle2,
    Clock,
    Search,
    ChevronRight,
    User,
    Phone,
    Calendar,
    Car as CarIcon
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import supabaseService from '@/services/supabaseService';
import { format } from 'date-fns';

interface Inquiry {
    id: string;
    listing_id: string;
    buyer_id: string | null;
    buyer_name: string;
    buyer_email: string;
    buyer_phone: string;
    message: string;
    status: 'new' | 'contacted' | 'closed';
    created_at: string;
    car_listings: {
        id: string;
        make: string;
        model: string;
    };
}

const Inbox = ({ userId }: { userId: string }) => {
    const [inquiries, setInquiries] = useState<Inquiry[]>([]);
    const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchInquiries = async () => {
        try {
            setLoading(true);
            const data = await supabaseService.getUserInquiries(userId);
            setInquiries(data as unknown as Inquiry[]);
        } catch (error) {
            console.error('Error fetching inquiries:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userId) {
            fetchInquiries();
        }
    }, [userId]);

    const updateStatus = async (id: string, status: string) => {
        try {
            await supabaseService.updateInquiryStatus(id, status);
            setInquiries(prev => prev.map(inq => inq.id === id ? { ...inq, status: status as any } : inq));
            if (selectedInquiry?.id === id) {
                setSelectedInquiry(prev => prev ? { ...prev, status: status as any } : null);
            }
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const filteredInquiries = inquiries.filter(inq =>
        inq.buyer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inq.car_listings.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inq.car_listings.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inq.message.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'new': return <Badge className="bg-blue-100 text-blue-800">New</Badge>;
            case 'contacted': return <Badge className="bg-yellow-100 text-yellow-800">Contacted</Badge>;
            case 'closed': return <Badge className="bg-gray-100 text-gray-800">Closed</Badge>;
            default: return null;
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[700px]">
            {/* Sidebar List */}
            <div className="lg:col-span-4 flex flex-col border rounded-lg bg-white overflow-hidden">
                <div className="p-4 border-b space-y-4">
                    <h3 className="text-lg font-semibold flex items-center">
                        <Mail className="h-5 w-5 mr-2 text-primary" />
                        Inbox
                    </h3>
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Search conversations..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                </div>

                <ScrollArea className="flex-1">
                    {filteredInquiries.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            <MessageSquare className="h-12 w-12 mx-auto mb-2 text-gray-200" />
                            <p>No inquiries found</p>
                        </div>
                    ) : (
                        <div className="divide-y">
                            {filteredInquiries.map((inq) => (
                                <div
                                    key={inq.id}
                                    onClick={() => setSelectedInquiry(inq)}
                                    className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${selectedInquiry?.id === inq.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''}`}
                                >
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="font-semibold text-gray-900 truncate pr-2">
                                            {inq.buyer_name}
                                        </span>
                                        <span className="text-xs text-gray-500 whitespace-nowrap">
                                            {format(new Date(inq.created_at), 'MMM d')}
                                        </span>
                                    </div>
                                    <div className="text-sm font-medium text-primary mb-1 truncate">
                                        {inq.car_listings.make} {inq.car_listings.model}
                                    </div>
                                    <p className="text-sm text-gray-500 line-clamp-1 mb-2">
                                        {inq.message}
                                    </p>
                                    <div className="flex justify-between items-center">
                                        {getStatusBadge(inq.status)}
                                        <ChevronRight className="h-4 w-4 text-gray-300" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>
            </div>

            {/* Main Conversation Area */}
            <div className="lg:col-span-8 border rounded-lg bg-white overflow-hidden flex flex-col">
                {selectedInquiry ? (
                    <>
                        <div className="p-6 border-b">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                                        {selectedInquiry.buyer_name}
                                    </h3>
                                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                                        <span className="flex items-center">
                                            <Mail className="h-4 w-4 mr-1 text-gray-400" />
                                            {selectedInquiry.buyer_email}
                                        </span>
                                        {selectedInquiry.buyer_phone && (
                                            <span className="flex items-center">
                                                <Phone className="h-4 w-4 mr-1 text-gray-400" />
                                                {selectedInquiry.buyer_phone}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <SelectTrigger className="w-40">
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <Button variant="outline" size="sm" onClick={() => updateStatus(selectedInquiry.id, 'contacted')}>
                                        <CheckCircle2 className="h-4 w-4 mr-2" />
                                        Mark Contacted
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <ScrollArea className="flex-1 p-6 bg-gray-50">
                            <div className="space-y-6">
                                {/* Car Details Card */}
                                <Card className="bg-white border-blue-100">
                                    <CardContent className="p-4">
                                        <div className="flex items-center text-sm font-semibold text-blue-600 mb-2">
                                            <CarIcon className="h-4 w-4 mr-2" />
                                            Car Related to Inquiry
                                        </div>
                                        <div className="text-lg font-bold text-gray-900">
                                            {selectedInquiry.car_listings.make} {selectedInquiry.car_listings.model}
                                        </div>
                                        <Button variant="link" className="p-0 h-auto text-blue-500 text-xs mt-1">
                                            View full listing details
                                        </Button>
                                    </CardContent>
                                </Card>

                                {/* Message Bubble */}
                                <div className="flex flex-col items-start max-w-2xl">
                                    <div className="bg-white p-4 rounded-lg rounded-tl-none shadow-sm border">
                                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                                            <Clock className="h-3 w-3" />
                                            Received {format(new Date(selectedInquiry.created_at), 'PPP p')}
                                        </div>
                                        <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                                            {selectedInquiry.message}
                                        </p>
                                    </div>
                                    <div className="mt-2 flex gap-4">
                                        <Button size="sm" variant="default" className="bg-primary text-white">
                                            Reply via Email
                                        </Button>
                                        <Button size="sm" variant="outline">
                                            Call {selectedInquiry.buyer_name}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </ScrollArea>

                        <div className="p-4 border-t bg-gray-50">
                            <div className="flex justify-between items-center text-xs text-gray-500">
                                <div className="flex items-center gap-4">
                                    <span>ID: {selectedInquiry.id}</span>
                                    <span className="flex items-center">
                                        <Calendar className="h-3 w-3 mr-1" />
                                        {format(new Date(selectedInquiry.created_at), 'yyyy-MM-dd')}
                                    </span>
                                </div>
                                <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete Inquiry
                                </Button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <Mail className="h-10 w-10 text-gray-300" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-600 mb-1">Select an Inquiry</h3>
                        <p className="max-w-xs text-center">
                            Click on a message from the list on the left to see the details and respond to the potential buyer.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Inbox;
