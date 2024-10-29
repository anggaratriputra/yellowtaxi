import React, { useEffect, useState, useRef } from "react";
import Navbar from "../components/Navbar";
import MapView from "../components/MapView";
import MapViewMobile from "../components/MapViewMobile";
import { fetchTrips } from "../api/api";
import { RiPinDistanceFill } from "react-icons/ri";
import { LuTimer } from "react-icons/lu";
import { SiCashapp } from "react-icons/si";
import { GrFormPrevious } from "react-icons/gr";
import { GrFormNext } from "react-icons/gr";
import { FaLocationDot } from "react-icons/fa6";
import { FaArrowRight, FaCreditCard, FaFilter, FaRegCalendarAlt } from "react-icons/fa";
import { IoMdCash } from "react-icons/io";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Trip } from "../types";
import Filter from "../components/Filter";
import FilterMobile from "../components/FilterMobile";

const Home: React.FC = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalTrips, setTotalTrips] = useState<number>(0);
  const tripsPerPage = 10;

  // Loading state
  const [loading, setLoading] = useState<boolean>(true);

  // Filter state
  const [service, setService] = useState<string>("");
  const [payment, setPayment] = useState<string>("");
  const [minDistance, setMinDistance] = useState<number>(0);
  const [maxDistance, setMaxDistance] = useState<number>(100);
  const [minFare, setMinFare] = useState<number>(0);
  const [maxFare, setMaxFare] = useState<number>(1000);
  const [jumpToPage, setJumpToPage] = useState<number>(1);
  const [showJumpToPageModal, setShowJumpToPageModal] = useState<boolean>(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const toggleFilterModal = () => {
    if (isFilterOpen) {
      setIsClosing(true);
      setTimeout(() => {
        setIsFilterOpen(false);
        setIsClosing(false);
      }, 300);
    } else {
      setIsFilterOpen(true);
    }
  };

  const mapRef = useRef<HTMLDivElement>(null);
  const formatDateTime = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
    return new Date(dateString).toLocaleString("en-GB", options);
  };

  useEffect(() => {
    const getTrips = async (filters: any) => {
      setLoading(true);
      try {
        const data = await fetchTrips(currentPage, tripsPerPage, filters);
        const transformedTrips = data.trips.map((trip: any, index: number) => ({
          id: `trip-${index}`,
          route: [
            { lat: parseFloat(trip.pickup_latitude), lng: parseFloat(trip.pickup_longitude) },
            { lat: parseFloat(trip.dropoff_latitude), lng: parseFloat(trip.dropoff_longitude) },
          ],
          vendorId: trip.vendor_id,
          tripTime: trip.trip_time,
          totalAmount: parseFloat(trip.total_amount),
          time: formatDateTime(trip.pickup_time),
          fare: parseFloat(trip.fare_amount),
          distance: parseFloat(trip.trip_distance),
          paymentType: trip.payment_type,
        }));

        setTrips(transformedTrips);
        setTotalTrips(data.total || 0);
      } catch (err) {
        setError("Failed to fetch trip data");
      } finally {
        setLoading(false);
      }
    };

    getTrips({
      service,
      payment,
      minDistance,
      maxDistance,
      minFare,
      maxFare,
    });
  }, [currentPage, service, payment, minDistance, maxDistance, minFare, maxFare]);

  const totalPages = Math.ceil(totalTrips / tripsPerPage);

  const handleTripClick = (trip: Trip) => {
    setSelectedTripId(trip.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFilterSubmit = (filters: any) => {
    setService(filters.service);
    setPayment(filters.payment);
    setMinDistance(filters.minDistance);
    setMaxDistance(filters.maxDistance);
    setMinFare(filters.minFare);
    setMaxFare(filters.maxFare);
    setCurrentPage(1);
  };

  const toggleJumpToPage = () => {
    setTimeout(() => {
      setShowJumpToPageModal(!showJumpToPageModal);
      setIsClosing(false);
    }, 300);
  };

  const handleJumpToPage = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setTimeout(() => {
        setCurrentPage(page);
        setShowJumpToPageModal(!showJumpToPageModal);
        setIsClosing(false);
      }, 300);
    } else {
      toast.warning(`Please input between 1 and ${totalPages}`, {
        position: "bottom-right",
        autoClose: 3000,
      });
      return;
    }
  };

  return (
    <div>
      <div className="hidden lg:flex h-[100vh] px-6 py-4 gap-4 bg-[#122D4F] ">
        <div ref={mapRef} className="w-[60vw] rounded-lg">
          <MapView trips={trips} selectedTripId={selectedTripId} onTripClick={handleTripClick} />
        </div>
        <div className="flex w-[40vw] flex-col">
          <Navbar />
          {error && <p className="text-red-500">{error}</p>}
          <div className="flex justify-center">
            <Filter onFilterSubmit={handleFilterSubmit} />
          </div>
          <div className="flex justify-center h-[66vh] bg-[#F9F7E4] rounded-lg  overflow-y-auto custom-scrollbar hide-scrollbar ">
            <div className="flex flex-col w-full max-h-[50vh] p-2">
              {loading ? (
                Array.from({ length: 10 }, (_, index) => (
                  <div key={index} className="flex p-4 gap-10 justify-between items-center text-[#122D4F] bg-[#F9F7E4]">
                    <div className="flex flex-row items-center gap-12 ">
                      <div className="flex flex-col items-center justify-center">
                        <Skeleton height={44} width={44} />
                        <Skeleton width={30} />
                      </div>
                      <div className="flex font-semibold flex-col w-56">
                        <div className="flex items-center gap-2 ">
                          <Skeleton width={150} />
                        </div>
                        <div className="flex items-center gap-2 ">
                          <Skeleton width={80} />
                        </div>
                        <div className="flex items-center gap-2 ">
                          <Skeleton width={80} />
                        </div>
                      </div>
                      <div className="flex font-semibold flex-col">
                        <div className="flex flex-row gap-2 items-center">
                          <Skeleton width={100} />
                        </div>
                        <div className="flex gap-2 items-center">
                          <Skeleton width={50} />
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : trips.length === 0 ? (
                <p className="text-[#F9F7E4] text-lg text-center">No Data</p>
              ) : (
                trips.map((trip) => (
                  <div
                    className="flex p-4 gap-10 justify-between items-center space-y-0 text-sm text-[#122D4F] bg-[#F9F7E4]"
                    key={trip.id}
                  >
                    <div className="flex flex-row items-center gap-8 ">
                      <div className="flex flex-col items-center justify-center">
                        {trip.vendorId === "VTS" ? (
                          <img src="/taxi1.png" alt="Taxi" className="w-20 h-10" />
                        ) : (
                          <img src="/taxi2.png" alt="Taxi2" className="w-20 h-10" />
                        )}
                        <span className="font-bold">{trip.vendorId}</span>
                      </div>

                      <div className="flex font-semibold flex-col w-52">
                        <div className="flex items-center gap-2 ">
                          <FaRegCalendarAlt />
                          <span>{trip.time}</span>
                        </div>
                        <div className="flex items-center gap-2 ">
                          <RiPinDistanceFill />
                          <span>{trip.distance} Miles</span>
                        </div>

                        <div className="flex items-center gap-2 ">
                          <LuTimer />
                          <span>{trip.tripTime} Minutes</span>
                        </div>
                      </div>
                      <div className="flex font-semibold flex-col">
                        <div className="flex flex-row gap-2 items-center">
                          {trip.paymentType === "CRD" ? <FaCreditCard /> : <IoMdCash />}
                          <span>{trip.paymentType === "CRD" ? "Credit Card" : "Cash"}</span>
                        </div>
                        <div className="flex gap-2 items-center">
                          <SiCashapp />
                          <span>${trip.totalAmount.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                    <button onClick={() => handleTripClick(trip)}>
                      <FaLocationDot size={24} className="transition hover:text-yellow-400" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
          <div className="flex px-2 gap-2 justify-center items-center mt-4">
            <button
              className="p-2 text-[#122D4F] bg-[#F9F7E4] rounded-full hover:bg-gray-400 transition"
              disabled={currentPage === 1 || totalTrips === 0}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            >
              <GrFormPrevious />
            </button>
            <span className="mx-2 font-semibold text-[#F9F7E4]" onClick={toggleJumpToPage}>
              Page {totalTrips === 0 ? 0 : currentPage} of {totalTrips === 0 ? 0 : totalPages}
            </span>
            <button
              className="p-2 text-[#122D4F] bg-[#F9F7E4] rounded-full hover:bg-gray-400 transition"
              disabled={currentPage === totalPages || totalTrips === 0}
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            >
              <GrFormNext />
            </button>
          </div>
        </div>
        {showJumpToPageModal && (
          <div className="fixed bottom-0 right-10 flex justify-center items-end z-50">
            <div
              className={`relative w-[300px] bg-yellow-300 rounded-t-lg h-[10vh] p-6 ${
                isClosing ? "modal-slide-down" : "modal-slide-up"
              }`}
            >
              {/* Close Button */}
              <button
                className="absolute top-4 right-4 text-xl font-bold"
                onClick={() => {
                  toggleJumpToPage();
                }}
              >
                ✕
              </button>
              <div className="flex gap-2 items-center">
                <h2 className="text-md font-semibold">Jump to page</h2>
                <input
                  type="number"
                  className="w-14 p-2 rounded-lg "
                  placeholder="Page Number"
                  value={jumpToPage}
                  onChange={(e) => setJumpToPage(Number(e.target.value))}
                  min={1}
                  max={totalPages}
                />
                <button className="transition" onClick={() => handleJumpToPage(jumpToPage)}>
                  <FaArrowRight />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* MOBILE VERSION */}
      <div className="lg:hidden flex flex-col h-full px-6 py-4 gap-4 bg-[#122D4F] ">
        <Navbar />
        {error && <p className="text-red-500">{error}</p>}
        <div className="relative z-10">
          <MapViewMobile trips={trips} selectedTripId={selectedTripId} onTripClick={handleTripClick} />
        </div>

        <button
          onClick={toggleFilterModal}
          className="fixed bottom-4 right-4 p-4 bg-[#F9F7E4] text-[#122D4F] rounded-full shadow-md z-50"
        >
          <FaFilter size={24} />
        </button>

        {isFilterOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-end z-50">
            <div
              className={`relative w-full bg-[#f9F7E4] rounded-t-lg overflow-y-scroll h-[60vh] p-6 ${
                isClosing ? "modal-slide-down" : "modal-slide-up"
              }`}
            >
              <button className="absolute top-4 right-4 text-xl font-bold" onClick={toggleFilterModal}>
                ✕
              </button>
              <h2 className="text-xl font-semibold mb-4">Filter Trips</h2>
              {isFilterOpen && <FilterMobile onFilterSubmit={handleFilterSubmit} onClose={toggleFilterModal} />}
            </div>
          </div>
        )}
        <div className="flex justify-center h-[66vh] bg-[#F9F7E4] rounded-lg  overflow-y-auto custom-scrollbar hide-scrollbar">
          <div className="flex flex-col w-full max-h-[50vh] p-2">
            {loading ? (
              Array.from({ length: 10 }, (_, index) => (
                <div key={index} className="flex p-4 gap-10 justify-between items-center  text-[#122D4F] bg-[#F9F7E4] ">
                  <div className="flex flex-row items-center gap-12 ">
                    <div className="flex flex-col items-center justify-center">
                      <Skeleton height={40} width={40} />
                      <Skeleton width={30} />
                    </div>
                    <div className="flex font-semibold flex-col w-56">
                      <div className="flex items-center gap-2 ">
                        <Skeleton width={150} />
                      </div>
                      <div className="flex items-center gap-2 ">
                        <Skeleton width={80} />
                      </div>
                      <div className="flex items-center gap-2 ">
                        <Skeleton width={80} />
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : trips.length === 0 ? (
              <p className="text-[#F9F7E4] text-lg text-center">No Data</p>
            ) : (
              trips.map((trip) => (
                <div
                  className="flex p-4 gap-2 justify-between items-center text-xs text-[#122D4F] bg-[#F9F7E4] "
                  key={trip.id}
                >
                  <div className="flex flex-row items-center gap-4 ">
                    <div className="flex flex-col items-center justify-center">
                      {trip.vendorId === "VTS" ? (
                        <img src="/taxi1.png" alt="Taxi" className="w-20 h-10" />
                      ) : (
                        <img src="/taxi2.png" alt="Taxi2" className="w-20 h-10" />
                      )}
                      <span className="font-bold">{trip.vendorId}</span>
                    </div>

                    <div className="flex font-semibold flex-col w-52">
                      <div className="flex items-center gap-2 ">
                        <FaRegCalendarAlt />
                        <span>{trip.time}</span>
                      </div>
                      <div className="flex items-center gap-2 ">
                        <RiPinDistanceFill />
                        <span>{trip.distance} Miles</span>
                      </div>

                      <div className="flex items-center gap-2 ">
                        <LuTimer />
                        <span>{trip.tripTime} Minutes</span>
                      </div>
                      <div className="flex flex-row gap-2 items-center">
                        {trip.paymentType === "CRD" ? <FaCreditCard /> : <IoMdCash />}
                        <span>{trip.paymentType === "CRD" ? "Credit Card" : "Cash"}</span>
                      </div>
                      <div className="flex gap-2 items-center">
                        <SiCashapp />
                        <span>${trip.totalAmount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => handleTripClick(trip)}>
                    <FaLocationDot size={24} className="transition hover:text-yellow-400" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
        <div className="flex px-2 gap-2 justify-center items-center">
          <button
            className="p-2 text-[#122D4F] bg-[#F9F7E4] rounded-full hover:bg-gray-400 transition"
            disabled={currentPage === 1 || totalTrips === 0}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          >
            <GrFormPrevious />
          </button>
          <button className="mx-2 font-semibold text-[#F9F7E4]" onClick={toggleJumpToPage}>
            Page {totalTrips === 0 ? 0 : currentPage} of {totalTrips === 0 ? 0 : totalPages}
          </button>
          <button
            className="p-2 text-[#122D4F] bg-[#F9F7E4] rounded-full hover:bg-gray-400 transition"
            disabled={currentPage === totalPages || totalTrips === 0}
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          >
            <GrFormNext />
          </button>
        </div>
        {showJumpToPageModal && (
          <div className="fixed bottom-0 flex justify-center items-end z-50">
            <div
              className={`relative w-[345px] bg-yellow-300 rounded-t-lg h-[10vh] p-6 ${
                isClosing ? "modal-slide-down" : "modal-slide-up"
              }`}
            >
              <button
                className="absolute top-4 right-4 text-xl font-bold"
                onClick={() => {
                  toggleJumpToPage();
                }}
              >
                ✕
              </button>
              <div className="flex gap-2 items-center">
                <h2 className="text-md font-semibold">Jump to page</h2>
                <input
                  type="number"
                  className="w-14 p-2 rounded-lg "
                  placeholder="Page Number"
                  value={jumpToPage}
                  onChange={(e) => setJumpToPage(Number(e.target.value))}
                  min={1}
                  max={totalPages}
                />
                <button className="transition" onClick={() => handleJumpToPage(jumpToPage)}>
                  <FaArrowRight />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default Home;
