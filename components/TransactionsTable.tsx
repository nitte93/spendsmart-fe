// components/TransactionsTable.js
import { useState } from "react";

const TransactionsTable = ({
  transactions,
  handleInputChange,
  isSaving,
  saveTransactions,
}) => {
  return (
    <div className="overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full text-xs text-left text-gray-700">
        <thead className="text-xs uppercase bg-gray-200 sticky top-0 z-10">
          <tr>
            <th scope="col" className="py-2 px-2 font-semibold">#</th>
            <th scope="col" className="py-2 px-2 font-semibold">Date</th>
            <th scope="col" className="py-2 px-2 font-semibold">Name</th>
            <th scope="col" className="py-2 px-2 font-semibold">Withdrawn</th>
            <th scope="col" className="py-2 px-2 font-semibold">Deposit</th>
            <th scope="col" className="py-2 px-2 font-semibold">Reference</th>
            <th scope="col" className="py-2 px-2 font-semibold">Balance</th>
            <th scope="col" className="py-2 px-2 font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction, index) => (
            <tr key={transaction.id} className="bg-white border-b hover:bg-gray-100 transition duration-150 ease-in-out">
              <td className="py-0.5 px-2">{index + 1}</td>
              <td className="py-0.5 px-2">
                <input
                  type="date"
                  value={transaction.transaction_date}
                  onChange={(e) => handleInputChange(index, "transaction_date", e.target.value)}
                  className="input input-bordered input-xs w-full max-w-[110px] h-6"
                />
              </td>
              <td className="py-0.5 px-2">
                <input
                  type="text"
                  value={transaction.transaction_name}
                  onChange={(e) => handleInputChange(index, "transaction_name", e.target.value)}
                  className="input input-bordered input-xs w-full h-6"
                />
              </td>
              <td className="py-0.5 px-2">
                <input
                  type="number"
                  value={transaction.withdrawn_amount}
                  onChange={(e) => handleInputChange(index, "withdrawn_amount", e.target.value)}
                  className="input input-bordered input-xs w-full max-w-[90px] h-6"
                />
              </td>
              <td className="py-0.5 px-2">
                <input
                  type="number"
                  value={transaction.deposit_amount}
                  onChange={(e) => handleInputChange(index, "deposit_amount", e.target.value)}
                  className="input input-bordered input-xs w-full max-w-[90px] h-6"
                />
              </td>
              <td className="py-0.5 px-2">
                <input
                  type="text"
                  value={transaction.reference_number}
                  onChange={(e) => handleInputChange(index, "reference_number", e.target.value)}
                  className="input input-bordered input-xs w-full max-w-[110px] h-6"
                />
              </td>
              <td className="py-0.5 px-2">
                <input
                  type="number"
                  value={transaction.closing_balance}
                  onChange={(e) => handleInputChange(index, "closing_balance", e.target.value)}
                  className="input input-bordered input-xs w-full max-w-[90px] h-6"
                />
              </td>
              <td className="py-0.5 px-2">
                <button
                  onClick={() => saveTransactions()}
                  className="btn btn-xs h-6 min-h-0"
                  disabled={isSaving}
                >
                  Save
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionsTable;
