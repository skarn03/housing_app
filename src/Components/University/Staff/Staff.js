// Staff.jsx
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getPaginationRowModel,
    flexRender,
} from "@tanstack/react-table";
import {
    FaUserTie,
    FaEnvelope,
    FaUserShield,
    FaSort,
    FaSortUp,
    FaSortDown,
    FaPlus,
    FaTimes,
} from "react-icons/fa";
import { AuthContext } from "../../../Hooks/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

// Import your form:
import AddStaffForm from "./AddStaffForm";

export default function Staff({universityData}) {
    const auth = useContext(AuthContext);
    const [staffList, setStaffList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sorting, setSorting] = useState([]);
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });
    const [showAddStaffForm, setShowAddStaffForm] = useState(false);

    const backendURL =
        process.env.REACT_APP_BACKEND_URL || "http://localhost:8000/api/";

    useEffect(() => {
        const fetchStaff = async () => {
            try {
                const response = await axios.get(`${backendURL}staff/university`, {
                    headers: {
                        Authorization: `Bearer ${auth.token}`,
                        "Content-Type": "application/json",
                    },
                });
                setStaffList(response.data);
            } catch (err) {
                setError("Failed to load staff members.");
            } finally {
                setLoading(false);
            }
        };

        fetchStaff();
    }, [auth.token, backendURL]);

    // Columns for React Table
    const columns = [
        {
            accessorKey: "name",
            header: "Name",
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <FaUserTie className="text-blue-500 text-lg" />
                    <span>
                        {row.original.firstName} {row.original.lastName}
                    </span>
                </div>
            ),
        },
        {
            accessorKey: "role",
            header: "Role",
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <FaUserShield className="text-gray-500 text-lg" />
                    <span>{row.original.role}</span>
                </div>
            ),
        },
        {
            accessorKey: "email",
            header: "Email",
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <FaEnvelope className="text-gray-500 text-lg" />
                    <span>{row.original.email}</span>
                </div>
            ),
        },
    ];

    // Set up TanStack table
    const table = useReactTable({
        data: staffList,
        columns,
        state: { sorting, pagination },
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        onPaginationChange: setPagination,
    });

    return (
        <div className="p-6 bg-white rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">👨‍💼 University Staff</h2>
                <button
                    onClick={() => setShowAddStaffForm(true)}
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:opacity-90 transition"
                >
                    <FaPlus /> Add Staff
                </button>
            </div>

            {/* AnimatePresence helps with unmount/mount animations */}
            <AnimatePresence>
                {showAddStaffForm && (
                    <motion.div
                        className="fixed inset-0 flex items-center justify-center z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        {/* Dark overlay */}
                        <div
                            className="absolute inset-0 bg-black bg-opacity-50"
                            onClick={() => setShowAddStaffForm(false)}
                        ></div>

                        {/* Modal container - we can animate scale or slide */}
                        <motion.div
                            className="relative bg-white w-full max-w-lg mx-auto rounded-2xl shadow-xl overflow-hidden"
                            initial={{ y: -50, opacity: 0, scale: 0.95 }}
                            animate={{ y: 0, opacity: 1, scale: 1 }}
                            exit={{ y: 20, opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                        >
                            {/* Close button */}
                            <button
                                className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
                                onClick={() => setShowAddStaffForm(false)}
                            >
                                <FaTimes size={20} />
                            </button>

                            <AddStaffForm />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {loading ? (
                <p className="text-gray-500 text-center">Loading staff members...</p>
            ) : error ? (
                <p className="text-red-500 text-center">{error}</p>
            ) : staffList.length === 0 ? (
                <p className="text-gray-500 text-center">No staff members found.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse bg-white rounded-lg shadow-md">
                        <thead className="bg-gray-100">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <tr key={headerGroup.id} className="border-b">
                                    {headerGroup.headers.map((header) => (
                                        <th
                                            key={header.id}
                                            onClick={header.column.getToggleSortingHandler()}
                                            className="p-4 text-left text-gray-600 font-semibold cursor-pointer select-none"
                                        >
                                            <div className="flex items-center">
                                                {header.column.columnDef.header}
                                                {header.column.getIsSorted() === "asc" ? (
                                                    <FaSortUp className="ml-2" />
                                                ) : header.column.getIsSorted() === "desc" ? (
                                                    <FaSortDown className="ml-2" />
                                                ) : (
                                                    <FaSort className="ml-2 opacity-50" />
                                                )}
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody className="divide-y">
                            {table.getRowModel().rows.map((row) => (
                                <tr key={row.id} className="hover:bg-gray-50 transition">
                                    {row.getVisibleCells().map((cell) => (
                                        <td key={cell.id} className="p-4 text-gray-700">
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
