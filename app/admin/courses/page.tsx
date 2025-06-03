"use client";

import { useEffect, useState } from "react";
import axios, { getAdapter } from "axios";
import Swal from "sweetalert2";
import { toast } from "sonner";
import { getCourseDetails } from "@/queries/courses";

interface CourseType {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  thumbnail?: string;
  instructor: {
    _id: string;
    name: string;
    email: string;
  };
   category?: {
    _id: string;
    title: string;
  };
  modules?: {
    _id: string;
    title: string;
   
  }[];
  status: boolean;
  isApproved: boolean;
  createdOn: string;
}

const ListCourses = () => {
  const [selectedCourse, setSelectedCourse] = useState<CourseType | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [courses, setCourses] = useState<CourseType[]>([]);
  console.log("courses", courses);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    const res = await axios.get<CourseType[]>("/api/admin/courses");
    setCourses(res.data);
  };

  const handleApprove = async (courseId: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to approve this course?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, approve it!",
    });

    if (result.isConfirmed) {
      try {
        await axios.put("/api/admin/courses", { courseId });
        toast.success("Course approved successfully");
        fetchCourses();
      } catch (err: any) {
        toast.error(err?.response?.data?.message || "Approval failed");
      }
    }
  };
  const viewCourseDetails = (id: string) => {
    const course = courses.find((c) => c.id === id);
    console.log('viewcourse',course)
    if (course) {
      setSelectedCourse(course);
      setShowModal(true);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Course Management</h1>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Title</th>
            <th className="p-2 border">Instructor</th>
            <th className="p-2 border">Created On</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => (
            <tr key={course.id} className="text-center">
              <td className="p-2 border">{course.title}</td>
              <td className="p-2 border">
                {course.instructor?.name} ({course.instructor?.email})
              </td>
              <td className="p-2 border">
                {new Date(course.createdOn).toLocaleDateString()}
              </td>
              <td className="p-2 border">
                {course.isApproved ? (
                  <span className="text-green-600 font-semibold">Approved</span>
                ) : (
                  <span className="text-red-600 font-semibold">Pending</span>
                )}
              </td>
              {/* <td className="p-2 border">
                {!course.status && (
                  <button
                    className="px-3 py-1 bg-blue-600 text-white rounded"
                    onClick={() => handleApprove(course.id)}
                  >
                    Approve
                  </button>
                )}
              </td> */}
              <td className="p-2 border space-x-2">
    <button
      className="px-3 py-1 bg-gray-600 text-white rounded"
      onClick={() => viewCourseDetails(course.id)}
    >
      View
    </button>
    {!course.isApproved && (
      <button
        className="px-3 py-1 bg-blue-600 text-white rounded"
        onClick={() => handleApprove(course.id)}
      >
        Approve
      </button>
    )}
  </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* ✅ Modal goes here */}
      {showModal && selectedCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-[90%] max-w-2xl">
            <h2 className="text-xl font-bold mb-2">{selectedCourse.title}</h2>
            <p className="mb-2 text-gray-700">{selectedCourse.description}</p>
            {selectedCourse.thumbnail && (
              <img
                src={`/assets/images/courses/${selectedCourse.thumbnail}`}
                alt="Course thumbnail"
                className="w-[300px] h-[180px] object-cover rounded mb-4"
              />
            )}
          <p className="text-sm mb-1">
  <strong>Instructor:</strong> {selectedCourse.instructor.name} ({selectedCourse.instructor.email})
</p>

{selectedCourse.category && (
  <p className="text-sm mb-2">
    <strong>Category:</strong> {selectedCourse.category.title}
  </p>
)}

{selectedCourse.modules && selectedCourse.modules.length > 0 && (
  <div className="mt-3">
    <h3 className="font-semibold text-lg mb-2">Modules</h3>
    <ul className="list-disc list-inside space-y-1">
      {selectedCourse.modules.map((mod) => (
        <li key={mod._id}>
          <strong>{mod.title}</strong>
         
        </li>
      ))}
    </ul>
  </div>
)}
            <button className="mt-4 px-4 py-2 bg-red-500 text-white rounded" onClick={() => setShowModal(false)} >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListCourses;
