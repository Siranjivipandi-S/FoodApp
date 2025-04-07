import { useState, useEffect } from "react";
import axios from "axios";
import {
  ChevronDown,
  ChevronUp,
  Package,
  Clock,
  User,
  Mail,
  Calendar,
  IndianRupee,
} from "lucide-react";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import Navbar from "../Navbar";

// Define TypeScript interfaces for our data
interface CartItem {
  _id: string;
  mealName: string;
  mealThumb: string;
  quantity: number;
  price: number;
}

interface Transaction {
  _id: string;
  username: string;
  email: string;
  totalprice: number;
  cartItems: CartItem[];
  createdAt: string;
}

const OrderTracking = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(5); // Set the number of items per page
  const [totalItems, setTotalItems] = useState<number>(0);

  useEffect(() => {
    const getTransactionData = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get("http://localhost:5000/Ordertransaction", {
          params: {
            page: currentPage,
            limit: itemsPerPage,
          },
        });
        const data = res?.data?.transactions;
        const total = res?.data?.totalItems;

        setTransactions(data);
        setTotalItems(total);
        setError(null);
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
        setError("Failed to load transactions. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    getTransactionData();
  }, [currentPage]);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex justify-center items-center bg-slate-800 text-white p-6">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-white border-r-transparent align-[-0.125em]"></div>
          <p className="mt-4">Loading transactions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto p-6 relative bg-slate-800 text-white min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto p-4">
        <div className="flex items-start justify-start gap-4 mt-20">
          <Package className="w-10 h-10 mr-3 mt-5" />
          <h1 className="text-4xl font-bold text-center mt-5 text-orange-400">
            Order Tracking
          </h1>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-white p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {transactions.length === 0 && !isLoading && !error ? (
          <div className="bg-slate-700 rounded-lg p-10 text-center shadow-lg border border-slate-600">
            <Package className="w-12 h-12 mx-auto mb-4 text-slate-400" />
            <p className="text-xl text-slate-300">No transactions found.</p>
            <p className="mt-2 text-slate-400">
              Your order history will appear here once you make a purchase.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-10 w-full mt-10">
            {transactions.map((transaction, index) => (
              <Card
                key={transaction._id}
                className="bg-slate-700 border-slate-600 overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-slate-900/50"
              >
                <div className="p-5">
                  <div className="flex flex-wrap justify-between items-start gap-10">
                    <div className="space-y-1">
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-2 text-slate-400" />
                        <h2 className="text-xl font-semibold text-white">
                          {transaction.username}
                        </h2>
                      </div>
                      <div className="flex items-center text-slate-300">
                        <Mail className="w-4 h-4 mr-2 text-slate-400" />
                        <p>{transaction.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 gap-5">
                      <Badge className="bg-green-500/20 text-green-300 hover:bg-green-500/30 border-green-500/50">
                        <IndianRupee className="w-3.5 h-3.5 mr-1" />₹
                        {transaction.totalprice.toFixed(2)}
                      </Badge>

                      <Badge className="bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 border-blue-500/50">
                        <Calendar className="w-3.5 h-3.5 mr-1" />
                        {formatDate(transaction.createdAt)}
                      </Badge>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleAccordion(index)}
                    className="mt-4 w-full flex items-center justify-between p-3 rounded-md bg-slate-600/50 hover:bg-slate-600 transition-colors"
                  >
                    <span className="font-medium flex items-center">
                      <Package className="w-4 h-4 mr-2" />
                      {transaction.cartItems.length}{" "}
                      {transaction.cartItems.length === 1 ? "Item" : "Items"}
                    </span>
                    {openIndex === index ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </button>

                  {openIndex === index && (
                    <div className="mt-4 space-y-4 bg-slate-800 rounded-md p-4 border border-slate-600">
                      <h3 className="text-lg font-semibold flex items-center">
                        <Clock className="w-4 h-4 mr-2" />
                        Order Items
                      </h3>
                      <ul className="flex flex-col gap-2 w-full mb-2">
                        {transaction.cartItems.map((item) => (
                          <li
                            key={item._id}
                            className="flex items-center mt-2 justify-between bg-slate-700 rounded-md overflow-hidden border border-slate-600"
                          >
                            <div className="flex items-center w-full">
                              <div className="w-10 h-10 flex-shrink-0 bg-slate-800 overflow-hidden ml-5">
                                <img
                                  src={
                                    item.mealThumb ||
                                    "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1"
                                  }
                                  alt={item.mealName}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src =
                                      "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1";
                                  }}
                                />
                              </div>
                              <div className="p-3">
                                <p className="text-white font-medium">
                                  {item.mealName}
                                </p>
                                <div className="flex items-center mt-1">
                                  <Badge className="bg-slate-600 text-slate-300 px-4 py-2">
                                    Qty: {item.quantity}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            <div className="p-4 text-right">
                              <p className="text-white font-bold">
                                ₹{item.price.toFixed(2)}
                              </p>
                            </div>
                          </li>
                        ))}
                      </ul>

                      <div className="pt-3 border-t border-slate-600">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-300">Total</span>
                          <span className="text-lg font-bold text-white">
                            ₹{transaction.totalprice.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}

        <div className="mt-8 flex justify-center items-center gap-4">
          {/* Previous Button */}
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 text-white bg-slate-700/60 rounded-md disabled:bg-slate-600/60 backdrop-blur-md shadow-lg transition-all hover:bg-slate-300"
          >
            Previous
          </button>

          {/* Numeric Pagination Buttons */}
          <div className="flex gap-2">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                className={`px-4 py-2 rounded-md text-white bg-slate-700/60 backdrop-blur-md shadow-lg transition-all hover:bg-slate-700/80 
          ${
            currentPage === index + 1
              ? "bg-slate-700/80 border-2 border-orange-400" // Active button styling
              : ""
          }`}
              >
                {index + 1}
              </button>
            ))}
          </div>

          {/* Next Button */}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 text-white bg-slate-700/60 rounded-md disabled:bg-slate-600/60 backdrop-blur-md shadow-lg transition-all hover:bg-slate-700/80"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
