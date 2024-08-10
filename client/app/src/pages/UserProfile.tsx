import {
  Box,
  Flex,
  Avatar,
  Text,
  VStack,
  HStack,
  Stat,
  StatLabel,
  StatNumber,
  Heading,
  Divider,
} from "@chakra-ui/react";
import { useAuth } from "../context/auth";
import BarChart from "../components/BarChart";
import formatDay from "../Utils/formatDay";
import { IClickData } from "../entites/Link";
import { useEffect, useState } from "react";
import axios from "axios";

interface IUserProfile {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  profileImage: string;
  numberOfUrls: number;
  totalClicks: number;
}

const UserProfile = () => {
  const { currentUser } = useAuth();
  const [clicksByDayData, setClicksByDayData] = useState<IClickData[]>();

  const user: IUserProfile = {
    firstName: currentUser?.firstname || "John",
    lastName: currentUser?.lastname || "John",
    username: currentUser?.username || "John",
    email: currentUser?.email || "John",
    profileImage: currentUser?.firstname || "John",
    numberOfUrls: currentUser?.numberOfUrls || 0,
    totalClicks: currentUser?.totalClicks || 0,
  };

  const getChartDataByDay = async () => {
    try {
      const response = await axios.get("/url/stats?by=day");
      const chartRes = response.data as any;
      setClicksByDayData(chartRes.data);
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

  useEffect(() => {
    getChartDataByDay();
  }, []);

  return (
    <Box
      maxW="800px"
      mx={3}
      mt={10}
      p={5}
      borderWidth="1px"
      borderRadius="lg"
      boxShadow="lg"
    >
      <Flex direction={{ base: "column", md: "row" }} align="center">
        <Avatar size="2xl" name={user.firstName} src={user.profileImage} />
        <VStack align="start" ml={{ base: 0, md: 6 }} mt={{ base: 4, md: 0 }}>
          <Heading
            as="h1"
            size="lg"
          >{`${user.firstName} ${user.lastName}`}</Heading>
          <Text fontSize="lg" color="gray.600">
            @{user.username}
          </Text>
          <Text fontSize="md" color="gray.500">
            {user.email}
          </Text>
        </VStack>
      </Flex>

      <Divider my={6} />

      <HStack spacing={8} justify="space-around">
        <Stat>
          <StatLabel>Shortened URLs</StatLabel>
          <StatNumber>{user.numberOfUrls}</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Total Clicks</StatLabel>
          <StatNumber>{user.totalClicks}</StatNumber>
        </Stat>
      </HStack>
      <BarChart
        chartData={chartData}
        title={`Clicks Per Day For The Last ${5} Day`}
      />
    </Box>
  );
};

export default UserProfile;
