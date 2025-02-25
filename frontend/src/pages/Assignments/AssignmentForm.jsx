import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchDrivers } from "../../features/driversSlice";
import { fetchTrucks } from "../../features/trucksSlice";
import { addAssignment } from "../../features/assignmentsSlice";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import Loader from "../../components/Loader";

const AssignmentForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { drivers, status: driversStatus } = useSelector((state) => state.drivers);
  const { trucks, status: trucksStatus } = useSelector((state) => state.trucks);

  const [driverId, setDriverId] = useState("");
  const [truckId, setTruckId] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (driversStatus === "idle") dispatch(fetchDrivers());
    if (trucksStatus === "idle") dispatch(fetchTrucks());
  }, [dispatch, driversStatus, trucksStatus]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await dispatch(addAssignment({ driver_id: driverId, truck_id: truckId, date })).unwrap();
      navigate("/assignments");
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-lg">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-700 hover:text-gray-900 transition cursor-pointer"
        >
          <FaArrowLeft className="mr-2" />
          Back
        </button>
      </div>

      <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">New Assignment</h2>

      <form onSubmit={handleSubmit} className="bg-white border-2 border-gray-300 shadow-lg p-6 rounded-lg">
        {/* Driver Selection */}
        <div className="mb-4">
          <label className="block text-gray-600 font-medium">Driver:</label>
          <select
            value={driverId}
            onChange={(e) => setDriverId(e.target.value)}
            className="border rounded-lg w-full p-3 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a driver</option>
            {drivers.map((driver) => (
              <option key={driver.id} value={driver.id}>
                {driver.name} - {driver.license_type}
              </option>
            ))}
          </select>
        </div>

        {/* Truck Selection */}
        <div className="mb-4">
          <label className="block text-gray-600 font-medium">Truck:</label>
          <select
            value={truckId}
            onChange={(e) => setTruckId(e.target.value)}
            className="border rounded-lg w-full p-3 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a truck</option>
            {trucks.map((truck) => (
              <option key={truck.id} value={truck.id}>
                {truck.plate} - {truck.min_license_type}
              </option>
            ))}
          </select>
        </div>

        {/* Date Selection */}
        <div className="mb-6">
          <label className="block text-gray-600 font-medium">Date:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border rounded-lg w-full p-3 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Loader or Submit Button */}
        {loading ? (
          <div className="flex justify-center my-4">
            <Loader />
          </div>
        ) : (
          <button
            type="submit"
            disabled={!driverId || !truckId || !date}
            className={`w-full text-white px-4 py-3 rounded-lg transition ${
              !driverId || !truckId || !date
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            Save
          </button>
        )}
      </form>
    </div>
  );
};

export default AssignmentForm;
