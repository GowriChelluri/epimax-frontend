import React, { Component } from 'react';
import { BarChart, Bar, PieChart, Pie, Tooltip, Legend } from 'recharts';
import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('tasks.db');

class SummaryPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      taskCompletionData: [],
      userPerformanceData: [],
    };
  }

  componentDidMount() {
    // Fetch task completion data from SQLite database
    db.all('SELECT COUNT(*) as count, date(completed_at) as date FROM tasks WHERE status="completed" GROUP BY date', (err, rows) => {
      if (err) {
        console.error(err);
      } else {
        this.setState({ taskCompletionData: rows });
      }
    });

    // Fetch user performance data from SQLite database
    db.all('SELECT assignee, COUNT(*) as count FROM tasks WHERE status="completed" GROUP BY assignee', (err, rows) => {
      if (err) {
        console.error(err);
      } else {
        this.setState({ userPerformanceData: rows });
      }
    });
  }

  render() {
    const { taskCompletionData, userPerformanceData } = this.state;

    return (
      <div>
        <h2>Task Completion Rate Over Time</h2>
        <BarChart width={600} height={300} data={taskCompletionData}>
          <Bar dataKey="count" fill="#8884d8" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
        </BarChart>

        <h2>User Performance</h2>
        <PieChart width={600} height={300}>
          <Pie data={userPerformanceData} dataKey="count" nameKey="assignee" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label />
          <Tooltip />
          <Legend />
        </PieChart>
      </div>
    );
  }
}

export default SummaryPage;
