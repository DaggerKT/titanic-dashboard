/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Papa from "papaparse";
import dataCSV from "/Titanic Dataset.csv?url";
import CommentBox from "../components/CommentBox";
import { Card, Row, Col, Typography, Divider } from "antd";
import "antd/dist/reset.css";

const COLORS = ["#0088FE", "#FF8042"];

type Passenger = {
  survived: "0" | "1";
  pclass: string;
  sex: string;
  age: string;
  fare: string;
  embarked: string;
};

export default function DashboardPage() {
  const [data, setData] = useState<Passenger[]>([]);

  useEffect(() => {
    Papa.parse(dataCSV, {
      header: true,
      download: true,
      skipEmptyLines: true,
      complete: (results) => {
        const parsed = (results.data as any[]).filter(
          (row) => row.survived !== undefined && row.survived !== ""
        );
        setData(parsed as Passenger[]);
      },
    });
  }, []);

  const survivalStats = [
    { name: "Survived", value: data.filter((p) => p.survived === "1").length },
    { name: "Died", value: data.filter((p) => p.survived === "0").length },
  ];

  const genderStats = [
    {
      name: "Male",
      value: data.filter((p) => p.sex === "male" && p.survived === "1").length,
    },
    {
      name: "Female",
      value: data.filter((p) => p.sex === "female" && p.survived === "1")
        .length,
    },
  ];

  // Survival by Class (Pclass)
  const pclassStats = [
    {
      pclass: "1st",
      Survived: data.filter((p) => p.pclass === "1" && p.survived === "1").length,
      Died: data.filter((p) => p.pclass === "1" && p.survived === "0").length,
    },
    {
      pclass: "2nd",
      Survived: data.filter((p) => p.pclass === "2" && p.survived === "1").length,
      Died: data.filter((p) => p.pclass === "2" && p.survived === "0").length,
    },
    {
      pclass: "3rd",
      Survived: data.filter((p) => p.pclass === "3" && p.survived === "1").length,
      Died: data.filter((p) => p.pclass === "3" && p.survived === "0").length,
    },
  ];

  // Age Distribution (Histogram)
  const ageBins = [
    { range: "0-10", count: 0 },
    { range: "11-20", count: 0 },
    { range: "21-30", count: 0 },
    { range: "31-40", count: 0 },
    { range: "41-50", count: 0 },
    { range: "51-60", count: 0 },
    { range: "61-70", count: 0 },
    { range: "71-80", count: 0 },
    { range: "81+", count: 0 },
  ];
  data.forEach((p) => {
    const age = parseFloat(p.age);
    if (!isNaN(age)) {
      if (age <= 10) ageBins[0].count++;
      else if (age <= 20) ageBins[1].count++;
      else if (age <= 30) ageBins[2].count++;
      else if (age <= 40) ageBins[3].count++;
      else if (age <= 50) ageBins[4].count++;
      else if (age <= 60) ageBins[5].count++;
      else if (age <= 70) ageBins[6].count++;
      else if (age <= 80) ageBins[7].count++;
      else ageBins[8].count++;
    }
  });

  return (
    <div className="min-h-screen max-h-screen overflow-auto min-w-screen p-4 max-w-screen">
      <Card style={{ marginBottom: 24, background: "#f0f5ff" }}>
        <Typography.Title level={2} style={{ marginBottom: 0 }}>
          Titanic Dashboard
        </Typography.Title>
        <Typography.Text type="secondary">
          ข้อมูลผู้โดยสาร Titanic พร้อมกราฟสถิติและคอมเมนต์
        </Typography.Text>
      </Card>
      <Row gutter={[24, 24]}>
        <Col xs={24} md={12}>
          <Card
            title="Survival Rate"
            bordered={false}
            style={{ minHeight: 340 }}
          >
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={survivalStats}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={80}
                >
                  {survivalStats.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <Divider />
            <CommentBox cardKey="survival" />
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card
            title="Survivors by Gender"
            bordered={false}
            style={{ minHeight: 340 }}
          >
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={genderStats}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
            <Divider />
            <CommentBox cardKey="gender" />
          </Card>
        </Col>
      </Row>
      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col xs={24} md={12}>
          <Card
            title="Survival by Class (Pclass)"
            bordered={false}
            style={{ minHeight: 340 }}
          >
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={pclassStats}>
                <XAxis dataKey="pclass" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="Survived" stackId="a" fill="#0088FE" name="Survived" />
                <Bar dataKey="Died" stackId="a" fill="#FF8042" name="Died" />
              </BarChart>
            </ResponsiveContainer>
            <Divider />
            <CommentBox cardKey="pclass" />
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card
            title="Age Distribution"
            bordered={false}
            style={{ minHeight: 340 }}
          >
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={ageBins}>
                <XAxis dataKey="range" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#82ca9d" name="Count" />
              </BarChart>
            </ResponsiveContainer>
            <Divider />
            <CommentBox cardKey="age" />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
