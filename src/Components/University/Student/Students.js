import React, { useState, useEffect, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { useReactTable, getCoreRowModel, getSortedRowModel, getPaginationRowModel, flexRender } from "@tanstack/react-table";
import { FaSearch, FaPlus, FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import AddStudentForm from "./AddStudentForm";
import { AuthContext } from "../../../Hooks/AuthContext";

export default function Students({ universityData }) {
    const auth = useContext(AuthContext);
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [sorting, setSorting] = useState([]);
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 100 });

    const backendURL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8000/api/";

    useEffect(() => {
        const fetchStudents = async () => {
            if (!universityData || !auth.token) return;
            setLoading(true);
            setError(null);

            try {
                const response = await axios.get(`${backendURL}student/getStudents`, {
                    params: {
                        universityId: universityData._id,
                        search: searchTerm,
                        page: pagination.pageIndex + 1,
                        limit: pagination.pageSize
                    },
                    headers: {
                        Authorization: `Bearer ${auth.token}`,
                        "Content-Type": "application/json"
                    }
                });

                setStudents(response.data.students);
                setPagination((prev) => ({
                    ...prev,
                    pageCount: response.data.totalPages || 1
                }));
            } catch (err) {
                console.error("❌ Error fetching students:", err);
                setError("Failed to load students.");
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
    }, [universityData, searchTerm, pagination.pageIndex, pagination.pageSize, auth.token]);

    const addStudent = (newStudent) => {
        setStudents((prev) => [newStudent, ...prev]);
        setShowForm(false);
    };

    // Define table columns
    const columns = useMemo(() => [
        {
            accessorKey: "picture",
            header: "Photo",
            cell: ({ row }) => (
                <img src={row.original.picture || "https://via.placeholder.com/50"} alt="Student" className="w-12 h-12 rounded-full border object-cover" />
            ),
        },
        {
            accessorKey: "preferredName",
            header: "Name",
            cell: ({ row }) => `${row.original.preferredName} ${row.original.lastName}`
        },
        {
            accessorKey: "studentNumber",
            header: "Student ID",
        },
        {
            accessorKey: "email",
            header: "Email",
            cell: ({ row }) => (
                <a href={`mailto:${row.original.email}`} className="text-blue-500 hover:underline">
                    {row.original.email}
                </a>
            ),
        },
        {
            accessorKey: "building",
            header: "Building",
        },
        {
            accessorKey: "floor",
            header: "Floor",
        },
        {
            accessorKey: "room",
            header: "Room",
            cell: ({ row }) => row.original.room || "N/A",
        },
        {
            accessorKey: "entryStatus",
            header: "Entry Status",
            cell: ({ row }) => (
                <span className={`px-2 py-1 rounded-lg text-white ${row.original.entryStatus === "In Room" ? "bg-green-500" : row.original.entryStatus === "Pending" ? "bg-yellow-500" : "bg-red-500"}`}>
                    {row.original.entryStatus}
                </span>
            ),
        },
        {
            accessorKey: "actions",
            header: "Actions",
            cell: ({ row }) => (
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                    onClick={() => navigate(`/student/${row.original.studentNumber}`)}
                >
                    View Profile
                </button>
            ),
        },
    ], []);

    // Create the table instance
    const table = useReactTable({
        data: students,
        columns,
        state: { sorting, pagination },
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        onPaginationChange: setPagination,
    });

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="p-6 font-Poppins">
            <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
                {/* Search Bar */}
                <div className="relative w-full md:w-1/2">
                    <input
                        type="text"
                        placeholder="Search students..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <FaSearch className="absolute right-3 top-3 text-gray-500" />
                </div>
                
                {/* Add Student Button */}
                <button onClick={() => setShowForm(true)} className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-600 transition">
                    <FaPlus /> Add Student
                </button>
            </div>

            {showForm && <AddStudentForm onSave={addStudent} onClose={() => setShowForm(false)} universityData={universityData} />}

            {loading ? (
                <p className="text-center text-gray-500">Loading students...</p>
            ) : error ? (
                <p className="text-center text-red-500">{error}</p>
            ) : students.length === 0 ? (
                <p className="text-center text-gray-500">No students found.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse bg-white rounded-lg shadow-md">
                        <thead className="bg-gray-100">
                            {table.getHeaderGroups().map(headerGroup => (
                                <tr key={headerGroup.id} className="border-b">
                                    {headerGroup.headers.map(header => (
                                        <th
                                            key={header.id}
                                            onClick={header.column.getToggleSortingHandler()}
                                            className="p-4 text-left text-gray-600 font-semibold cursor-pointer"
                                        >
                                            <div className="flex items-center">
                                                {header.column.columnDef.header}
                                                {header.column.getIsSorted() === "asc" ? <FaSortUp className="ml-2" /> :
                                                    header.column.getIsSorted() === "desc" ? <FaSortDown className="ml-2" /> :
                                                        <FaSort className="ml-2 opacity-50" />}
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody className="divide-y">
                            {table.getRowModel().rows.map(row => (
                                <tr key={row.id} className="hover:bg-gray-50">
                                    {row.getVisibleCells().map(cell => (
                                        <td key={cell.id} className="p-4 text-gray-700">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </motion.div>
    );
}
