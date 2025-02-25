import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { updateDriver, fetchDrivers } from "../../features/driversSlice";
import { FaArrowLeft } from "react-icons/fa";
import Loader from "../../components/Loader";

const EditDriver = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { drivers, status } = useSelector((state) => state.drivers);
  const [name, setName] = useState("");
  const [licenseType, setLicenseType] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchDrivers());
    }
  }, [status, dispatch]);

  useEffect(() => {
    const driver = drivers.find((d) => d.id === id);
    if (driver) {
      setName(driver.name);
      setLicenseType(driver.license_type);
    }
  }, [drivers, id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await dispatch(updateDriver({ id, name, license_type: licenseType })).unwrap();
      navigate("/drivers"); 
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") return <Loader />;
  if (!name) return <p className="text-center text-gray-700 text-lg">Driver not found.</p>;

  return (
    <div className="container mx-auto p-6 max-w-lg">
      {/* Back Button */}
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-700 hover:text-gray-900 transition cursor-pointer"
        >
          <FaArrowLeft className="mr-2" />
          Back
        </button>
      </div>

      <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Edit Driver</h2>

      <form onSubmit={handleSubmit} className="bg-white border-2 border-gray-300 shadow-lg p-6 rounded-lg">
        {/* Name Field */}
        <div className="mb-4">
          <label className="block text-gray-600 font-medium">Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border rounded-lg w-full p-3 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* License Type Selection */}
        <div className="mb-6">
          <label className="block text-gray-600 font-medium">License Type:</label>
          <select
            value={licenseType}
            onChange={(e) => setLicenseType(e.target.value)}
            className="border rounded-lg w-full p-3 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select License Type</option>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
            <option value="D">D</option>
            <option value="E">E</option>
          </select>
        </div>

        {/* Loader or Submit Button */}
        {loading ? (
          <div className="flex justify-center my-4">
            <Loader />
          </div>
        ) : (
          <button
            type="submit"
            disabled={!name || !licenseType}
            className={`w-full text-white px-4 py-3 rounded-lg transition ${
              !name || !licenseType
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            Update
          </button>
        )}
      </form>
    </div>
  );
};

export default EditDriver;
