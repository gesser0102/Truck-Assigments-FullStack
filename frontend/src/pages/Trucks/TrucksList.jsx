import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTrucks } from "../../features/trucksSlice";
import { openDeleteModal } from "../../features/deleteConfirmationSlice";
import { Link } from "react-router-dom";
import { FaTrash, FaEdit, FaPlus } from "react-icons/fa";
import Loader from "../../components/Loader";
import DeleteConfirmation from "../../components/DeleteConfirmation";

const ListTrucks = () => {
  const dispatch = useDispatch();
  const { trucks, status } = useSelector((state) => state.trucks);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchTrucks());
    }
  }, [status, dispatch]);

  // Show Loader when status is "loading"
  if (status === "loading") return <Loader />;

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTrucks = trucks.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(trucks.length / itemsPerPage);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Trucks List</h2>

      <Link
        to="/trucks/new"
        className="bg-green-500 text-white px-4 py-2 mb-4 inline-flex items-center rounded hover:bg-green-600 transition"
      >
        <FaPlus className="mr-2" /> Add Truck
      </Link>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-500 rounded-lg shadow-md bg-gray-200">
          <thead>
            <tr className="bg-gray-700 text-white border border-gray-500">
              <th className="border border-gray-500 px-4 py-3 w-1/4">Plate</th>
              <th className="border border-gray-500 px-4 py-3 w-1/4">Min License Type</th>
              <th className="border border-gray-500 px-4 py-3 w-1/4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentTrucks.map((truck, index) => (
              <tr
                key={truck.id}
                className={`text-center border border-gray-500 ${
                  index % 2 === 0 ? "bg-gray-300" : "bg-gray-400"
                } hover:bg-gray-500 transition`}
                style={{ height: "50px" }}
              >
                <td className="border border-gray-500 px-4 font-medium">{truck.plate}</td>
                <td className="border border-gray-500 px-4 font-medium">{truck.min_license_type}</td>
                <td
                  className="border border-gray-500 px-4"
                  style={{ height: "40px", minWidth: "120px" }}
                >
                  <div className="flex justify-center space-x-2">
                    <Link to={`/trucks/edit/${truck.id}`}>
                      <button className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition cursor-pointer">
                        <FaEdit />
                      </button>
                    </Link>
                    <button
                      onClick={() => dispatch(openDeleteModal({ id: truck.id, type: "truck" }))}
                      className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition cursor-pointer"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {trucks.length === 0 && (
              <tr>
                <td colSpan="3" className="text-center p-4">No trucks found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center space-x-2 mt-4">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-4 py-2 rounded transition ${
                currentPage === i + 1
                  ? "bg-green-500 text-white"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmation />
    </div>
  );
};

export default ListTrucks;
