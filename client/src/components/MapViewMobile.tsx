import React, { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "axios";
import { Trip } from "../types";
import { BiSolidTaxi } from "react-icons/bi";
import { RiPinDistanceFill } from "react-icons/ri";
import { LuTimer } from "react-icons/lu";
import { SiCashapp } from "react-icons/si";
import { FaCalendarAlt } from "react-icons/fa";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

interface MapViewProps {
  trips: Trip[];
  selectedTripId: string | null;
  onTripClick: (trip: Trip) => void;
}

const pickupIcon = new L.Icon({
  iconUrl: "/taxi_logopickup.png",
  iconSize: [30, 30],
});

const dropoffIcon = new L.Icon({
  iconUrl: "/taxi_logodropoff.png",
  iconSize: [30, 30],
});

const MapViewMobile: React.FC<MapViewProps> = ({ trips, selectedTripId, onTripClick }) => {
  const [routeCoordinates, setRouteCoordinates] = useState<[number, number][]>([]);
  const markerRefs = useRef<{ [key: string]: L.Marker }>({});

  useEffect(() => {
    if (selectedTripId) {
      const selectedTrip = trips.find((trip) => trip.id === selectedTripId);
      if (selectedTrip) {
        const fetchRoute = async () => {
          const pickup = selectedTrip.route[0];
          const dropoff = selectedTrip.route[1];
          const mapboxAccessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN!;

          try {
            const response = await axios.get(
              `https://api.mapbox.com/directions/v5/mapbox/driving/${pickup.lng},${pickup.lat};${dropoff.lng},${dropoff.lat}?geometries=geojson&access_token=${mapboxAccessToken}`
            );

            const route = response.data.routes[0].geometry.coordinates.map((coord: number[]) => [coord[1], coord[0]]);
            setRouteCoordinates(route);
          } catch (error) {
            console.error("Error fetching route:", error);
          }
        };

        fetchRoute();

        if (markerRefs.current[selectedTripId]) {
          markerRefs.current[selectedTripId].openPopup();
        }
      }
    } else {
      setRouteCoordinates([]);
    }
  }, [selectedTripId, trips]);

  return (
    <div className="flex justify-center">
      <MapContainer
        center={[40.758896, -73.98513]}
        zoom={12}
        style={{ height: "400px", width: "100%", borderRadius: "20px" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {trips.map((trip) => {
          const isSelected = selectedTripId === trip.id;

          return (
            <React.Fragment key={trip.id}>
              <Marker
                position={[trip.route[0].lat, trip.route[0].lng]}
                eventHandlers={{
                  click: () => onTripClick(trip),
                }}
                icon={pickupIcon}
                ref={(el) => {
                  if (el) {
                    markerRefs.current[trip.id] = el;
                  }
                }}
              >
                <Popup>
                  <div>
                    <h4 className="text-center">Trip Details:</h4>
                    <div className="flex flex-col items-center">
                      <div className="flex items-center gap-2">
                        <FaCalendarAlt />
                        <span>{trip.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BiSolidTaxi />
                        <span>{trip.vendorId}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <RiPinDistanceFill />
                        <span>{trip.distance} Miles</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <LuTimer />
                        <span>{trip.tripTime} Minutes</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <SiCashapp />
                        <span>{trip.paymentType === "CRD" ? "Credit Card" : "Cash"}</span>
                        <span>${trip.totalAmount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </Popup>
              </Marker>

              {isSelected && (
                <Marker key={`${trip.id}-dropoff`} position={[trip.route[1].lat, trip.route[1].lng]} icon={dropoffIcon}>
                  <Popup>Dropoff Location</Popup>
                </Marker>
              )}
            </React.Fragment>
          );
        })}

        {routeCoordinates.length > 0 && <Polyline positions={routeCoordinates} color="blue" weight={5} />}
      </MapContainer>
    </div>
  );
};

export default MapViewMobile;
