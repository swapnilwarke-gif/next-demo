"use client";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Profile() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.post("/api/user/profile");
        setUserData(res.data.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProfile();
  }, []);

  if (!userData) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-semibold text-center mb-6">Profile</h1>

        <div className="flex justify-between py-3 border-b">
          <span className="text-gray-500 font-medium">Name</span>
          <span className="text-gray-900">{userData.name}</span>
        </div>

        <div className="flex justify-between py-3 border-b">
          <span className="text-gray-500 font-medium">Email</span>
          <span className="text-gray-900">{userData.email}</span>
        </div>

        {/* <div className="flex justify-between py-3">
          <span className="text-gray-500 font-medium">Age</span>
          <span className="text-gray-900">{userData.age}</span>
        </div> */}
      </div>
    </div>
  );
}
