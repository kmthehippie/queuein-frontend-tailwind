import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useApiPrivate from "../../hooks/useApiPrivate";
import moment from "moment";
import {
  primaryBgClass,
  primaryTextClass,
  primaryButtonClass as buttonClass,
  secondaryBgClass,
  primaryBgTransparentClass,
} from "../../styles/tailwind_styles";

const Customers = () => {
  const { accountId } = useParams();
  const apiPrivate = useApiPrivate();
  const [customers, setCustomers] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);

  useEffect(() => {
    console.log("Type of page: ", typeof currentPage, currentPage);
    const fetchCustomers = async () => {
      try {
        console.log("Type of page: ", typeof currentPage);
        const res = await apiPrivate.get(
          `/customerInfo/${accountId}?page=${parseInt(currentPage)}&limit=10`
        );
        if (res?.data) {
          console.log("Fetched customers:", res.data);
          setCustomers(res.data.customers);
          setTotalPages(Math.max(1, Number(res.data.totalPages) || 1));
          setTotalCustomers(parseInt(res.data.totalCustomers));
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, [currentPage, accountId, apiPrivate]);

  const Pagination = () => {
    return (
      <div className="px-6 py-4 flex items-center justify-between border-t border-stone-200">
        <div className="flex-1 flex justify-between sm:hidden">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`relative inline-flex justify-center px-4 py-2 border border-stone-300 text-sm font-medium rounded-md ${buttonClass} max-w-[100px] hover:bg-stone-50 disabled:bg-stone-100 disabled:text-stone-400`}
          >
            Previous
          </button>
          <div
            className={`text-xs ${primaryTextClass} flex items-center justify-center`}
          >
            Showing {currentPage} of {totalPages} Pages
          </div>

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className={`relative inline-flex justify-center px-4 py-2 border border-stone-300 text-sm font-medium rounded-md ${buttonClass} max-w-[100px] hover:bg-stone-50 disabled:bg-stone-100 disabled:text-stone-400`}
          >
            Next
          </button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:flex-col sm:items-center sm:justify-between">
          <div>
            <p className={`text-sm ${primaryTextClass}`}>
              Showing page <span className="font-medium">{currentPage}</span> of{" "}
              <span className="font-medium">{totalPages}</span> results
            </p>
          </div>
          <br />
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
              {totalPages > 0 &&
                [...Array(totalPages)].map((_, idx) => (
                  <button
                    key={idx + 1}
                    onClick={() => setCurrentPage(idx + 1)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      currentPage === idx + 1
                        ? `z-10 bg-primary-light-green border-primary-green text-stone-100 dark:text-stone-800 hover:bg-primary-green`
                        : `bg-stone-500 dark:bg-stone-200 border-stone-300 text-stone-200 dark:text-stone-500 hover:bg-stone-50`
                    } ${idx === 0 ? "rounded-l-md" : ""} ${
                      idx === totalPages - 1 ? "rounded-r-md" : ""
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
            </nav>
          </div>
        </div>
      </div>
    );
  };

  if (customers !== null) {
    return (
      <div
        className={`p-2 sm:p-5 w-full lg:border-2 lg:border-primary-green rounded-3xl ${primaryBgTransparentClass} lg:mt-10`}
      >
        <div className="mb-3 mt-3 lg:my-3">
          <h1 className="text-2xl lg:text-4xl font-bold text-center">
            VIP List
          </h1>
        </div>
        <div className="text-xs lg:text-center">
          <h2
            className={`font-semibold ${primaryTextClass} uppercase tracking-wider mb-2`}
          >
            Current Total VIPs: <span>{totalCustomers}</span>
          </h2>
        </div>
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full">
            <div className={`${primaryBgTransparentClass} py-4`}>
              <table className="min-w-full divide-y divide-stone-200">
                <thead>
                  <tr>
                    <th
                      className={`px-4 lg:px-6 py-3 text-left lg:text-center text-xs lg:text-sm font-semibold ${primaryTextClass} uppercase tracking-wider`}
                    >
                      Name
                    </th>
                    <th
                      className={`px-4 lg:px-6 py-3 text-left lg:text-center text-xs lg:text-sm font-semibold ${primaryTextClass} uppercase tracking-wider`}
                    >
                      Contact Number
                    </th>
                    <th
                      className={`px-4 lg:px-6 py-3 text-left lg:text-center text-xs lg:text-sm font-semibold ${primaryTextClass} uppercase tracking-wider`}
                    >
                      VIP Since
                    </th>
                  </tr>
                </thead>
                <tbody
                  className={`${primaryBgTransparentClass} ${primaryTextClass} divide-y divide-stone-200`}
                >
                  {customers.map((customer) => (
                    <tr
                      key={customer.id}
                      className={`hover:bg-stone-50 hover:text-stone-700 ${primaryTextClass} transition-colors duration-200`}
                    >
                      <td
                        className={`px-4 lg:px-6 py-3 text-xs lg:text-sm whitespace-nowrap`}
                      >
                        <div className="flex items-center space-x-2 lg:justify-center">
                          <span className="truncate">{customer.name}</span>
                          {customer.VIP && (
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-primary-light-green text-white whitespace-nowrap`}
                            >
                              VIP
                            </span>
                          )}
                        </div>
                      </td>
                      <td
                        className={`px-4 lg:px-6 py-3 text-xs lg:text-center lg:text-sm  whitespace-nowrap`}
                      >
                        {customer.number}
                      </td>
                      <td
                        className={`px-4 lg:px-6 py-3 text-xs lg:text-center lg:text-sm whitespace-nowrap`}
                      >
                        {moment(customer.createdAt).format("DD MMM YYYY")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Pagination />
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default Customers;
