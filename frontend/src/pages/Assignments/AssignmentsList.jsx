import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchAssignments, deleteAssignment } from "../../features/assignmentsSlice";
import { Link } from "react-router-dom";
import { FaTrash, FaEdit, FaPlus } from "react-icons/fa";
import Loader from "../../components/Loader";

const AssignmentsList = () => {
  const dispatch = useDispatch();
  const { assignments, status } = useSelector((state) => state.assignments);

  const [selectedDate, setSelectedDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchAssignments());
    }
  }, [status, dispatch]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this assignment?")) {
      dispatch(deleteAssignment(id));
    }
  };

  // Show Loader when status is "loading"
  if (status === "loading") return <Loader />;

  // Filter assignments by selected date
  const filteredAssignments = selectedDate
    ? assignments.filter((assignment) => assignment.date === selectedDate)
    : assignments;

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAssignments = filteredAssignments.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredAssignments.length / itemsPerPage);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Assignments</h2>

      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <Link
          to="/assignments/new"
          className="bg-green-500 text-white px-4 py-2 inline-flex items-center rounded hover:bg-green-600 transition"
        >
          <FaPlus className="mr-2" /> Add Assignment
        </Link>

        {/* Modern Date Input (without icon) */}
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-full sm:w-56 px-4 py-2 border border-gray-400 rounded-lg shadow-sm text-gray-700 
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          placeholder="Filter by date"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto mt-4">
        <table className="w-full border border-gray-500 rounded-lg shadow-md bg-gray-200">
          <thead>
            <tr className="bg-gray-700 text-white border border-gray-500">
              <th className="border border-gray-500 px-4 py-3 w-1/4">Driver</th>
              <th className="border border-gray-500 px-4 py-3 w-1/4">Truck</th>
              <th className="border border-gray-500 px-4 py-3 w-1/4">Date</th>
              <th className="border border-gray-500 px-4 py-3 w-1/4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentAssignments.map((assignment, index) => (
              <tr
                key={assignment.id}
                className={`text-center border border-gray-500 ${
                  index % 2 === 0 ? "bg-gray-300" : "bg-gray-400"
                } hover:bg-gray-500 transition`}
                style={{ height: "50px" }}
              >
                <td className="border border-gray-500 px-4 font-medium">{assignment.driver_name}</td>
                <td className="border border-gray-500 px-4 font-medium">{assignment.truck_plate}</td>
                <td className="border border-gray-500 px-4 font-medium">{assignment.date}</td>
                <td className="border border-gray-500 px-4">
                  <div className="flex justify-center space-x-2">
                    <Link to={`/assignments/edit/${assignment.id}`}>
                      <button className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition cursor-pointer">
                        <FaEdit />
                      </button>
                    </Link>
                    <button
                      onClick={() => handleDelete(assignment.id)}
                      className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition cursor-pointer"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredAssignments.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center p-4">No assignments found</td>
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
                  ? "bg-green-600 text-white font-bold border-2 border-green-700"
                  : "bg-gray-300 text-gray-700 hover:bg-gray-400"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AssignmentsList;
