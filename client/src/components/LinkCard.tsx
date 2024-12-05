import {
  Flex,
  Heading,
  HStack,
  Icon,
  Image,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import ILink from "../entites/Link";
import getCroppedImageUrl from "../Utils/image-url";
import { FaCopy, FaDownload } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import NoData from "./NoData";
import axios from "axios";
import { MdDelete } from "react-icons/md";
import { useCustomToast } from "./Toast";
import { BsEyeFill } from "react-icons/bs";
import { FiEdit } from "react-icons/fi";

interface IProps {
  link: ILink | undefined;
  onDelete: () => void;
  detailsPage?: boolean;
}

const LinkCard = ({ link, onDelete, detailsPage }: IProps) => {
  const iconColor = useColorModeValue("gray.500", "gray.300");
  const goTo = useNavigate();
  const { showToast } = useCustomToast();

  const deleteLink = async () => {
    try {
      showToast("info", "Deleting...");
      await axios.delete(`/url/${link?.id}`);
      showToast("success", "Link deleted successfully");
      onDelete();
    } catch (error: any) {
      showToast("error", error.response.data.message || error.message);
    }
  };

  return (
    <Flex
      gap={2}
      p={2}
      border="1px solid"
      borderColor={useColorModeValue("gray.200", "gray.600")}
      borderRadius="md"
      maxW="full"
    >
      <Image
        objectFit="cover"
        src={getCroppedImageUrl(link?.qrCode || "")}
        boxSize={24}
        alt="Link QR Code"
        borderRadius="md"
        cursor="pointer"
        onClick={() => goTo(`/links/${link?.id}`)}
      />
      {link ? (
        <Flex direction={"column"} justifyContent={"space-between"} flex={1}>
          <Heading size="md" noOfLines={1} overflow="hidden">
            {link.title}
          </Heading>
          <Text
            noOfLines={1}
            fontSize={{ base: "sm", md: "md" }}
            fontWeight={500}
          >
            <a target="_blank" rel="noopener noreferrer" href={link.shortUrl}>
              {link.shortUrl}
            </a>
          </Text>
          <Text
            noOfLines={1}
            fontSize={{ base: "xs", md: "sm" }}
            maxWidth={"190px"}
          >
            <a target="_blank" rel="noopener noreferrer" href={link.longUrl}>
              {link.longUrl}
            </a>
          </Text>
          <HStack
            spacing={3}
            flex={1}
            display={"flex"}
            alignItems={"end"}
            justifyContent={"end"}
          >
            <Icon
              as={MdDelete}
              boxSize={{ base: 4, md: 5 }}
              color={"red.500"}
              cursor="pointer"
              onClick={deleteLink}
            />

            <Icon
              as={FaCopy}
              boxSize={{ base: 4, md: 5 }}
              color={iconColor}
              cursor="pointer"
            />
            <Icon
              as={FiEdit}
              boxSize={{ base: 4, md: 5 }}
              color={iconColor}
              cursor="pointer"
            />
            <Icon
              as={detailsPage ? FaDownload : BsEyeFill}
              boxSize={{ base: 4, md: 5 }}
              color={iconColor}
              cursor="pointer"
              onClick={() => goTo(`/links/${link?.id}`)}
            />
          </HStack>
        </Flex>
      ) : (
        <NoData message="No Link Data" />
      )}
    </Flex>
  );
};

export default LinkCard;
