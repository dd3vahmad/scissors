import {
  Button,
  Container,
  Flex,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import CreateNewLink from "../components/CreateNewLink";
import ShortLinkShare from "../components/ShortLinkShare";
import QRCodeShare from "../components/QRCodeShare";
import LinkPageShare from "../components/LinkPageShare";

const CreateNew = () => {
  const bgColor1 = useColorModeValue("gray.400", "gray.300");
  const bgColor2 = useColorModeValue("white", "gray.800");
  const color1 = useColorModeValue("white", "gray.700");
  const color2 = useColorModeValue("gray.400", "white");

  return (
    <Container py={3} px={5}>
      <CreateNewLink />
      <Text fontSize={"2xl"} fontWeight={700} mt={5} mb={3}>
        Ways To Share
      </Text>
      <ShortLinkShare />
      <QRCodeShare />
      <LinkPageShare />
      <Flex direction={"column"} mt={5} gap={3}>
        <Button bg={bgColor1} color={color1}>
          Create
        </Button>
        <Button bg={bgColor2} color={color2}>
          Cancel
        </Button>
      </Flex>
    </Container>
  );
};

export default CreateNew;
