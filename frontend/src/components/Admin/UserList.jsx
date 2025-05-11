import React, { useEffect, useState } from "react";
import api from "../../services/api.js";
import { DataGrid } from "@mui/x-data-grid";
import toast from "react-hot-toast";
import { Blocks } from "react-loader-spinner";
import moment from "moment";
import { Link } from "react-router-dom";
import { MdOutlineEmail } from "react-icons/md";
import { MdDateRange } from "react-icons/md";
import { motion } from "framer-motion";

//Material ui data grid has used for the table
//initialize the columns for the tables and (field) value is used to show data in a specific column dynamically
export const userListsColumns = [
  {
    field: "username",
    headerName: "UserName",
    minWidth: 200,
    headerAlign: "center",
    disableColumnMenu: true,
    align: "center",
    editable: false,
    headerClassName: "font-semibold border",
    cellClassName: "font-normal border",
    renderHeader: (params) => <span className="text-center">UserName</span>,
  },

  {
    field: "email",
    headerName: "Email",
    aligh: "center",
    width: 260,
    editable: false,
    headerAlign: "center",
    headerClassName: "font-semibold text-center border",
    cellClassName: "font-normal border text-center",
    align: "center",
    disableColumnMenu: true,
    renderHeader: (params) => <span>Email</span>,
    renderCell: (params) => {
      return (
        <div className="flex items-center justify-center gap-1">
          <span>
            <MdOutlineEmail className="text-indigo-600 dark:text-indigo-400 text-lg" />
          </span>
          <span>{params?.row?.email}</span>
        </div>
      );
    },
  },
  {
    field: "created",
    headerName: "Created At",
    headerAlign: "center",
    width: 220,
    editable: false,
    headerClassName: "font-semibold border",
    cellClassName: "font-normal border",
    align: "center",
    disableColumnMenu: true,
    renderHeader: (params) => <span>Created At</span>,
    renderCell: (params) => {
      return (
        <div className="flex justify-center items-center gap-1">
          <span>
            <MdDateRange className="text-indigo-600 dark:text-indigo-400 text-lg" />
          </span>
          <span>{params?.row?.created}</span>
        </div>
      );
    },
  },
  {
    field: "status",
    headerName: "Status",
    headerAlign: "center",
    align: "center",
    width: 200,
    editable: false,
    disableColumnMenu: true,
    headerClassName: "font-semibold border",
    cellClassName: "font-normal border",
    renderHeader: (params) => <span className="ps-10">Status</span>,
    renderCell: (params) => {
      return (
        <span
          className={`px-3 py-1 rounded-full text-sm ${
            params.value === "Active"
              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
              : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
          }`}
        >
          {params.value}
        </span>
      );
    },
  },
  {
    field: "action",
    headerName: "Action",
    headerAlign: "center",
    editable: false,
    headerClassName: "font-semibold",
    cellClassName: "font-normal",
    sortable: false,
    width: 200,
    renderHeader: (params) => <span>Action</span>,
    renderCell: (params) => {
      return (
        <Link
          to={`/admin/users/${params.id}`}
          className="h-full flex items-center justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 flex justify-center items-center h-9 rounded-md shadow-sm hover:shadow-md transition-all font-semibold"
          >
            View Details
          </motion.button>
        </Link>
      );
    },
  },
];

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    const fetchUsers = async () => {
      try {
        const response = await api.get("/admin/getusers");
        const usersData = Array.isArray(response.data) ? response.data : [];
        setUsers(usersData);
      } catch (err) {
        setError(err?.response?.data?.message);
        toast.error("Error fetching users", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const rows = users.map((item) => {
    const formattedDate = moment(item.createdDate).format(
      "MMMM DD, YYYY, hh:mm A"
    );

    return {
      id: item.userId,
      username: item.userName,
      email: item.email,
      created: formattedDate,
      status: item.enabled ? "Active" : "Inactive",
    };
  });

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center p-8 text-center"
      >
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 w-full max-w-2xl">
          <div className="flex items-center">
            <svg
              className="h-6 w-6 text-red-500 mr-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <h3 className="text-lg font-medium text-red-800">Error</h3>
          </div>
          <div className="mt-2 text-red-700">
            <p>{error}</p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.location.reload()}
          className="mt-4 px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all font-semibold"
        >
          Try Again
        </motion.button>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 p-4 sm:p-6">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="py-6 sm:py-8 text-center"
      >
        <span className="inline-block text-sm font-semibold bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 px-4 py-1 rounded-full mb-4">
          Admin Dashboard
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent mb-4">
          All Users
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Manage and view details of all registered users
        </p>
      </motion.div>
      {/* Stats Section */}
      {!loading && rows.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-4xl mx-auto mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-md border border-indigo-100 dark:border-indigo-900/30 flex flex-col items-center">
              <div className="text-2xl sm:text-3xl mb-2">👥</div>
              <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
                {rows.length}
              </p>
              <p className="text-gray-600 dark:text-gray-400">Total Users</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-md border border-indigo-100 dark:border-indigo-900/30 flex flex-col items-center">
              <div className="text-2xl sm:text-3xl mb-2">✅</div>
              <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
                {rows.filter((row) => row.status === "Active").length}
              </p>
              <p className="text-gray-600 dark:text-gray-400">Active Users</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-md border border-indigo-100 dark:border-indigo-900/30 flex flex-col items-center">
              <div className="text-2xl sm:text-3xl mb-2">⏸️</div>
              <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
                {rows.filter((row) => row.status === "Inactive").length}
              </p>
              <p className="text-gray-600 dark:text-gray-400">Inactive Users</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Data Grid Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="max-w-7xl mx-auto bg-gray-50 dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden"
      >
        <div className="overflow-x-auto w-full mx-auto">
          {loading ? (
            <div className="flex flex-col justify-center items-center h-72">
              <span className="mb-4">
                <Blocks
                  height="70"
                  width="70"
                  color="#6366F1"
                  ariaLabel="blocks-loading"
                  wrapperStyle={{}}
                  wrapperClass="blocks-wrapper"
                  visible={true}
                />
              </span>
              <span className="text-gray-600 dark:text-gray-400">
                Loading user data...
              </span>
            </div>
          ) : (
            <DataGrid
              className="w-fit mx-auto"
              rows={rows}
              columns={userListsColumns}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 6,
                  },
                },
              }}
              sx={{
                "& .MuiDataGrid-root": {
                  backgroundColor: "#f3f4f6", // light gray background for the entire grid
                  color: "inherit",
                },
                "& .MuiDataGrid-main": {
                  backgroundColor: "#f3f4f6", // light gray background
                },
                "& .MuiDataGrid-cell, & .MuiDataGrid-columnHeader": {
                  color: "inherit",
                  backgroundColor: "#e5e7eb", // Light gray for cells (Tailwind gray-200)
                  borderColor: "#d1d5db", // Slightly darker gray for borders (Tailwind gray-300)
                },
                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor: "#9ca3af", // Medium gray for headers (Tailwind gray-400)
                  fontWeight: "bold",
                },
                "& .MuiDataGrid-footerContainer": {
                  backgroundColor: "#e5e7eb", // Light gray for footer (Tailwind gray-200)
                },
                "& .MuiDataGrid-row": {
                  backgroundColor: "#e5e7eb", // Default light gray for rows (Tailwind gray-200)
                },
                "& .MuiDataGrid-row:hover": {
                  backgroundColor: "#d1d5db", // Darker gray on hover (Tailwind gray-300)
                },
                "& .MuiDataGrid-row:nth-of-type(even)": {
                  backgroundColor: "#d1d5db", // Slightly darker gray for alternating rows (Tailwind gray-300)
                },
                border: "none", // Keep borderless table
                "& .MuiDataGrid-cell:focus, & .MuiDataGrid-columnHeader:focus":
                  {
                    outline: "none", // Preserve focus behavior
                  },
                "& .MuiTablePagination-root": {
                  color: "inherit", // Preserve pagination text color
                  backgroundColor: "#e5e7eb", // Light gray for pagination
                },
                "& .MuiButtonBase-root": {
                  color: "inherit", // Preserve button colors
                },
              }}
              disableRowSelectionOnClick
              pageSizeOptions={[6]}
              disableColumnResize
            />
          )}
        </div>
      </motion.div>

      {/* Empty state */}
      {!loading && rows.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <div className="bg-gray-50 dark:bg-gray-800 max-w-md mx-auto p-8 rounded-xl shadow-md border border-indigo-100 dark:border-indigo-900/30">
            <div className="text-5xl mb-4">📋</div>
            <h3 className="text-xl font-semibold mb-2 bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
              No Users Found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              There are currently no registered users in the system.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg shadow-md font-semibold"
            >
              Refresh
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default UserList;
