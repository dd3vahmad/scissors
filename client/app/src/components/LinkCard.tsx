import {
  Box,
  Grid,
  GridItem,
  Heading,
  Icon,
  Image,
  Stack,
  Text,
  useColorModeValue,
  VStack,
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
    <Grid
      templateColumns={{ base: "auto 1fr auto", md: "auto 1fr 0.2fr" }}
      gap={4}
      p={4}
      alignItems="center"
      border="1px solid"
      borderColor={useColorModeValue("gray.200", "gray.600")}
      borderRadius="md"
      maxW="full"
      overflow="hidden"
    >
      <GridItem>
        <Image
          objectFit="cover"
          maxW={{ base: "80px", md: "100px" }}
          maxH={{ base: "80px", md: "100px" }}
          src={getCroppedImageUrl(link?.qrCode || "")}
          alt="Link QR Code"
          borderRadius="md"
          cursor="pointer"
          onClick={() => goTo(`/links/${link?.id}`)}
        />
      </GridItem>
      <GridItem>
        <Stack spacing={2} overflow="hidden">
          {link ? (
            <Box>
              <Heading size="sm" noOfLines={1} overflow="hidden">
                {link.title}
              </Heading>
              <Text
                noOfLines={1}
                fontSize={{ base: "sm", md: "md" }}
                fontWeight={500}
              >
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={link.shortUrl}
                >
                  {link.shortUrl}
                </a>
              </Text>
              <Text
                noOfLines={1}
                fontSize={{ base: "xs", md: "sm" }}
                maxWidth={"170px"}
              >
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={link.longUrl}
                >
                  {link.longUrl}
                </a>
              </Text>
            </Box>
          ) : (
            <NoData message="No Link Data" />
          )}
        </Stack>
      </GridItem>
      <VStack spacing={3} alignItems="center" justifyContent="center">
        <Icon
          as={detailsPage ? FaDownload : BsEyeFill}
          boxSize={{ base: 4, md: 5 }}
          color={iconColor}
          cursor="pointer"
          onClick={() => goTo(`/links/${link?.id}`)}
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
          as={MdDelete}
          boxSize={{ base: 4, md: 5 }}
          color={"red.500"}
          cursor="pointer"
          onClick={deleteLink}
        />
      </VStack>
    </Grid>
  );
};

export default LinkCard;
