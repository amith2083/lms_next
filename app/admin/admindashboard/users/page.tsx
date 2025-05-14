'use client'
import { useEffect, useState } from "react";
import axios from "axios";

interface UserType {
  _id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

 const ListUsers=()=> {
  const [users, setUsers] = useState<UserType[]>([]);
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const res = await axios.get<UserType[]>("/api/users");
    setUsers(res.data);
  };
  console.log('users',users)

  const toggleBlock = async (userId: string, isBlocked: boolean) => {
    await axios.put("/api/users/block", {
      userId,
      block: !isBlocked,
    });
    fetchUsers(); // Refresh the list
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
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {users?.map((user) => {
            const isBlocked = user?.status === "blocked";
            return (
              <tr key={user._id} className="text-center">
                <td className="p-2 border">{user?.name}</td>
                <td className="p-2 border">{user?.email}</td>
                <td className="p-2 border">{user?.role}</td>
                <td className="p-2 border">{user?.status}</td>
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
}
 export default ListUsers