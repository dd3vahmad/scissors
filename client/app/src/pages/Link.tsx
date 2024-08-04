// import { Button, Flex, Text, useColorModeValue } from "@chakra-ui/react";
// import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import LinkCard from "../components/LinkCard";
import { Text } from "@chakra-ui/react";
import links from "../data/links";
import { useState } from "react";
import { Chart } from "chart.js";
// import { Canvas } from "chart.js";

const Link = () => {
  const { id } = useParams();
  const [link, setLink] = useState(
    links.find((link) => link.id == id) || {
      id: "",
      title: "",
      longUrl: "",
      shortUrl: "",
      clicks: 0,
    }
  );
  // const location = useNavigate();
  // const bgColor = useColorModeValue("gray.100", "gray.800");
  // const color = useColorModeValue("gray.400", "whitesmoke");
  // const newChart = new Chart()

  return (
    <>
      <LinkCard link={link} />
      <Text>Charts</Text>
    </>
  );
};

export default Link;
