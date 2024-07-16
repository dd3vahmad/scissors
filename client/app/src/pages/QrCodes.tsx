import { Button, Flex, Text, useColorModeValue } from "@chakra-ui/react";
import NoData from "../components/NoData";
import { useNavigate } from "react-router-dom";
import QrCodeList from "../components/QrCodeList";
import qrcodes from "../data/qrcodes";

const QrCodes = () => {
  const location = useNavigate();
  const bgColor = useColorModeValue("gray.100", "gray.800");
  const bgColor1 = useColorModeValue("white", "gray.800");
  const color = useColorModeValue("gray.400", "whitesmoke");

  return (
    <>
      {qrcodes.length ? (
        <QrCodeList qrcodes={qrcodes} />
      ) : (
        <Flex direction={"column"}>
          <NoData message="No QR Code Found" />
          <Flex direction={"column"} bg={bgColor1} height={"45vh"} py={3}>
            <Text
              color={color}
              fontSize={"3xl"}
              fontWeight={600}
              textAlign={"center"}
              px={5}
            >
              Connect your audience with a simple scan
            </Text>
            <Text
              color={color}
              fontSize={"lg"}
              fontWeight={600}
              textAlign={"center"}
              px={5}
              mt={2}
            >
              Create a QR Code from any short link. Then edit, customize, and
              track your QR Codes here.
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
              Create A Code
            </Button>
          </Flex>
        </Flex>
      )}
    </>
  );
};

export default QrCodes;
