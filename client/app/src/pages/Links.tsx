import { Button, Flex, Text, useColorModeValue } from "@chakra-ui/react";
import LinkList from "../components/LinkList";
import NoData from "../components/NoData";
import links from "../data/links";
import { useNavigate } from "react-router-dom";

const Links = () => {
  const location = useNavigate();
  const bgColor = useColorModeValue("gray.100", "gray.800");
  const color = useColorModeValue("gray.400", "gray.700");

  return (
    <>
      {links.length ? (
        <LinkList links={links} />
      ) : (
        <Flex direction={"column"}>
          <NoData message="No Link Found" />
          <Flex direction={"column"} bg={bgColor} height={"45vh"} py={3}>
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
              onClick={() => location("/create-new")}
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
