import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type Props = {
  onFilterSubmit: (filters: {
    service: string;
    payment: string;
    minDistance: number;
    maxDistance: number;
    minFare: number;
    maxFare: number;
  }) => void;
  onClose: () => void;
};

const FilterMobile: React.FC<Props> = ({ onFilterSubmit, onClose }) => {
  const [service, setService] = useState("");
  const [payment, setPayment] = useState("");
  const [minDistance, setMinDistance] = useState<string>("0");
  const [maxDistance, setMaxDistance] = useState<string>("100");
  const [minFare, setMinFare] = useState<string>("0");
  const [maxFare, setMaxFare] = useState<string>("1000");
  const [loading, setLoading] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!minDistance || !maxDistance || !minFare || !maxFare) {
      toast.warning("Please fill in all fields.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    const serviceCode = service === "CMT" ? "CMT" : service === "VTS" ? "VTS" : "";
    const paymentCode = payment === "Cash" ? "CSH" : payment === "Credit Card" ? "CRD" : "";

    setLoading(true);

    onFilterSubmit({
      service: serviceCode,
      payment: paymentCode,
      minDistance: parseFloat(minDistance) || 0,
      maxDistance: parseFloat(maxDistance) || 0,
      minFare: parseFloat(minFare) || 0,
      maxFare: parseFloat(maxFare) || 0,
    });

    setTimeout(() => {
      setIsClosing(true);
      setTimeout(() => {
        onClose();
        setIsClosing(false);
      }, 300);
    }, 3000);
  };

  const handleChange =
    (setter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setter(value.replace(/^0+/, ""));
    };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col p-2 px-4 w-full gap-4  text-[#122D4F] bg-[#F9F7E4] ">
      <div className="flex w-full gap-4">
        <select
          value={service}
          onChange={(e) => setService(e.target.value)}
          className="border rounded font-semibold px-2 py-1 w-full text-[#122D4F] bg-[#F9F7E4]"
        >
          <option value="">All Service</option>
          <option value="CMT">CMT</option>
          <option value="VTS">VTS</option>
        </select>
        <select
          value={payment}
          onChange={(e) => setPayment(e.target.value)}
          className="border rounded font-semibold px-2 py-1 w-full text-[#122D4F] bg-[#F9F7E4]"
        >
          <option value="">All Payment</option>
          <option value="Cash">Cash</option>
          <option value="Credit Card">Credit Card</option>
        </select>
      </div>
      <div className="flex flex-col gap-4 font-semibold">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col">
            <label htmlFor="minDistance">Min Distance (miles)</label>
            <input
              type="number"
              id="minDistance"
              value={minDistance}
              onChange={handleChange(setMinDistance)}
              min="0"
              className="border rounded font-semibold px-2 py-1 text-[#122D4F] bg-[#F9F7E4]"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="maxDistance">Max Distance (miles)</label>
            <input
              type="number"
              id="maxDistance"
              value={maxDistance}
              onChange={handleChange(setMaxDistance)}
              min="0"
              className="border rounded font-semibold px-2 py-1 text-[#122D4F] bg-[#F9F7E4]"
            />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col">
            <label htmlFor="minFare">Min Fare ($)</label>
            <input
              type="number"
              id="minFare"
              value={minFare}
              onChange={handleChange(setMinFare)}
              min="0"
              className="border rounded font-semibold px-2 py-1 text-[#122D4F] bg-[#F9F7E4]"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="maxFare">Max Fare ($)</label>
            <input
              type="number"
              id="maxFare"
              value={maxFare}
              onChange={handleChange(setMaxFare)}
              min="0"
              className="border rounded font-semibold px-2 py-1 text-[#122D4F] bg-[#F9F7E4]"
            />
          </div>
        </div>
      </div>
      <button
        type="submit"
        className={`bg-yellow-300 hover:bg-yellow-400 w-full transition  py-2 font-semibold shadow-xl px-4 rounded-lg flex justify-center items-center gap-2 ${
          loading ? "cursor-not-allowed" : ""
        }`}
        disabled={loading}
      >
        {loading ? (
          <>
            <div className="animate-spin border-2 border-white rounded-full w-4 h-4 border-t-transparent mr-2"></div>
            <span>Searching...</span>
          </>
        ) : (
          <>
            <FaSearch />
            <span>Search</span>
          </>
        )}
      </button>

      <ToastContainer />
    </form>
  );
};

export default FilterMobile;
