import { useMemo, useState, useEffect } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";
import { Box } from "@mui/material";

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
        Cell: ({ cell }) => `₹${cell.getValue<number>()}`,
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
    enableColumnFilters: false,
    // Apply dark theme directly using Material-React-Table's theme props
    enableRowVirtualization: false,
    muiTablePaperProps: {
      sx: { boxShadow: "none" },
    },
    muiTableContainerProps: {
      sx: {
        backgroundColor: "rgb(30, 41, 59)", // slate-800
      },
    },
    muiTableBodyProps: {
      sx: {
        backgroundColor: "rgb(30, 41, 59)", // slate-800
      },
    },
    muiTableBodyRowProps: {
      sx: {
        backgroundColor: "rgb(30, 41, 59) !important", // slate-800 with !important
        "&:hover": {
          backgroundColor: "rgb(51, 65, 85) !important", // slate-700 with !important
        },
        // Force all child cells to inherit background
        "& > td": {
          backgroundColor: "inherit !important",
          color: "white !important",
        },
      },
    },
    muiTableBodyCellProps: {
      sx: {
        backgroundColor: "rgb(30, 41, 59) !important", // slate-800 with !important
        color: "white !important",
        borderBottom: "1px solid rgba(148, 163, 184, 0.2)",
      },
    },
    muiTableHeadProps: {
      sx: {
        backgroundColor: "rgb(15, 23, 42)", // slate-900
      },
    },
    muiTableHeadCellProps: {
      sx: {
        backgroundColor: "rgb(15, 23, 42) !important", // slate-900 with !important
        color: "white !important",
        borderBottom: "1px solid rgba(148, 163, 184, 0.2)",
        fontWeight: "bold",
      },
    },
    muiBottomToolbarProps: {
      sx: {
        backgroundColor: "rgb(30, 41, 59)", // slate-800
        color: "white",
      },
    },
    muiTopToolbarProps: {
      sx: {
        backgroundColor: "rgb(30, 41, 59)", // slate-800
        color: "white",
      },
    },
    // Style the pagination controls
    muiPaginationProps: {
      sx: {
        color: "white !important",
        ".MuiPaginationItem-root": {
          color: "white !important",
        },
      },
    },
    // Style the table pagination component
    muiTablePaginationProps: {
      sx: {
        color: "white !important",
        "& .MuiSelect-root": {
          color: "white !important",
        },
        "& .MuiSelect-icon": {
          color: "white !important",
        },
        "& .MuiInputBase-root": {
          color: "white !important",
        },
        "& .MuiTablePagination-selectLabel": {
          color: "white !important",
        },
        "& .MuiTablePagination-displayedRows": {
          color: "white !important",
        },
        "& .MuiTablePagination-actions": {
          color: "white !important",
        },
      },
    },
  });

  // Add a CSS reset to override any internal styles
  return (
    <Box
      sx={{
        "& .MuiPaper-root": { backgroundColor: "rgb(30, 41, 59) !important" },
        "& .MuiTableCell-root": {
          backgroundColor: "rgb(30, 41, 59) !important",
          color: "white !important",
        },
        "& .MuiTableCell-head": {
          backgroundColor: "rgb(15, 23, 42) !important",
          color: "white !important",
        },
        "& .MuiTableRow-root": {
          backgroundColor: "rgb(30, 41, 59) !important",
        },
        "& .MuiIconButton-root": { color: "white !important" },
        "& .MuiSelect-icon": { color: "white !important" },
        "& .MuiSvgIcon-root": { color: "white !important" },
        "& .MuiInputBase-root": { color: "white !important" },
        "& .MuiTablePagination-root": { color: "white !important" },
        "& .MuiToolbar-root": {
          color: "white !important",
          backgroundColor: "rgb(30, 41, 59) !important",
        },
        "& .MuiSelect-select": { color: "white !important" },
        "& .MuiTablePagination-selectLabel": { color: "white !important" },
        "& .MuiTablePagination-displayedRows": { color: "white !important" },
        "& .MuiTablePagination-actions": { color: "white !important" },
        // Target the menu items in the rows per page dropdown
        "& .MuiMenu-paper": {
          backgroundColor: "rgb(30, 41, 59) !important",
        },
        "& .MuiMenuItem-root": {
          color: "white !important",
          "&:hover": {
            backgroundColor: "rgb(51, 65, 85) !important",
          },
        },
      }}
    >
      <MaterialReactTable table={table} />
    </Box>
  );
};

export default AdminListTable;
