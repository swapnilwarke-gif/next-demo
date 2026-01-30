"use client";
import React, { useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function LoginPage() {
  const [user, setUser] = React.useState({
    password: "",
    email: "",
  });
  const [loading, setLoading] = React.useState(false);
  const [buttonDisabled, setButtonDisabled] = React.useState(false);
  const router = useRouter();

  const logIn = async () => {
    try {
      debugger;
      setLoading(true);
      const userData: any = {
        email: user.email,
        password: user.password,
      };
      const response = await axios.post("api/auth/login", userData);
      
      if (response.data?.success == true) {
        // setUser({
        //   username: "",
        //   password: "",
        //   email: "",
        // });
        router.push("/profile");
      }

    } catch (error: any) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };
useEffect(() => {
    if (
      user.email.length > 0 &&
      user.password.length > 0 
    ) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user]);
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="w-full max-w-md bg-gray-800 p-8 rounded-xl shadow-lg">
        <h1 className="text-center text-white text-2xl font-semibold mb-6">
          {loading ? "processign" : "logIn"}
        </h1>

        <div className="space-y-4">
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={user.email}
              placeholder="Enter email"
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              className="w-full px-4 py-2 rounded-md bg-gray-700 text-white 
                         border border-gray-600 focus:outline-none 
                         focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={user.password}
              placeholder="Enter password"
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              className="w-full px-4 py-2 rounded-md bg-gray-700 text-white 
                         border border-gray-600 focus:outline-none 
                         focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Button */}
          <button
            className="w-full mt-4 py-2 bg-blue-600 text-white font-medium
                       rounded-md hover:bg-blue-700 transition duration-200"
            onClick={logIn}
          >
            {buttonDisabled ? "No logIn" : "logIn"}
          </button>
        </div>
      </div>
    </div>
  );
}
