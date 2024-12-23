import React from 'react';
import './styles.css';

const Table = ({ monthlyData, yearlyData, monthNames }) => {
  return (
    <div className="table-container">
      {/* Monthly Breakdown */}
      <div className="monthly-breakdown">
        <h2 className="table-title">Monthly Breakdown</h2>
        <table className="data-table">
          <thead>
            <tr>
              <th>Month</th>
              <th>Income</th>
              <th>Expenses</th>
              <th>Balance</th>
            </tr>
          </thead>
          <tbody>
            {monthlyData.map((month) => (
              <tr key={month.month} className="table-row">
                <td>{monthNames[month.month - 1]}</td>
                <td className="income-cell">₹{(month.income || 0).toFixed(2)}</td>
                <td className="expenses-cell">₹{(month.expenses || 0).toFixed(2)}</td>
                <td className="balance-cell">₹{(month.balance || 0).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Yearly Breakdown */}
      <div className="yearly-breakdown">
        <h2 className="table-title">Yearly Breakdown</h2>
        <table className="data-table">
          <thead>
            <tr>
              <th>Year</th>
              <th>Income</th>
              <th>Expenses</th>
              <th>Balance</th>
            </tr>
          </thead>
          <tbody>
            {yearlyData.map((year) => (
              <tr key={year.year} className="table-row">
                <td>{year.year}</td>
                <td className="income-cell">₹{(year.income || 0).toFixed(2)}</td>
                <td className="expenses-cell">₹{(year.expenses || 0).toFixed(2)}</td>
                <td className="balance-cell">₹{(year.balance || 0).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;