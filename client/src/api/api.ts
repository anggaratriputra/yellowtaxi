import axios from 'axios';

const api = axios.create({
  baseURL: 'https://apiyellowtaxi.anggaratriputra.my.id/',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  response => response,
  error => {
    console.error('API error:', error);
    return Promise.reject(error);
  }
);

// Function to fetch trip data with filters
export const fetchTrips = async (
  page: number,
  limit: number,
  filters: {
    service?: string;
    payment?: string;
    minDistance?: number;
    maxDistance?: number;
    minFare?: number;
    maxFare?: number;
  }
) => {
  try {
    const { service, payment, minDistance, maxDistance, minFare, maxFare } = filters;
    const response = await api.get(`/trips`, {
      params: {
        page,
        limit,
        service,
        payment,
        minDistance,
        maxDistance,
        minFare,
        maxFare,
      },
    });
    
  
    return response.data; 
  } catch (error) {
    console.error("Error fetching trips:", error);
    throw error;
  }
};

export default api;
