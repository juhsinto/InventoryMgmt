import React from "react";
import { getItemHistory } from "../api/item";
import { useSuspenseQuery } from "@tanstack/react-query";

interface ItemHistoryProps {
  id: string;
}

const ItemHistory: React.FC<ItemHistoryProps> = ({ id }) => {
  const { data: itemHistory } = useSuspenseQuery({
    queryKey: ["itemHistory", id],
    queryFn: () => getItemHistory(id!),
  });

  return (
    <div className="text-black">
      <div className="overflow-x-auto">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Timestamp
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                User
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Quantity Before
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Quantity After
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Low Stock Before
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Low Stock After
              </th>
            </tr>
          </thead>
          <tbody>
            {itemHistory.length < 1 ? (
              <tr>
                <td colSpan={6} className="text-center py-4 text-black">
                  No data available
                </td>
              </tr>
            ) : (
              itemHistory.map((item, index) => (
                <tr key={index}>
                  <td className="text-black px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    {item.timestamp}
                  </td>
                  <td className="text-black px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    {item.user}
                  </td>
                  <td className="text-black px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    {item.quantity_before !== null ? item.quantity_before : "-"}
                  </td>
                  <td className="text-black px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    {item.quantity_after !== null ? item.quantity_after : "-"}
                  </td>
                  <td className="text-black px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    {item.low_stock_before !== null
                      ? item.low_stock_before
                        ? "Yes"
                        : "No"
                      : "-"}
                  </td>
                  <td className="text-black px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    {item.low_stock_after !== null
                      ? item.low_stock_after
                        ? "Yes"
                        : "No"
                      : "-"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default ItemHistory;
