import React, { useEffect, useState } from "react";
import Navbar from "../Navbar";
import AdminListTable from "./DashTable";
import { Toaster } from "react-hot-toast";
import axios from "axios";
import AdminBarWeekklyChart from "./BarChart";
import { MDBIcon } from "mdb-react-ui-kit";
import "../../index.css";
import {
  FaArrowDown,
  FaArrowUp,
  FaChartLine,
  FaUsers,
  FaCalendarAlt,
  FaDatabase,
  FaUtensilSpoon,
} from "react-icons/fa";
import DoughnutChart from "./PieChart";
import LineChart from "./LineChart";

const AdminDashboard: React.FC = () => {
  const [lastWeekTransactions, setLastWeekTransactions] = useState([]);
  const [lastMonthTransactions, setLastMonthTransactions] = useState([]);
  const [mostPurchasedMeals, setMostPurchasedMeals] = useState({});
  const [transactions, setTransactions] = useState([]);
  const [todayTransactions, setTodayTransactions] = useState([]);
  const [prevDay, setPrevDay] = useState("");
  const [weeklyData, setWeeklyData] = useState({ labels: [], data: [] });
  const [dailyData, setDailyData] = useState({ labels: [], data: [] });
  const [prevWeek, setPrevWeek] = useState("");
  const [prevMonth, setPrevMonth] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);

  useEffect(() => {
    const getTransactionData = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get("http://localhost:5000/gettransaction");
        const data = res?.data;
        setTransactions(data?.transactions);
        getWeeklyData(data?.transactions);
        getDailyData(data?.transactions);

        // Calculate overall metrics
        setTotalOrders(data?.transactions.length);
        const revenue = data?.transactions.reduce(
          (total, tx) => total + tx.totalprice,
          0
        );
        setTotalRevenue(revenue);

        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
        setIsLoading(false);
      }
    };
    getTransactionData();
  }, []);

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

    // Sort dates chronologically
    const sortedDates = Object.keys(dailyData).sort();
    const labels = sortedDates;
    const data = sortedDates.map((date) => dailyData[date]);

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

    // Sort weeks chronologically
    const sortedWeeks = Object.keys(weeklyData).sort();
    const labels = sortedWeeks;
    const data = sortedWeeks.map((week) => weeklyData[week]);

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
      setPrevDay(todayPercentageChange.toFixed(2));

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
      setPrevWeek(weeklyPercentageChange.toFixed(2));

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
      setPrevMonth(monthlyPercentageChange.toFixed(2));
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

  // Calculate total amount for transactions
  const calculateTotal = (transactions) => {
    return transactions.reduce(
      (total, transaction) => total + transaction.totalprice,
      0
    );
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Get current date and time
  const currentDate = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const currentTime = new Date().toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-950 to-slate-900">
      <Navbar />
      <Toaster position="top-right" />

      {isLoading ? (
        <div className="flex items-center justify-center h-screen">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-t-4 border-b-4 border-orange-500 rounded-full animate-spin"></div>
            <p className="mt-4 text-white text-xl">Loading dashboard data...</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col mt-20 p-5 lg:p-8">
          {/* Header with greeting and date */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                <span className="bg-gradient-to-r from-orange-400 to-red-500 text-transparent bg-clip-text">
                  Admin Dashboard
                </span>
              </h1>
              <p className="text-slate-400">
                {currentDate} • {currentTime}
              </p>
            </div>

            {/* <div className="mt-4 md:mt-0 flex space-x-2">
              <button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 shadow-lg flex items-center">
                <FaDatabase className="mr-2" /> Export Data
              </button>
              <button className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 shadow-lg flex items-center">
                <FaUsers className="mr-2" /> Manage Users
              </button>
            </div> */}
          </div>

          {/* Navigation tabs */}
          {/* <div className="flex mb-6 bg-slate-800 rounded-xl p-1 w-fit">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                activeTab === "overview"
                  ? "bg-gradient-to-r from-orange-500 to-red-500 text-white"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                activeTab === "orders"
                  ? "bg-gradient-to-r from-orange-500 to-red-500 text-white"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              Orders
            </button>
            <button
              onClick={() => setActiveTab("analytics")}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                activeTab === "analytics"
                  ? "bg-gradient-to-r from-orange-500 to-red-500 text-white"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              Analytics
            </button>
          </div> */}

          {/* KPI Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Revenue Card */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-lg p-6 border border-slate-700 hover:border-orange-500/30 transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-slate-400 text-sm font-medium">
                    Total Revenue
                  </p>
                  <h3 className="text-3xl font-bold text-white mt-1">
                    {formatCurrency(totalRevenue)}
                  </h3>
                </div>
                <div className="bg-orange-500/20 p-3 rounded-lg">
                  <FaChartLine className="text-orange-500 text-xl" />
                </div>
              </div>
              <div className="flex items-center text-sm">
                <span
                  className={`flex items-center ${
                    prevMonth >= 0 ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {prevMonth >= 0 ? (
                    <FaArrowUp className="mr-1" />
                  ) : (
                    <FaArrowDown className="mr-1" />
                  )}
                  {Math.abs(prevMonth).toFixed(1)}%
                </span>
                <span className="text-slate-400 ml-2">vs. last month</span>
              </div>
            </div>

            {/* Today's Transactions Card */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-lg p-6 border border-slate-700 hover:border-orange-500/30 transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-slate-400 text-sm font-medium">
                    Today's Sales
                  </p>
                  <h3 className="text-3xl font-bold text-white mt-1">
                    {formatCurrency(calculateTotal(todayTransactions))}
                  </h3>
                </div>
                <div className="bg-teal-500/20 p-3 rounded-lg">
                  <FaCalendarAlt className="text-teal-500 text-xl" />
                </div>
              </div>
              <div className="flex items-center text-sm">
                <span
                  className={`flex items-center ${
                    prevDay >= 0 ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {prevDay >= 0 ? (
                    <FaArrowUp className="mr-1" />
                  ) : (
                    <FaArrowDown className="mr-1" />
                  )}
                  {Math.abs(parseFloat(prevDay)).toFixed(1)}%
                </span>
                <span className="text-slate-400 ml-2">vs. yesterday</span>
              </div>
            </div>

            {/* Weekly Transactions Card */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-lg p-6 border border-slate-700 hover:border-orange-500/30 transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-slate-400 text-sm font-medium">
                    Weekly Sales
                  </p>
                  <h3 className="text-3xl font-bold text-white mt-1">
                    {formatCurrency(calculateTotal(lastWeekTransactions))}
                  </h3>
                </div>
                <div className="bg-purple-500/20 p-3 rounded-lg">
                  <FaChartLine className="text-purple-500 text-xl" />
                </div>
              </div>
              <div className="flex items-center text-sm">
                <span
                  className={`flex items-center ${
                    prevWeek >= 0 ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {prevWeek >= 0 ? (
                    <FaArrowUp className="mr-1" />
                  ) : (
                    <FaArrowDown className="mr-1" />
                  )}
                  {Math.abs(parseFloat(prevWeek)).toFixed(1)}%
                </span>
                <span className="text-slate-400 ml-2">vs. last week</span>
              </div>
            </div>

            {/* Total Orders Card */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-lg p-6 border border-slate-700 hover:border-orange-500/30 transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-slate-400 text-sm font-medium">
                    Total Orders
                  </p>
                  <h3 className="text-3xl font-bold text-white mt-1">
                    {totalOrders}
                  </h3>
                </div>
                <div className="bg-blue-500/20 p-3 rounded-lg">
                  <FaUtensilSpoon className="text-blue-500 text-xl" />
                </div>
              </div>
              <div className="flex items-center text-sm">
                <span className="text-slate-400">Lifetime orders</span>
              </div>
            </div>
          </div>

          {/* Charts and Tables Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Weekly Revenue Chart */}
            <div className="lg:col-span-2 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 shadow-lg border border-slate-700">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">Weekly Revenue</h2>
                {/* <div className="flex bg-slate-700 rounded-lg p-1">
                  <button className="px-3 py-1 text-sm rounded-md bg-orange-500 text-white">
                    Week
                  </button>
                  <button className="px-3 py-1 text-sm rounded-md text-slate-400 hover:text-white">
                    Month
                  </button>
                  <button className="px-3 py-1 text-sm rounded-md text-slate-400 hover:text-white">
                    Year
                  </button>
                </div> */}
              </div>
              <div className="h-64">
                <AdminBarWeekklyChart
                  labels={weeklyData.labels}
                  data={weeklyData.data}
                />
              </div>
            </div>

            {/* Top Selling Items */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 shadow-lg border border-slate-700">
              <h2 className="text-xl font-bold text-white mb-6">
                Top Products
              </h2>
              <div className="h-64 flex items-center justify-center">
                <DoughnutChart datas={mostPurchasedMeals} />
              </div>
            </div>
          </div>

          {/* Daily Revenue Chart */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 shadow-lg border border-slate-700 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">
                Daily Revenue Trend
              </h2>
            </div>
            <div className="h-64">
              <LineChart label={dailyData.labels} datas={dailyData.data} />
            </div>
          </div>

          {/* Recent Transactions Table */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 shadow-lg border border-slate-700">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">
                Recent Transactions
              </h2>
            </div>
            <div className="overflow-x-auto">
              <AdminListTable transactions={transactions} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
