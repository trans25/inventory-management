import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const COLORS = ["#1f93ff", "#ff6b6b", "#feca57", "#1dd1a1", "#5f27cd", "#ff9ff3"];

const InventoryCharts = ({ products }) => {
  // stock value grouped by category
  const byCategory = {};
  products.forEach((p) => {
    const value = Number(p.price) * Number(p.quantity);
    byCategory[p.category] = (byCategory[p.category] || 0) + value;
  });
  const categoryData = Object.keys(byCategory).map((name) => ({
    name,
    value: Number(byCategory[name].toFixed(2)),
  }));

  // quantity per product (top 8)
  const quantityData = products
    .slice(0, 8)
    .map((p) => ({ name: p.name, quantity: Number(p.quantity) }));

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="charts-grid">
      <div className="chart-card">
        <h3>Stock Value by Category</h3>
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={categoryData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={90}
              label
            >
              {categoryData.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-card">
        <h3>Quantity per Product</h3>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={quantityData}>
            <XAxis dataKey="name" hide />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="quantity" fill="#1f93ff" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default InventoryCharts;
