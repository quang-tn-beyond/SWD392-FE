// src/pages/Dashboard.jsx
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


// Register Chart.js components along with the custom plugin
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ChartTitle,
  Tooltip,
  Legend
);

const Dashboard = () => {
  // Sample data for the chart
  const chartData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "Weekly Revenue",
        data: [1000, 1500, 2000, 2500],
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  // Chart options with dark-themed styling
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#fff", // White legend text
        },
      },
      title: {
        display: true,
        text: "Weekly Revenue",
        color: "#fff", // White title text
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#fff", // White x-axis labels
        },
        grid: {
          color: "rgba(255,255,255,0.2)", // Slightly transparent white grid lines
        },
      },
      y: {
        ticks: {
          color: "#fff", // White y-axis labels
        },
        grid: {
          color: "rgba(255,255,255,0.2)",
        },
      },
    },
  };

  return (
    <Layout>
    <Box sx={{ padding: "20px" }}>
      {/* Title Section */}
      <Box sx={{ textAlign: "center", marginBottom: 3 }}>
        <Typography variant="h3" sx={{ color: "#ffffff" }}>
          Admin Dashboard
        </Typography>
        <Typography variant="h2" sx={{ color: "#black" }}>
          Welcome, Admin! Manage your website here.
        </Typography>
      </Box>

      {/* Dashboard Cards */}
      <Grid container spacing={3} sx={{ marginBottom: 4 }}>
        {/* Monthly Revenue Card */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: "primary.main", color: "white" }}>
            <CardContent>
              <Typography variant="h5">$12,345</Typography>
              <Typography variant="body2">Monthly Revenue</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Weekly Revenue Card */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: "success.main", color: "white" }}>
            <CardContent>
              <Typography variant="h5">$3,500</Typography>
              <Typography variant="body2">Weekly Revenue</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Views Card */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: "warning.main", color: "white" }}>
            <CardContent>
              <Typography variant="h5">5,456</Typography>
              <Typography variant="body2">Total Views</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Traffic Card */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: "info.main", color: "white" }}>
            <CardContent>
              <Typography variant="h5">2,000</Typography>
              <Typography variant="body2">Traffic This Week</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Chart Section */}
      <Card sx={{ marginBottom: 4 }}>
        <CardContent sx={{ bgcolor: "background.default" }}>
          <Box
            sx={{
              border: "2px solid",
              borderColor: "primary.main",
              borderRadius: 2,
              padding: 2,
              backgroundColor: "background.paper",
            }}
          >
            <Line data={chartData} options={chartOptions} />
          </Box>
        </CardContent>
      </Card>
    </Box>
    </Layout>
  );
};

export default Dashboard;
