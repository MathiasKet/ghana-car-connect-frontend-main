
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Star } from 'lucide-react';
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface CarCardProps {
  id: string;
  title: string;
  location: string;
  price: number;
  year: number;
  mileage: number;
  transmission: string;
  fuelType: string;
  imageUrl: string;
  rating: number;
  isRental?: boolean;
}

const CarCard = ({
  id,
  title,
  location,
  price,
  year,
  mileage,
  transmission,
  fuelType,
  imageUrl,
  rating,
  isRental = false
}: CarCardProps) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const navigate = useNavigate();
  
  const handleCardClick = () => {
    navigate(`/car/${id}`);
  };
  
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg cursor-pointer" onClick={handleCardClick}>
      <div className="relative aspect-[4/3]">
        <img 
          src={imageUrl} 
          alt={title}
          className="object-cover w-full h-full"
        />
        <button 
          className="absolute top-3 right-3 p-2 bg-white/80 hover:bg-white rounded-full"
          onClick={(e) => {
            e.stopPropagation();
            setIsFavorite(!isFavorite);
          }}
        >
          <Heart 
            className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} 
          />
        </button>
        {isRental && (
          <Badge className="absolute top-3 left-3 bg-secondary hover:bg-secondary">
            Rental
          </Badge>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-medium truncate">{title}</h3>
          <div className="flex items-center">
            <Star className="w-4 h-4 mr-1 text-yellow-500 fill-yellow-500" />
            <span className="text-sm font-medium">{rating}</span>
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground mb-3">{location}</p>
        
        <div className="grid grid-cols-2 gap-2 mb-4 text-xs text-muted-foreground">
          <div className="flex items-center">
            <span className="font-medium">Year:</span>
            <span className="ml-1">{year}</span>
          </div>
          <div className="flex items-center">
            <span className="font-medium">Mileage:</span>
            <span className="ml-1">{mileage.toLocaleString()} km</span>
          </div>
          <div className="flex items-center">
            <span className="font-medium">Trans:</span>
            <span className="ml-1">{transmission}</span>
          </div>
          <div className="flex items-center">
            <span className="font-medium">Fuel:</span>
            <span className="ml-1">{fuelType}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-3 border-t">
          <div>
            <span className="text-xl font-bold">₵{price.toLocaleString()}</span>
            {isRental && <span className="text-sm text-muted-foreground">/day</span>}
          </div>
          <span className="text-sm font-medium text-primary hover:underline">
            View Details
          </span>
        </div>
      </div>
    </Card>
  );
};

export default CarCard;
