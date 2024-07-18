import React, { useEffect, useState } from 'react';
import CanvasJSReact from '@canvasjs/react-charts';
import { data } from './Data';
import './App.css';

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

function App() {
  const [myData, setMyData] = useState(data);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    setMyData(data);
  }, []);

  const searchByName = (term) => {
    if (term === "") {
      setMyData(data);
    } else {
      const filteredCustomers = data.customers.filter((customer) =>
        customer.name.toLowerCase().includes(term.toLowerCase())
      );
      setMyData({ ...data, customers: filteredCustomers });
    }
  };

  const searchByAmount = (term) => {
    if (term === "") {
      setMyData(data);
    } else {
      const filteredTransactions = data.transactions.filter((transaction) =>
        transaction.amount.toString().includes(term)
      );
      setMyData({ ...data, transactions: filteredTransactions });
    }
  };

  const handleCustomerSelect = (customerId) => {
    setSelectedCustomer(data.customers.find(customer => customer.id === customerId)?.name);
    const customerTransactions = data.transactions.filter(
      (transaction) => transaction.customer_id === customerId
    );

    const transactionAmountsPerDay = customerTransactions.reduce((acc, transaction) => {
      const date = new Date(transaction.date).toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = 0;
      }
      acc[date] += transaction.amount;
      return acc;
    }, {});

    const chartDataPoints = Object.entries(transactionAmountsPerDay).map(([date, amount]) => ({
      x: new Date(date),
      y: amount,
    }));

    setChartData(chartDataPoints);
  };

  const chartOptions = {
    animationEnabled: true,
    theme: "light2",
    title: {
      text: `Total Transaction Amount Per Day for Customer ${selectedCustomer}`
    },
    axisX: {
      valueFormatString: "YYYY-MM-DD"
    },
    axisY: {
      title: "Total Transaction Amount",
      prefix: "$"
    },
    data: [{
      type: "line",
      xValueFormatString: "YYYY-MM-DD",
      yValueFormatString: "$#,##0.00",
      dataPoints: chartData
    }]
  };

  return (
    <div className="bg-indigo-700 text-white p-6 min-h-screen">
      <h1>Bills Details</h1>
      <br />
      <br />
      <div className="flex flex-col bg-indigo-600 lg:flex-row justify-between">
        <div className="mx-auto lg:w-1/2 mb-6 lg:mb-0">
          <h1 className="text-white text-2xl mb-4">Customers</h1>
          <label
            htmlFor="default-search"
            className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
          >
            Search by Name
          </label>
          <div className="relative mx-3">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              type="search"
              onChange={(e) => searchByName(e.target.value)}
              id="default-search"
              className="block mt-7 w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Search by Name"
              required
            />
          </div>

          <div className="grid grid-cols-2 mt-5 gap-4 mb-8">
            <h3 className="font-bold">Name</h3>
            <h3 className="font-bold">ID</h3>
            {myData.customers.map((customer) => (
              <React.Fragment key={customer.id}>
                <p className="text-white cursor-pointer" onClick={() => handleCustomerSelect(customer.id)}>{customer.name}</p>
                <p className="text-white">{customer.id}</p>
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="mx-auto">
          <h1 className="text-white text-2xl mb-4">Transactions</h1>
          <label
            htmlFor="amount-search"
            className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
          >
            Search by Amount
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              type="search"
              onKeyUp={(e) => searchByAmount(e.target.value)}
              id="amount-search"
              className="block my-7 w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Search by Amount"
              required
            />
          </div>

          <div className="grid h-[50vh] overflow-y-scroll bg-indigo-500 p-2 rounded-md mt-[-8px] grid-cols-4 gap-4">
            <h3 className="font-bold">Customer ID</h3>
            <h3 className="font-bold">Date</h3>
            <h3 className="font-bold">Amount</h3>
            <h3 className="font-bold">Transaction ID</h3>
            {myData.transactions.map((transaction) => (
              <React.Fragment key={transaction.id}>
                <p>{transaction.customer_id}</p>
                <p>{transaction.date}</p>
                <p>{transaction.amount}</p>
                <p>{transaction.id}</p>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-9">
        <h2 className="text-3xl bg-indigo-500 rounded-md p-2 mt-11 mb-8">
          Click on user name above to show Graph
        </h2>
        <CanvasJSChart options={chartOptions} />
      </div>
    </div>
  );
}

export default App;


