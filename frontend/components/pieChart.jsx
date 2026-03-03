"use client"

import { useMemo } from "react"
import { Cell, Legend, Pie, PieChart, ResponsiveContainer } from "recharts"

// Generate monochrome colors for dark mode
const generateMonochromeColors = () => {
  return [
    "#FFFFFF", // white
    "#999999", // medium gray
    "#666666", // dark gray
    "#AAAAAA", // light gray
  ]
}

export default function PieChartGrafico({ data, type = "auto" }) {
  // Determine data type if not explicitly provided
  const dataType = useMemo(() => {
    if (type !== "auto") return type

    // Check if it's domain data
    if (data && data.reverse_domains && data.subdomains) {
      return "domains"
    }

    // Check if it's port data
    if (Array.isArray(data) && data.length > 0 && data[0].puertos) {
      return "ports"
    }

    return "unknown"
  }, [data, type])

  // Calculate chart data
  const chartData = useMemo(() => {
    if (dataType === "domains" && data.reverse_domains && data.subdomains) {
      const categories = [
        { name: "Dominios", count: data.reverse_domains.length },
        { name: "Subdominios", count: data.subdomains.length },
      ]

      const totalItems = data.reverse_domains.length + data.subdomains.length

      return categories.map((category) => ({
        category: category.name,
        value: category.count,
        percentage: totalItems > 0 ? ((category.count / totalItems) * 100).toFixed(0) : "0",
      }))
    }

    if (dataType === "ports" && Array.isArray(data)) {
      const portGroups = data.reduce((acc, port) => {
        const portNumber = port.numero || "unknown";
        if (!acc[portNumber]) {
          acc[portNumber] = [];
        }
        acc[portNumber].push(port);
        return acc;
      }, {});
      
      const totalPorts = data.length;
      return Object.entries(portGroups).map(([portNumber, ports]) => ({
        category: `Port ${portNumber}`, 
        value: ports.length,
        percentage: totalPorts > 0 ? ((ports.length / totalPorts) * 100).toFixed(0) : "0",
      }));
    }

    return [{ category: "No Data", value: 100, percentage: "100" }]
  }, [data, dataType])

  const monochromeColors = generateMonochromeColors()

  const CustomLegend = ({ payload }) => {
    if (!payload) return null

    return (
      <ul className="flex flex-col space-y-3 text-xs mt-4">
        {payload.map((entry, index) => (
          <li key={`item-${index}`} className="flex items-center">
            <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: entry.color }}></span>
            <span className="font-medium text-gray-200">
              {entry.value}: {chartData[index].percentage}%
            </span>
          </li>
        ))}
      </ul>
    )
  }

  return (
    <div className="w-full relative">
      <ResponsiveContainer width="100%" height={220}>
        <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="category"
            cx="50%"
            cy="50%"
            outerRadius={70}
            fill="#8884d8"
            paddingAngle={0}
            label={false}
            labelLine={false}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={monochromeColors[index % monochromeColors.length]} />
            ))}
          </Pie>
          <Legend
            content={<CustomLegend />}
            layout="vertical"
            align="center"
            verticalAlign="bottom"
            wrapperStyle={{ paddingTop: 20 }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}