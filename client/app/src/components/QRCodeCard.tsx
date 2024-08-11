import {
  Flex,
  Icon,
  Image,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import getCroppedImageUrl from "../Utils/image-url";
import IQrCode from "../entites/QrCode";
import { FaCopy, FaDownload } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { BsEyeFill } from "react-icons/bs";
import { FiEdit } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import { useCustomToast } from "./Toast";
import axios from "axios";

interface IProps {
  qrCode: IQrCode;
  onDelete: () => void;
  detailsPage?: boolean;
}

const QRCodeCard = ({ qrCode, detailsPage, onDelete }: IProps) => {
  const goTo = useNavigate();
  const { showToast } = useCustomToast();
  const iconColor = useColorModeValue("grey", "gray");

  const deleteLink = async () => {
    try {
      await axios.delete(`/url/${qrCode?.id}`);
      showToast("success", "Link deleted successfully");
      onDelete();
    } catch (error: any) {
      showToast("error", error.response.data.message || error.message);
    }
  };

  return (
    <Flex
      gap={3}
      p={2}
      direction={"column"}
      alignItems={"start"}
      border={"1px solid gray"}
      borderRadius={5}
      maxInlineSize={"fit-content"}
    >
      <Flex gap={2}>
        <Image
          objectFit="cover"
          maxW={{ base: "100px", sm: "50px" }}
          src={getCroppedImageUrl(qrCode.qrCode || "")}
          alt="Link QR Code"
          borderRadius={5}
          onClick={() => goTo(`/links/${qrCode.id}`)}
        />

        <VStack
          display={"flex"}
          justifyContent={"start"}
          alignItems={"end"}
          flex={1}
        >
          <Icon
            as={detailsPage ? FaDownload : BsEyeFill}
            boxSize={5}
            color={iconColor}
            onClick={() => goTo(`/links/${qrCode.id}`)}
          />
          <Icon as={FaCopy} boxSize={5} color={iconColor} />
          <Icon as={FiEdit} boxSize={5} color={iconColor} />
          <Icon
            as={MdDelete}
            boxSize={5}
            color={"red" || iconColor}
            onClick={deleteLink}
          />
        </VStack>
      </Flex>
      <Text
        fontSize={"12px"}
        noOfLines={2}
        maxWidth={"100px"}
        textAlign={"center"}
      >
        <a target="_blank" href={qrCode.link}>
          {qrCode.link}
        </a>
      </Text>
    </Flex>
  );
};

export default QRCodeCard;
