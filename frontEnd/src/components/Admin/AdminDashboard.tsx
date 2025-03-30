import React, { useEffect, useState } from "react";
import Navbar from "../Navbar";
import AdminListTable from "./DashTable";
import { Toaster } from "react-hot-toast";
import axios from "axios";
import AdminBarWeekklyChart from "./BarChart";
import { MDBIcon } from "mdb-react-ui-kit";
import "../../index.css";
import { FaArrowDown91 } from "react-icons/fa6";
import { FaSortNumericUp } from "react-icons/fa";
import DoughnutChart from "./PieChart";
import LineChart from "./LineChart";
const AdminDashboard: React.FC = () => {
  const [lastWeekTransactions, setLastWeekTransactions] = useState([]);
  const [lastMonthTransactions, setLastMonthTransactions] = useState([]);
  const [mostPurchasedMeals, setMostPurchasedMeals] = useState({});
  const [transactions, setTransactions] = useState([]); // Adjust based on your state structure
  const [todayTransactions, setTodayTransactions] = useState([]);
  const [prevDay, SetPrevDay] = useState("");
  const [weeklyData, setWeeklyData] = useState({ labels: [], data: [] });
  const [DailyData, setDailyData] = useState({ labels: [], data: [] });
  const [prevWeek, SetPrevWeek] = useState("");
  const [prevMonth, SetPrevMonth] = useState("");

  useEffect(() => {
    const getTransactionData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/gettransaction");
        const data = res?.data;
        setTransactions(data?.transactions);
        getWeeklyData(data?.transactions);
        getDailyData(data?.transactions);
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
      }
    };
    getTransactionData();
  }, []);
  console.log(DailyData, "Daily Data");

  const getWeekNumber = (date) => {
    const startDate = new Date(date.getFullYear(), 0, 1);
    const days = Math.floor((date - startDate) / (24 * 60 * 60 * 1000));
    return Math.ceil((days + startDate.getDay() + 1) / 7);
  };
  const getDailyData = (transactions) => {
    const dailyData = {};

    transactions.forEach((transaction) => {
      const date = new Date(transaction.createdAt).toISOString().split("T")[0]; // Format as YYYY-MM-DD

      if (!dailyData[date]) {
        dailyData[date] = 0; // Initialize daily total
      }

      dailyData[date] += transaction.totalprice; // Sum total price for the day
    });

    const labels = Object.keys(dailyData);
    const data = Object.values(dailyData);
    setDailyData({ labels, data });
  };

  const getWeeklyData = (transactions) => {
    const weeklyData = {};

    transactions?.forEach((transaction) => {
      const date = new Date(transaction.createdAt);
      const year = date.getFullYear();
      const weekNumber = getWeekNumber(date);
      const weekKey = `${year}-W${weekNumber}`;

      if (!weeklyData[weekKey]) {
        weeklyData[weekKey] = 0; // Initialize the week total
      }

      weeklyData[weekKey] += transaction.totalprice; // Sum the total price for the week
    });

    const labels = Object.keys(weeklyData);
    const data = Object.values(weeklyData);
    setWeeklyData({ labels, data });
  };

  const calculatePercentageChange = (currentTotal, previousTotal) => {
    if (previousTotal === 0) return currentTotal > 0 ? 100 : 0;
    return ((currentTotal - previousTotal) / previousTotal) * 100;
  };

  useEffect(() => {
    if (transactions.length > 0) {
      const today = new Date();

      // --- Filter transactions for today ---
      const todayStart = new Date(today);
      todayStart.setHours(0, 0, 0, 0);
      const todayEnd = new Date(today);
      todayEnd.setHours(23, 59, 59, 999);

      const todayFiltered = transactions.filter((transaction) => {
        const createdAt = new Date(transaction.createdAt);
        return createdAt >= todayStart && createdAt <= todayEnd;
      });
      setTodayTransactions(todayFiltered);

      // --- Filter transactions for the previous day ---
      const prevDayStart = new Date(today);
      prevDayStart.setDate(today.getDate() - 1);
      prevDayStart.setHours(0, 0, 0, 0);
      const prevDayEnd = new Date(today);
      prevDayEnd.setDate(today.getDate() - 1);
      prevDayEnd.setHours(23, 59, 59, 999);

      const prevDayFiltered = transactions.filter((transaction) => {
        const createdAt = new Date(transaction.createdAt);
        return createdAt >= prevDayStart && createdAt <= prevDayEnd;
      });

      // --- Calculate today's percentage change ---
      const todayTotal = calculateTotal(todayFiltered);
      const prevDayTotal = calculateTotal(prevDayFiltered);
      const todayPercentageChange = calculatePercentageChange(
        todayTotal,
        prevDayTotal
      );
      SetPrevDay(todayPercentageChange.toFixed(2));

      // --- Filter transactions for the last week ---
      const lastWeekStart = new Date(today);
      lastWeekStart.setDate(today.getDate() - 7);

      const lastWeekFiltered = transactions.filter((transaction) => {
        const createdAt = new Date(transaction.createdAt);
        return createdAt >= lastWeekStart && createdAt <= today;
      });
      setLastWeekTransactions(lastWeekFiltered);

      // --- Filter transactions for the previous week ---
      const prevWeekStart = new Date(lastWeekStart);
      prevWeekStart.setDate(lastWeekStart.getDate() - 7);
      const prevWeekEnd = new Date(lastWeekStart);
      prevWeekEnd.setDate(lastWeekStart.getDate() - 1);

      const prevWeekFiltered = transactions.filter((transaction) => {
        const createdAt = new Date(transaction.createdAt);
        return createdAt >= prevWeekStart && createdAt <= prevWeekEnd;
      });

      // --- Calculate weekly percentage change ---
      const lastWeekTotal = calculateTotal(lastWeekFiltered);
      const prevWeekTotal = calculateTotal(prevWeekFiltered);
      const weeklyPercentageChange = calculatePercentageChange(
        lastWeekTotal,
        prevWeekTotal
      );
      SetPrevWeek(weeklyPercentageChange.toFixed(2));

      // --- Filter transactions for the last month ---
      const lastMonthStart = new Date(today);
      lastMonthStart.setMonth(today.getMonth() - 1);

      const lastMonthFiltered = transactions?.filter((transaction) => {
        const createdAt = new Date(transaction.createdAt);
        return createdAt >= lastMonthStart && createdAt <= today;
      });
      setLastMonthTransactions(lastMonthFiltered);

      // --- Filter transactions for the previous month ---
      const prevMonthStart = new Date(lastMonthStart);
      prevMonthStart.setMonth(lastMonthStart.getMonth() - 1);
      const prevMonthEnd = new Date(lastMonthStart);
      prevMonthEnd.setDate(0); // Last day of the previous month

      const prevMonthFiltered = transactions?.filter((transaction) => {
        const createdAt = new Date(transaction.createdAt);
        return createdAt >= prevMonthStart && createdAt <= prevMonthEnd;
      });

      // --- Calculate monthly percentage change ---
      const lastMonthTotal = calculateTotal(lastMonthFiltered);
      const prevMonthTotal = calculateTotal(prevMonthFiltered);
      const monthlyPercentageChange = calculatePercentageChange(
        lastMonthTotal,
        prevMonthTotal
      );
      SetPrevMonth(monthlyPercentageChange);
    }
    // Count most purchased meals
    const mealCount = {};
    transactions?.forEach((transaction) => {
      transaction.cartItems?.forEach((item) => {
        if (mealCount[item.mealName]) {
          mealCount[item.mealName] += item.quantity;
        } else {
          mealCount[item.mealName] = item.quantity;
        }
      });
    });
    setMostPurchasedMeals(mealCount);
  }, [transactions]);

  // Calculate total amount for last week and last month
  const calculateTotal = (transactions) => {
    return transactions.reduce(
      (total, transaction) => total + transaction.totalprice,
      0
    );
  };
  return (
    <div className="flex flex-col min-h-screen bg-slate-900">
      <Navbar />
      <Toaster />
      <div className="flex flex-col mt-20 p-5">
        <h1 className="text-4xl text-orange-400 text-start hover:scale-105 transition-transform">
          Admin Dashboard
        </h1>

        <div className="grid grid-cols-3 gap-4 text-white mt-5 mb-10">
          <div className="bg-gray-800 p-4 rounded-lg shadow-lg flex flex-col items-start justify-between">
            <div className="">
              <h2 className="text-xl font-bold">
                <MDBIcon fas icon="money-check-alt" />
                Today's Transactions
              </h2>
            </div>
            <div className="">
              <p>Total Transactions: {todayTransactions.length}</p>
              <p>
                Total Amount: ₹ {calculateTotal(todayTransactions).toFixed(2)}
              </p>
              <p
                className={`flex items-center gap-1 ${
                  prevDay >= 0 ? "text-green-400" : "text-red-500"
                }`}
              >
                {prevDay >= 0 ? (
                  <FaSortNumericUp color="green" />
                ) : (
                  <FaArrowDown91 color="red" />
                )}
                {prevDay}%
              </p>
            </div>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg shadow-lg flex flex-col gap-4 items-start justify-between">
            <div className="">
              <h2 className="text-xl font-bold">Weekly Transactions</h2>
            </div>
            <div className="">
              <p>Total Transactions: {lastWeekTransactions.length}</p>
              <p>
                Total Amount: ₹{" "}
                {calculateTotal(lastWeekTransactions).toFixed(2)}
              </p>
              <p
                className={`flex items-center gap-1 ${
                  prevWeek >= 0 ? "text-green-400" : "text-red-500"
                }`}
              >
                {prevWeek >= 0 ? (
                  <FaSortNumericUp color="green" />
                ) : (
                  <FaArrowDown91 color="red" />
                )}
                {prevWeek}%
              </p>
            </div>
          </div>

          <div className="bg-gray-800 p-4 rounded-lg shadow-lg flex flex-col items-start justify-between">
            <div className="">
              <h2 className="text-xl font-bold">Monthly Transactions</h2>
            </div>
            <div className="">
              <p>Total Transactions: {lastMonthTransactions.length}</p>
              <p>
                Total Amount: ₹{" "}
                {calculateTotal(lastMonthTransactions).toFixed(2)}
              </p>
              <p
                className={`flex items-center gap-1 ${
                  prevMonth >= 0 ? "text-green-400" : "text-red-400"
                }`}
              >
                {prevMonth >= 0 ? (
                  <FaSortNumericUp color="green" />
                ) : (
                  <FaArrowDown91 color="red" />
                )}
                {prevMonth}%
              </p>
            </div>
          </div>
          {/* <div className="bg-gray-800 p-4 rounded-lg shadow-lg flex flex-col items-start justify-between">
            <div className="">
              <h2 className="text-xl font-bold">Most Purchased Meals</h2>
            </div>
            <div className="flex">
              <ul>
                {Object.entries(mostPurchasedMeals)
                  .sort(([, countA], [, countB]) => countB - countA) // Sort by count in descending order
                  .slice(0, 3) // Take the top 3
                  .map(([mealName, count]) => (
                    <li key={mealName}>
                      {mealName}: {count} times,
                    </li>
                  ))}
              </ul>
            </div>
          </div> */}
        </div>

        <div className="flex items-center justify-between gap-5">
          <div className="">
            <AdminListTable transactions={transactions} />
          </div>
          <div className="barchat-css">
            <AdminBarWeekklyChart
              labels={weeklyData.labels}
              data={weeklyData.data}
            />
          </div>
        </div>
        <div className="flex items-center justify-between gap-5 mt-5">
          <div className="barchat-css">
            <LineChart label={DailyData.labels} datas={DailyData.data} />
          </div>
          <div className="barchat-css-pie">
            <DoughnutChart datas={mostPurchasedMeals} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
