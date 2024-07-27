import {
  Button,
  Flex,
  Icon,
  Image,
  Input,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import LinkList from "../components/LinkList";
import links from "../data/links";
import { BsSearch } from "react-icons/bs";
import getCroppedImageUrl from "../Utils/image-url";

const CustomUrls = () => {
  const location = useNavigate();
  const bgColor = useColorModeValue("blue.500", "gray.800");
  const bgColor1 = useColorModeValue("white", "gray.800");
  const color = useColorModeValue("blue.500", "blue.500");

  return (
    <>
      {links.length ? (
        <LinkList links={links} />
      ) : (
        <Flex direction={"column"}>
          <Text
            color={color}
            fontSize={"3xl"}
            fontWeight={600}
            textAlign={"center"}
            px={5}
            mt={2}
          >
            Brand your links with a custom domain
          </Text>
          <Image src={getCroppedImageUrl("")} mx={5} mt={3} borderRadius={5} />
          <Flex
            direction={"column"}
            bg={bgColor1}
            height={"45vh"}
            mx={5}
            py={3}
          >
            <Text color={color} fontSize={"lg"} fontWeight={600} my={2}>
              Find a domain
            </Text>
            <Flex
              alignItems={"center"}
              borderWidth={2}
              borderRadius={4}
              borderColor={"blue.500"}
            >
              <Icon as={BsSearch} boxSize={6} mx={3} color={color} />
              <Input
                maxLength={32}
                borderRadius={0}
                type="text"
                borderWidth={0}
                outline={0}
              />
            </Flex>
            <Text>Try entering your product name</Text>
            <Button
              borderWidth={2}
              bg={bgColor}
              textColor={"white"}
              fontSize={"lg"}
              mt={5}
              py={2}
              _hover={{ bg: "blue.600" }}
              onClick={() => location("/create-new")}
            >
              Search
            </Button>
          </Flex>
        </Flex>
      )}
    </>
  );
};

export default CustomUrls;
