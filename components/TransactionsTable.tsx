// components/TransactionsTable.js
import { useState } from "react";

const TransactionsTable = ({
  transactions,
  handleInputChange,
  isSaving,
  saveTransactions,
}) => {
  return (
    <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th scope="col" className="py-3 px-6">
              Transaction Date
            </th>
            <th scope="col" className="py-3 px-6">
              Transaction Name
            </th>
            <th scope="col" className="py-3 px-6">
              Withdrawn Amount
            </th>
            <th scope="col" className="py-3 px-6">
              Deposit Amount
            </th>
            <th scope="col" className="py-3 px-6">
              Reference Number
            </th>
            <th scope="col" className="py-3 px-6">
              Closing Balance
            </th>
            <th scope="col" className="py-3 px-6">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction, index) => (
            <tr key={transaction.id} className="bg-white border-b">
              <td className="py-4 px-6">
                <input
                  type="date"
                  value={transaction.transaction_date}
                  onChange={(e) =>
                    handleInputChange(index, "transaction_date", e.target.value)
                  }
                  className="input input-bordered input-sm w-full"
                />
              </td>
              <td className="py-4 px-6">
                <input
                  type="text"
                  value={transaction.transaction_name}
                  onChange={(e) =>
                    handleInputChange(index, "transaction_name", e.target.value)
                  }
                  className="input input-bordered input-sm w-full"
                />
              </td>
              <td className="py-4 px-6">
                <input
                  type="number"
                  value={transaction.withdrawn_amount}
                  onChange={(e) =>
                    handleInputChange(index, "withdrawn_amount", e.target.value)
                  }
                  className="input input-bordered input-sm w-full"
                />
              </td>
              <td className="py-4 px-6">
                <input
                  type="number"
                  value={transaction.deposit_amount}
                  onChange={(e) =>
                    handleInputChange(index, "deposit_amount", e.target.value)
                  }
                  className="input input-bordered input-sm w-full"
                />
              </td>
              <td className="py-4 px-6">
                <input
                  type="text"
                  value={transaction.reference_number}
                  onChange={(e) =>
                    handleInputChange(index, "reference_number", e.target.value)
                  }
                  className="input input-bordered input-sm w-full"
                />
              </td>
              <td className="py-4 px-6">
                <input
                  type="number"
                  value={transaction.closing_balance}
                  onChange={(e) =>
                    handleInputChange(index, "closing_balance", e.target.value)
                  }
                  className="input input-bordered input-sm w-full"
                />
              </td>
              <td className="py-4 px-6">
                <button
                  onClick={() => saveTransactions()}
                  className="btn btn-sm"
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
