import { useSelector, useDispatch } from "react-redux";
import { closeDeleteModal } from "../features/deleteConfirmationSlice";
import { deleteTruck } from "../features/trucksSlice"; 
import { deleteDriver } from "../features/driversSlice"; 
import { deleteAssignment } from "../features/assignmentsSlice"; 
import { FaExclamationTriangle } from "react-icons/fa";

const DeleteConfirmation = () => {
  const dispatch = useDispatch();
  const { isOpen, idToDelete, deleteType } = useSelector((state) => state.deleteConfirmation);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (deleteType === "truck") {
      dispatch(deleteTruck(idToDelete));
    } else if (deleteType === "driver") {
      dispatch(deleteDriver(idToDelete));
    } else if (deleteType === "assignment") {
      dispatch(deleteAssignment(idToDelete));
    }
    dispatch(closeDeleteModal());
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <div className="flex items-center justify-center">
          <FaExclamationTriangle className="text-red-500 text-3xl" />
        </div>
        <h2 className="text-xl font-bold text-center mt-2">Confirm Deletion</h2>
        <p className="text-gray-600 text-center mt-2">
          Are you sure you want to delete this item? This action cannot be undone.
        </p>
        <div className="flex justify-center mt-4 space-x-4">
          <button
            onClick={handleConfirm}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
          >
            Yes, Delete
          </button>
          <button
            onClick={() => dispatch(closeDeleteModal())}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmation;
