// src/types.ts

export interface LatLng {
    lat: number;
    lng: number;
  }
  
  export interface Trip {
    id: string;
    route: LatLng[];
    time: string;
    fare: number;
    distance: number;
    paymentType: string;
    vendorId: string;
    tripTime: number;
    totalAmount: number;
    tripDistance: number;
  }
  