import React from "react";
import Layout from "./layout";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title as ChartTitle,
  Tooltip,
  Legend,
} from "chart.js";
import { Grid, Card, CardContent, Typography, Box } from "@mui/material";
import { TrendingUp, AttachMoney, Visibility, People } from "@mui/icons-material";

// Đăng ký ChartJS
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ChartTitle, Tooltip, Legend);

const Dashboard = () => {
  const chartData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "Weekly Revenue",
        data: [1000, 1500, 2000, 2500],
        borderColor: "#8E44AD", // Tím pastel nhẹ
        backgroundColor: "rgba(142, 68, 173, 0.2)",
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { labels: { color: "#333" } }, // Chữ tối hơn
      title: { display: true, text: "Weekly Revenue", color: "#333" },
    },
    scales: {
      x: { ticks: { color: "#333" }, grid: { color: "rgba(0,0,0,0.1)" } },
      y: { ticks: { color: "#333" }, grid: { color: "rgba(0,0,0,0.1)" } },
    },
  };

  return (
    <Layout>
      <Box sx={{ padding: "20px" }}>
        {/* Tiêu đề */}
        <Box sx={{ textAlign: "center", marginBottom: 3 }}>
          <Typography variant="h3" sx={{ color: "#444", fontWeight: "bold" }}>
            Admin Dashboard
          </Typography>
          <Typography variant="h5" sx={{ color: "#777" }}>
            Welcome, Admin! Manage your website here.
          </Typography>
        </Box>

        {/* Cards Thống Kê */}
        <Grid container spacing={3} sx={{ marginBottom: 4 }}>
          {[
            { icon: <AttachMoney fontSize="large" />, value: "$12,345", label: "Monthly Revenue", bg: "#E8DAEF" }, // Tím nhạt
            { icon: <TrendingUp fontSize="large" />, value: "$3,500", label: "Weekly Revenue", bg: "#D4E6F1" }, // Xanh nhạt
            { icon: <Visibility fontSize="large" />, value: "5,456", label: "Total Views", bg: "#FDEDEC" }, // Hồng pastel
            { icon: <People fontSize="large" />, value: "2,000", label: "Traffic This Week", bg: "#FCF3CF" }, // Vàng nhạt
          ].map((item, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  background: item.bg,
                  color: "#333",
                  textAlign: "center",
                  padding: 2,
                  boxShadow: 2,
                  borderRadius: 2,
                }}
              >
                <CardContent>
                  <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", mb: 1 }}>
                    {item.icon}
                  </Box>
                  <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                    {item.value}
</Typography>
                  <Typography variant="body2">{item.label}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Biểu đồ doanh thu */}
        <Card sx={{ bgcolor: "#FAF3E0", color: "#333", padding: 2, borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold", textAlign: "center" }}>
              Revenue Overview
            </Typography>
            <Box sx={{ padding: 2 }}>
              <Line data={chartData} options={chartOptions} />
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Layout>
  );
};

export default Dashboard;