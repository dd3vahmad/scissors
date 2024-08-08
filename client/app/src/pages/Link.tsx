import { useParams } from "react-router-dom";
import LinkCard from "../components/LinkCard";
import { Container, Stack, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import ILink, { IClickData } from "../entites/Link";
import BarChart from "../components/BarChart";
import PieChart from "../components/PieChart";
import formatDay from "../Utils/formatDay";

const Link = () => {
  const { id } = useParams();
  const [link, setLink] = useState<ILink>();
  const [clicksByDayData, setClicksByDayData] = useState<IClickData[]>();
  const [clicksByLocationData, setClicksByLocationData] =
    useState<IClickData[]>();

  const getLink = async () => {
    try {
      const response = await axios.get(`/url/${id}`);
      const resData = response.data as any;
      setLink(resData);
    } catch (error) {
      console.error(error);
    }
  };

  const getLinkByDayStats = async () => {
    try {
      const response = await axios.get(`/url/${id}/stats?by=day`);
      const resData = response.data as any;
      setClicksByDayData(resData.data);
    } catch (error) {
      console.error(error);
    }
  };

  const getLinkByLocationStats = async () => {
    try {
      const response = await axios.get(`/url/${id}/stats?by=location`);
      const resData = response.data as any;
      setClicksByLocationData(resData.data);
    } catch (error) {
      console.error(error);
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
    getLink();
    getLinkByDayStats();
    getLinkByLocationStats();
  }, []);

  return (
    <Container>
      <Text fontSize={"larger"} mb={2} fontWeight={600}>
        Link Details
      </Text>
      <LinkCard link={link} />
      <Text fontSize={"larger"} mt={3} fontWeight={600}>
        Link Stats
      </Text>
      <Stack>
        <BarChart
          chartData={chartData}
          title={`Clicks Per Day For The Last ${5} Day`}
        />
        <PieChart
          chartData={chartDataByLocation}
          title={`Clicks Per Location For The Last ${5} Day`}
        />
      </Stack>
    </Container>
  );
};

export default Link;
