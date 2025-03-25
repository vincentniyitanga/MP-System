// src/components/ManagerDashboard.js
import React from "react";
import {
  Dashboard as DashboardIcon,
  Inventory as InventoryIcon,
  Assessment as AssessmentIcon,
  People as PeopleIcon,
  ShoppingCart as OrdersIcon,
  Settings as SettingsIcon,
} from "@mui/icons-material";
import { Grid, Paper, Typography } from "@mui/material";
import DashboardLayout from "./DashboardLayout";

const menuItems = [
  {
    text: "Dashboard",
    icon: <DashboardIcon />,
    onClick: () => console.log("Dashboard clicked"),
  },
  {
    text: "Inventory",
    icon: <InventoryIcon />,
    onClick: () => console.log("Inventory clicked"),
  },
  {
    text: "Orders",
    icon: <OrdersIcon />,
    onClick: () => console.log("Orders clicked"),
  },
  {
    text: "Staff",
    icon: <PeopleIcon />,
    onClick: () => console.log("Staff clicked"),
  },
  {
    text: "Reports",
    icon: <AssessmentIcon />,
    onClick: () => console.log("Reports clicked"),
  },
  {
    text: "Settings",
    icon: <SettingsIcon />,
    onClick: () => console.log("Settings clicked"),
  },
];

const StatCard = ({ title, value, description }) => (
  <Paper
    sx={{
      p: 3,
      display: "flex",
      flexDirection: "column",
      height: 140,
    }}
  >
    <Typography component="h2" variant="h6" color="primary" gutterBottom>
      {title}
    </Typography>
    <Typography component="p" variant="h4">
      {value}
    </Typography>
    <Typography color="text.secondary" sx={{ flex: 1 }}>
      {description}
    </Typography>
  </Paper>
);

function ManagerDashboard() {
  return (
    <DashboardLayout menuItems={menuItems} title="Manager Dashboard">
      <Grid container spacing={3}>
        {/* Stock Overview */}
        <Grid item xs={12} md={3}>
          <StatCard
            title="Total Stock"
            value="12,500"
            description="Total beer crates in warehouse"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard
            title="Pending Orders"
            value="8"
            description="Orders awaiting approval"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard
            title="Low Stock Items"
            value="3"
            description="Products below threshold"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard
            title="Today's Deliveries"
            value="15"
            description="Scheduled deliveries"
          />
        </Grid>

        {/* Recent Activity Section */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography
              component="h2"
              variant="h6"
              color="primary"
              gutterBottom
            >
              Recent Activity
            </Typography>
            {/* Add activity feed component here */}
          </Paper>
        </Grid>

        {/* Stock Movement Chart */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Typography
              component="h2"
              variant="h6"
              color="primary"
              gutterBottom
            >
              Stock Movement
            </Typography>
            {/* Add chart component here */}
          </Paper>
        </Grid>

        {/* Alerts and Notifications */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography
              component="h2"
              variant="h6"
              color="primary"
              gutterBottom
            >
              Alerts
            </Typography>
            {/* Add alerts component here */}
          </Paper>
        </Grid>
      </Grid>
    </DashboardLayout>
  );
}

export default ManagerDashboard;
