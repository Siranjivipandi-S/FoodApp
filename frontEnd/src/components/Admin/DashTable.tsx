import { useMemo, useState, useEffect } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";

interface Transaction {
  _id: string;
  username: string;
  email: string;
  totalprice: number;
  cartItems: {
    id: string;
    mealName: string;
    quantity: number;
    price: number;
    mealThumb: string;
    _id: string;
  }[];
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  __v: number;
}

interface AdminListTableProps {
  transactions: Transaction[];
}

const AdminListTable = ({ transactions }: AdminListTableProps) => {
  const [tableData, setTableData] = useState<any[]>([]);

  useEffect(() => {
    if (Array.isArray(transactions) && transactions.length > 0) {
      const formattedData = transactions
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ) // Sort in descending order
        .map((transaction) => ({
          username: transaction.username,
          email: transaction.email,
          totalPrice: transaction.totalprice,
          orderAt: new Date(transaction.createdAt).toLocaleString("en-IN", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }),
          noOfItems: transaction.cartItems.reduce(
            (total, item) => total + item.quantity,
            0
          ),
        }));

      setTableData(formattedData);
    }
  }, [transactions]);

  // Define columns for the table
  const columns = useMemo<MRT_ColumnDef<any>[]>(
    () => [
      {
        accessorKey: "username",
        header: "Username",
        size: 150,
      },
      {
        accessorKey: "email",
        header: "Email",
        size: 200,
      },
      {
        accessorKey: "orderAt",
        header: "Order At",
        size: 200,
      },
      {
        accessorKey: "noOfItems",
        header: "Number of Items",
        size: 150,
      },
      {
        accessorKey: "totalPrice",
        header: "Total Price (Rs.)",
        size: 150,
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data: tableData,
    initialState: {
      pagination: { pageSize: 5 },
    },
  });

  return <MaterialReactTable table={table} />;
};

export default AdminListTable;
