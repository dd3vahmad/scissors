import { Container, Stack, Text } from "@chakra-ui/react";
import BarChart from "../components/BarChart";
import PieChart from "../components/PieChart";
import LineChart from "../components/LineChart";
import formatDay from "../Utils/formatDay";
import { useEffect, useState } from "react";
import axios from "axios";
import { IClickData } from "../entites/Link";
import { useCustomToast } from "../components/Toast";

const Analytics = () => {
  const { showToast } = useCustomToast();
  const [clicksByDayData, setClicksByDayData] = useState<IClickData[]>();
  const [clicksByLocationData, setClicksByLocationData] =
    useState<IClickData[]>();

  const getChartDataByDay = async () => {
    try {
      const response = await axios.get("/url/stats?by=day");
      const chartRes = response.data as any;
      setClicksByDayData(chartRes.data);
    } catch (error: any) {
      showToast("error", error.response.data.message || error.message);
    }
  };

  const getChartDataByLocation = async () => {
    try {
      const response = await axios.get("/url/stats?by=location");
      const chartRes = response.data as any;
      setClicksByLocationData(chartRes.data);
    } catch (error: any) {
      showToast("error", error.response.data.message || error.message);
    }
  };

  const chartData = {
    labels: clicksByDayData?.map((data) =>
      formatDay(data.on, true).toUpperCase()
    ),
    datasets: [
      {
        label: "Clicks",
        data: clicksByDayData?.map((data) => data.clicks),
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

  const chartDataByLocation = {
    labels: clicksByLocationData?.map((data) => data.location),
    datasets: [
      {
        label: "Clicks",
        data: clicksByLocationData?.map((data) => data.clicks),
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

  useEffect(() => {
    getChartDataByDay();
    getChartDataByLocation();
  }, []);

  return (
    <Container px={3} py={2}>
      <Text fontSize={"xl"}>General Analytics</Text>
      <Stack gap={5}>
        <BarChart
          chartData={chartData}
          title={`Clicks Per Day For The Last ${5} Day`}
        />
        <PieChart
          chartData={chartDataByLocation}
          title={`Clicks Per Location For The Last ${5} Day`}
        />
        <LineChart
          chartData={chartDataByLocation}
          title={`Link CLicks Comparison For The Last ${5} Day`}
        />
      </Stack>
    </Container>
  );
};

export default Analytics;
