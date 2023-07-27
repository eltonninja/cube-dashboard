import cubejs from "@cubejs-client/core";
import { format } from "date-fns";
import numeral from "numeral";
import React, { useState } from "react";
import { Col, Container, Row } from "reactstrap";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Chart from "./Chart.js";

const cubejsApi = cubejs(process.env.REACT_APP_CUBEJS_TOKEN, {
  apiUrl: process.env.REACT_APP_API_URL,
});
const numberFormatter = (item) => numeral(item).format("0,0");
const dateFormatter = (item) => format(new Date(item), "yyyy/MM");

const renderSingleValue = (resultSet, key) => (
  <h1 height={300}>{numberFormatter(resultSet.chartPivot()[0][key])}</h1>
);

export default function App() {
  const [startDate, setStartDate] = useState("2017-01-01");
  const [endDate, setEndDate] = useState("2023-12-31");
  const [orderStatus, setOrderStatus] = useState("shipped");
  const orderStatusLabel = {shipped: "Shipped Orders", processing: "Processing Orders", completed: "Completed Orders"};

  return (
    <Container fluid>
      <br />
      <Row>
        <label>
          Start Date:{"  "}
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </label>
        <br />
        <br />
        <label>
          End Date:{"  "}
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </label>
        <br />
        <br />
        <label>
          Order Status:{"  "}
          <select
            value={orderStatus}
            onChange={(e) => setOrderStatus(e.target.value)}
          >
            <option value="shipped">Shipped</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
          </select>
        </label>
      </Row>
      <br />
      <br />
      <Row>
        <Col sm="4">
          <Chart
            cubejsApi={cubejsApi}
            title="Total Users"
            query={{
              measures: ["Users.count"],
              timeDimensions: [
                {
                  dimension: "Users.signedUp",
                  dateRange: [startDate, endDate],
                },
              ],
            }}
            render={(resultSet) => renderSingleValue(resultSet, "Users.count")}
          />
        </Col>
        <Col sm="4">
          <Chart
            cubejsApi={cubejsApi}
            title="Total Orders"
            query={{
              measures: ["Orders.count"],
              timeDimensions: [
                {
                  dimension: "Orders.createdAt",
                  dateRange: [startDate, endDate],
                },
              ],
            }}
            render={(resultSet) => renderSingleValue(resultSet, "Orders.count")}
          />
        </Col>
        <Col sm="4">
          <Chart
            cubejsApi={cubejsApi}
            title={orderStatusLabel[orderStatus]}
            query={{
              measures: ["Orders.count"],
              filters: [
                {
                  dimension: "Orders.status",
                  operator: "equals",
                  values: [orderStatus],
                },
              ],
              timeDimensions: [
                {
                  dimension: "Orders.createdAt",
                  dateRange: [startDate, endDate],
                },
              ],
            }}
            render={(resultSet) => {
              return renderSingleValue(resultSet, "Orders.count");
            }}
          />
        </Col>
      </Row>
      <br />
      <br />
      <Row>
        <Col sm="6">
          <Chart
            cubejsApi={cubejsApi}
            title="New Users Over Time"
            query={{
              measures: ["Users.count"],
              timeDimensions: [
                {
                  dimension: "Users.signedUp",
                  dateRange: [startDate, endDate],
                  granularity: "month",
                },
              ],
              order: {
                "Users.signedUp": "asc",
              },
            }}
            render={(resultSet) => {
              return (
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={resultSet.chartPivot()}>
                    <XAxis dataKey="x" tickFormatter={dateFormatter} />
                    <YAxis tickFormatter={numberFormatter} />
                    <Tooltip labelFormatter={dateFormatter} />
                    <Area
                      type="monotone"
                      dataKey="Users.count"
                      name="Users"
                      stroke="#d81438"
                      fill="#d8143833"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              );
            }}
          />
        </Col>
        <Col sm="6">
          <Chart
            cubejsApi={cubejsApi}
            title="Orders by Status Over time"
            query={{
              measures: ["Orders.count"],
              dimensions: ["Orders.status"],
              timeDimensions: [
                {
                  dimension: "Orders.createdAt",
                  dateRange: [startDate, endDate],
                  granularity: "month",
                },
              ],
            }}
            render={(resultSet) => {
              return (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={resultSet.chartPivot()}>
                    <XAxis tickFormatter={dateFormatter} dataKey="x" />
                    <YAxis tickFormatter={numberFormatter} />
                    <Bar
                      stackId="a"
                      dataKey="shipped,Orders.count"
                      name="Shipped"
                      fill="#5323d5dd"
                    />
                    <Bar
                      stackId="a"
                      dataKey="processing,Orders.count"
                      name="Processing"
                      fill="#d81438dd"
                    />
                    <Bar
                      stackId="a"
                      dataKey="completed,Orders.count"
                      name="Completed"
                      fill="#a3f82399"
                    />
                    <Legend />
                    <Tooltip />
                  </BarChart>
                </ResponsiveContainer>
              );
            }}
          />
        </Col>
      </Row>
    </Container>
  );
}
