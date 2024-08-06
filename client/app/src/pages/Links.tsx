import { Button, Flex, Text, useColorModeValue } from "@chakra-ui/react";
import LinkList from "../components/LinkList";
import NoData from "../components/NoData";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const Links = () => {
  const [linkHistory, setLinkHistory] = useState([]);
  const goTo = useNavigate();
  const bgColor = useColorModeValue("gray.100", "gray.800");
  const bgColor1 = useColorModeValue("white", "gray.800");
  const color = useColorModeValue("gray.400", "whitesmoke");

  const getLinkHistory = async () => {
    try {
      const response: any = await axios.get("/url/history");

      return setLinkHistory(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getLinkHistory();
  }, []);

  return (
    <>
      {linkHistory.length ? (
        <LinkList links={linkHistory} />
      ) : (
        <Flex direction={"column"}>
          <NoData message="No Link Found" />
          <Flex direction={"column"} bg={bgColor1} height={"45vh"} py={3}>
            <Text
              color={color}
              fontSize={"3xl"}
              fontWeight={600}
              textAlign={"center"}
              px={5}
            >
              More Clicks Are Just A Link Away
            </Text>
            <Text
              color={color}
              fontSize={"lg"}
              fontWeight={600}
              textAlign={"center"}
              px={5}
              mt={2}
            >
              Shorten long links and get attention by customizing what they say.
              No more sics.ly/3yqawYa, more sics.ly/brands-sicsly.
            </Text>
            <Button
              borderWidth={2}
              bg={bgColor}
              textColor={color}
              fontSize={"lg"}
              mt={5}
              mx={10}
              onClick={() => goTo("/create-new")}
            >
              Create A New Sicsly Link
            </Button>
          </Flex>
        </Flex>
      )}
    </>
  );
};

export default Links;
