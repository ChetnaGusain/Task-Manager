import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, Typography, Grid, Paper, CircularProgress } from "@mui/material";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({
    totalTasks: 0,
    pendingTasks: 0,
    completedTasks: 0,
    timeLapsed: 0,
    estimatedTimeLeft: 0,
    averageCompletionTime: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
    const interval = setInterval(fetchTasks, 30000); // Fetch tasks every 30 seconds
    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/tasks");
      setTasks(response.data);
      calculateStats(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (tasks) => {
    let totalTasks = tasks.length;
    let pendingTasks = tasks.filter((task) => task.status === "pending").length;
    let completedTasks = tasks.filter((task) => task.status === "finished").length;

    let timeLapsed = 0;
    let estimatedTimeLeft = 0;
    let totalCompletionTime = 0;
    let completedCount = 0;

    tasks.forEach((task) => {
      const startTime = new Date(task.startTime);
      const endTime = new Date(task.endTime);
      if (task.status === "finished") {
        totalCompletionTime += (endTime - startTime) / 1000 / 60 / 60; 
        completedCount++;
      } else {
        estimatedTimeLeft += (endTime - startTime) / 1000 / 60 / 60; 
      }
    });

    let averageCompletionTime = completedCount > 0 ? totalCompletionTime / completedCount : 0;

    setStats({
      totalTasks,
      pendingTasks,
      completedTasks,
      timeLapsed,
      estimatedTimeLeft,
      averageCompletionTime,
    });
  };

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom align="center">Task Dashboard</Typography>
      {loading ? (
        <CircularProgress style={{ display: 'block', margin: 'auto' }} />
      ) : (
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={3} style={{ padding: '20px' }}>
              <Typography variant="h6">Total Tasks</Typography>
              <Typography variant="h4">{stats.totalTasks}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={3} style={{ padding: '20px' }}>
              <Typography variant="h6">Completed Tasks</Typography>
              <Typography variant="h4">{stats.completedTasks}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={3} style={{ padding: '20px' }}>
              <Typography variant="h6">Pending Tasks</Typography>
              <Typography variant="h4">{stats.pendingTasks}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={3} style={{ padding: '20px' }}>
              <Typography variant="h6">Time Lapsed (in hours)</Typography>
              <Typography variant="h4">{stats.timeLapsed.toFixed(2)}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={3} style={{ padding: '20px' }}>
              <Typography variant="h6">Estimated Time Left (in hours)</Typography>
              <Typography variant="h4">{stats.estimatedTimeLeft.toFixed(2)}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={3} style={{ padding: '20px' }}>
              <Typography variant="h6">Average Completion Time (in hours)</Typography>
              <Typography variant="h4">{stats.averageCompletionTime.toFixed(2)}</Typography>
            </Paper>
          </Grid>
        </Grid>
      )}
    </div>
  );
};

export default Dashboard;
