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
import { ICreateLink } from "../entites/Link";
import { useState } from "react";
import axios from "axios";
import { FaSpinner } from "react-icons/fa6";
import { useNavigate, useParams } from "react-router-dom";
import { useCustomToast } from "../components/Toast";

const CreateNew = () => {
  const { showToast } = useCustomToast();
  const { qrcode } = useParams();
  const goTo = useNavigate();
  const [shorteningLink, setShorteningLink] = useState(false);
  const [linkData, setLinkData] = useState<ICreateLink>({
    title: "",
    longUrl: "",
    backHalf: "",
    generateQrCode: false,
  });
  const bgColor1 = useColorModeValue("gray.400", "gray.300");
  const bgColor2 = useColorModeValue("white", "gray.800");
  const color1 = useColorModeValue("white", "gray.700");
  const color2 = useColorModeValue("gray.400", "white");

  const createNewLink = async (linkData: ICreateLink) => {
    try {
      setShorteningLink(true);
      showToast("info", "Creating....");
      if (!linkData.longUrl) {
        return showToast("error", "No url to be shortened");
      }
      await axios.post("/url/shorten", linkData);
      setShorteningLink(false);
      showToast("success", "Creation successful");
      return goTo("/links");
    } catch (error: any) {
      setShorteningLink(false);
      showToast("error", error.response.data.message || error.message);
    }
  };

  return (
    <Container py={3} px={5}>
      <CreateNewLink setLinkData={setLinkData} />
      <Text fontSize={"2xl"} fontWeight={700} mt={5} mb={3}>
        Ways To Share
      </Text>
      {!qrcode && <ShortLinkShare setLinkData={setLinkData} />}
      <QRCodeShare qrCodePage={!qrcode} setLinkData={setLinkData} />
      {!qrcode && <LinkPageShare />}
      <Flex direction={"column"} mt={5} gap={3}>
        <Button
          onClick={() => createNewLink(linkData)}
          bg={bgColor1}
          color={color1}
        >
          {shorteningLink ? <FaSpinner size={25} color={color1} /> : "Create"}
        </Button>
        <Button bg={bgColor2} color={color2}>
          Cancel
        </Button>
      </Flex>
    </Container>
  );
};

export default CreateNew;
