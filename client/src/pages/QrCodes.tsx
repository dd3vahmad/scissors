import { Button, Flex, Icon, Text, useColorModeValue } from "@chakra-ui/react";
import NoData from "../components/NoData";
import { useNavigate } from "react-router-dom";
import QrCodeList from "../components/QrCodeList";
import { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa6";
import axios from "axios";
import { useCustomToast } from "../components/Toast";

const QrCodes = () => {
  const { showToast } = useCustomToast();
  const [loading, setLoading] = useState(true);
  const [refreshing, refresh] = useState<number>(0);
  const [qrCodeHistory, setQrCodeHistory] = useState([]);
  const bgColor = useColorModeValue("gray.100", "gray.800");
  const bgColor1 = useColorModeValue("white", "gray.800");
  const color = useColorModeValue("gray.400", "whitesmoke");
  const goTo = useNavigate();

  const getQrCodeHistory = async () => {
    try {
      const response: any = await axios.get("/url/qrcode-history");

      setQrCodeHistory(response.data.data);
      return setLoading(false);
    } catch (error: any) {
      showToast("error", error.response.data.message || error.message);
    }
  };

  useEffect(() => {
    getQrCodeHistory();
  }, [refreshing]);

  return (
    <>
      {loading ? (
        <Icon as={FaSpinner} size={16} />
      ) : qrCodeHistory.length ? (
        <QrCodeList
          onDeleteQrCode={() => refresh(new Date().getTime())}
          qrcodes={qrCodeHistory}
        />
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
              onClick={() => goTo("/create-new/qrcode")}
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
