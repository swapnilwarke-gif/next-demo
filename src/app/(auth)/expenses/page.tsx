"use client";
import axios from "axios";
import { useEffect, useState } from "react";
export default function Expense() {
  const [expense, setExpenseData] = useState([]);

  useEffect(() => {
    const fetchExpense = async () => {
      try {
        debugger
        const res = await axios.get("/api/expense/get-expense");
        setExpenseData(res.data.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchExpense();
  }, []);

  return (
    <div className="max-w-xl mx-auto space-y-3">
      {expense.map((item) => (
        <div
          key={item.id}
          className="flex justify-between bg-white p-4 rounded shadow"
        >
          <span className="font-medium">{item.title}</span>
          <span className="text-gray-700">₹{item.amount}</span>
        </div>
      ))}
    </div>
  );
}
