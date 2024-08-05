import { Container, Text } from "@chakra-ui/react";
import BarChart from "../components/BarChart";
import PieChart from "../components/PieChart";
import LineChart from "../components/LineChart";
import formatDay from "../Utils/formatDay";

const Analytics = () => {
  const clicksData = [
    {
      on: new Date().getDay(),
      clicks: 10,
    },
    {
      on: new Date().getDay() + 1,
      clicks: 20,
    },
    {
      on: new Date().getDay() + 2,
      clicks: 18,
    },
    {
      on: new Date().getDay() + 3,
      clicks: 11,
    },
    {
      on: new Date().getDay() + 4,
      clicks: 13,
    },
  ];

  const chartData = {
    labels: clicksData.map((data) => formatDay(data.on, true).toUpperCase()),
    datasets: [
      {
        label: "Users Gained ",
        data: clicksData.map((data) => data.clicks),
        backgroundColor: [
          "rgba(75,192,192,1)",
          "#50AF95",
          "#f3ba2f",
          "#2a71d0",
        ],
        borderColor: "black",
        borderWidth: 2,
      },
    ],
  };

  return (
    <Container px={3} py={2}>
      <Text fontSize={"xl"}>Analytics</Text>
      <BarChart chartData={chartData} />
      <PieChart chartData={chartData} />
      <LineChart chartData={chartData} />
    </Container>
  );
};

export default Analytics;
