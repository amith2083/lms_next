"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { toast } from "sonner";

interface UserType {
  _id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  isVerified: boolean;
  doc: string;
  isBlocked: boolean;
}

const ListUsers = () => {
  const [users, setUsers] = useState<UserType[]>([]);
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const res = await axios.get<UserType[]>("/api/users");
    setUsers(res.data);
  };

  // const toggleBlock = async (userId: string, isBlocked: boolean) => {
  //   await axios.put("/api/admin/users_block_unblock", {
  //     userId,
  //     block: !isBlocked,
  //   });
  //   fetchUsers(); // Refresh the list
  // };
  const toggleBlock = async (userId: string, isBlocked: boolean) => {
    try {
      await axios.put("/api/admin/users_block_unblock", {
        userId,
        block: !isBlocked,
      });
      toast.success(
        `User ${!isBlocked ? "blocked" : "unblocked"} successfully`
      );
      fetchUsers(); // Refresh the list
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Failed to update user status"
      );
    }
  };

  const handleApprove = async (userId: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to approve this user?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, approve it!",
    });
    // await axios.put("/api/admin/users/approve", {
    //   userId,
    // });
    // fetchUsers(); // Refresh the list
    if (result.isConfirmed) {
      try {
        await axios.put("/api/admin/users_approval", { userId });
        toast.success("User approved successfully");
        fetchUsers();
      } catch (err: any) {
        toast.error(err?.response?.data?.message || "Approval failed");
      }
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Role</th>
            <th className="p-2 border">Document</th> 
            <th className="p-2 border">Verification</th>
            <th className="p-2 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {users?.map((user) => {
            const isBlocked = user?.isBlocked;
            return (
              <tr key={user._id} className="text-center">
                <td className="p-2 border">{user?.name}</td>
                <td className="p-2 border">{user?.email}</td>
                <td className="p-2 border">{user?.role}</td>
                <td className="p-2 border">
                  {user.doc ? (
                    <a
                      href={`/uploads/verifications/${user.doc}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      View
                    </a>
                  ) : (
                    <span className="text-gray-400">N/A</span>
                  )}
                </td>
                <td className="p-2 border">
                  {user.isVerified ? (
                    <button
                      className="px-3 py-1 rounded bg-green-600 text-white"
                      disabled
                    >
                      Approved
                    </button>
                  ) : (
                    <button
                      className="px-3 py-1 rounded bg-blue-600 text-white"
                      onClick={() => handleApprove(user._id)}
                    >
                      Approve
                    </button>
                  )}
                </td>
                <td className="p-2 border">
                  <button
                    className={`px-4 py-1 rounded text-white ${
                      isBlocked ? "bg-green-600" : "bg-red-600"
                    }`}
                    onClick={() => toggleBlock(user._id, isBlocked)}
                  >
                    {isBlocked ? "Unblock" : "Block"}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
export default ListUsers;
