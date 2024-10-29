import express, { Request, Response } from 'express';
import axios from 'axios';

const router = express.Router();

const SOCRATA_API_URL = process.env.SOCRATA_API_URL;
const SOCRATA_APP_TOKEN = process.env.SOCRATA_APP_TOKEN;


interface Trip {
  pickup_latitude: number;
  pickup_longitude: number;
  dropoff_latitude: number;
  dropoff_longitude: number;
  trip_distance: number; 
  fare_amount: number;
  mta_tax: number; 
  total_amount: number;
  pickup_time: string; 
  dropoff_time: string; 
  trip_time: number;
  vendor_id: string; 
  payment_type: string; 
}


const convertToISOString = (timestamp: number): string => {
  return new Date(timestamp).toISOString();
};


const calculateTripTime = (pickup: string, dropoff: string): number => {
  const pickupDate = new Date(pickup).getTime();
  const dropoffDate = new Date(dropoff).getTime();
  return (dropoffDate - pickupDate) / 1000; 
};


const convertTripTimeToMinutes = (totalSeconds: number): number => {
  return Math.round(totalSeconds / 60); 
};

// Fetch trips from Socrata API with filtering and pagination
router.get('/', async (req: Request, res: Response) => {
  try {
    const {
      minFare = 0,
      maxFare = 1000,
      minDistance = 0,
      maxDistance = 100,
      service = '',
      payment= '',
      page = 1,
      limit = 100,
    } = req.query;

    const offset = (Number(page) - 1) * Number(limit); // Calculate offset for pagination

    
    let url = `${SOCRATA_API_URL}?$limit=${limit}&$offset=${offset}`;

    
    const filters: string[] = [];

    if (minFare) filters.push(`fare_amount >= ${minFare}`);
    if (maxFare) filters.push(`fare_amount <= ${maxFare}`);
    if (minDistance) filters.push(`trip_distance >= ${minDistance}`);
    if (maxDistance) filters.push(`trip_distance <= ${maxDistance}`);
    if (service) filters.push(`vendor_id = '${service}'`);
    if (payment) filters.push(`payment_type = '${payment}'`);

    if (filters.length) {
      url += `&$where=${filters.join(' AND ')}`;
    }

    // Fetch the trip data from Socrata
    const response = await axios.get(url, {
      headers: {
        'X-App-Token': SOCRATA_APP_TOKEN,
      },
    });

    
    const trips: Trip[] = response.data.map((trip: any) => {
      const pickupTime = convertToISOString(trip.pickup_datetime);
      const dropoffTime = convertToISOString(trip.dropoff_datetime);
      const tripDuration = calculateTripTime(pickupTime, dropoffTime);
      const tripTimeInMinutes = convertTripTimeToMinutes(tripDuration);

      const fareAmount = parseFloat(trip.fare_amount) || 0; 
      const mtaTax = parseFloat(trip.mta_tax) || 0; 
      const totalAmount = fareAmount + mtaTax; 
      return {
        pickup_latitude: trip.pickup_latitude,
        pickup_longitude: trip.pickup_longitude,
        dropoff_latitude: trip.dropoff_latitude,
        dropoff_longitude: trip.dropoff_longitude,
        trip_distance: trip.trip_distance || 0, 
        fare_amount: fareAmount, 
        mta_tax: mtaTax, 
        total_amount: totalAmount, 
        pickup_time: pickupTime, 
        dropoff_time: dropoffTime, 
        trip_time: tripTimeInMinutes, 
        vendor_id: trip.vendor_id || 'unknown', 
        payment_type: trip.payment_type || 'unknown', 
      };
    });

    
    let totalResponse = await axios.get(`${SOCRATA_API_URL}?$where=${filters.join(' AND ')}`, {
      headers: {
        'X-App-Token': SOCRATA_APP_TOKEN,
      },
    });

    const total = totalResponse.data.length; 
   
    res.json({ trips, total });
  } catch (error) {
    console.error('Error fetching trips:', error);
    res.status(500).json({ message: 'Error fetching trips' });
  }
});

export default router;
