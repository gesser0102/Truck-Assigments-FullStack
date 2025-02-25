import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchDrivers } from "../features/driversSlice";
import { fetchTrucks } from "../features/trucksSlice";
import { fetchAssignments } from "../features/assignmentsSlice";
import { Link } from "react-router-dom";
import { FaUsers, FaTruck, FaClipboardList, FaGithub, FaLinkedin } from "react-icons/fa";

const Home = () => {
  const dispatch = useDispatch();

  const { drivers } = useSelector((state) => state.drivers);
  const { trucks } = useSelector((state) => state.trucks);
  const { assignments } = useSelector((state) => state.assignments);

  useEffect(() => {
    dispatch(fetchDrivers());
    dispatch(fetchTrucks());
    dispatch(fetchAssignments());
  }, [dispatch]);

  return (
    <div className="container mx-auto px-4 py-12 text-center">
      {/* Title */}
      <h1 className="text-4xl font-bold text-gray-800 mb-6">
        Manage Your Assignments
      </h1>

      {/* Cards Container */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
        
        {/* Drivers Card */}
        <Link to="/drivers" className="transform transition hover:scale-105">
          <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between border-l-4 border-blue-500 cursor-pointer">
            <div>
              <h3 className="text-lg font-semibold text-gray-700">Drivers</h3>
              <p className="text-2xl font-bold text-gray-900">{drivers.length}</p>
            </div>
            <FaUsers className="text-4xl text-blue-500" />
          </div>
        </Link>

        {/* Trucks Card */}
        <Link to="/trucks" className="transform transition hover:scale-105">
          <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between border-l-4 border-green-500 cursor-pointer">
            <div>
              <h3 className="text-lg font-semibold text-gray-700">Trucks</h3>
              <p className="text-2xl font-bold text-gray-900">{trucks.length}</p>
            </div>
            <FaTruck className="text-4xl text-green-500" />
          </div>
        </Link>

        {/* Assignments Card */}
        <Link to="/assignments" className="transform transition hover:scale-105">
          <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between border-l-4 border-red-500 cursor-pointer">
            <div>
              <h3 className="text-lg font-semibold text-gray-700">Assignments</h3>
              <p className="text-2xl font-bold text-gray-900">{assignments.length}</p>
            </div>
            <FaClipboardList className="text-4xl text-red-500" />
          </div>
        </Link>

      </div>

      <div className="mt-12">

        {/* Social Icons */}
        <div className="flex justify-center gap-6 mt-10">
          <a
            href="https://github.com/gesser0102"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-700 hover:text-black transition text-4xl"
          >
            <FaGithub />
          </a>

          <a
            href="https://www.linkedin.com/in/rodrigo-gesser-b5277a11a/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 transition text-4xl"
          >
            <FaLinkedin />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Home;
