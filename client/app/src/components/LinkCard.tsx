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
  const iconColor = useColorModeValue("grey", "gray");
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
      gap={3}
      p={2}
      alignItems={"start"}
      border={"1px solid gray"}
      borderRadius={5}
      templateColumns={"1fr 2fr 0.2fr"}
    >
      <GridItem>
        <Image
          objectFit="cover"
          maxW={{ base: "100px", sm: "50px" }}
          src={getCroppedImageUrl(link?.qrCode || "")}
          alt="Link QR Code"
          borderRadius={5}
          onClick={() => goTo(`/links/${link?.id}`)}
        />
      </GridItem>
      <GridItem>
        <Stack>
          {link ? (
            <Box>
              <Heading size="sm" noOfLines={1} maxWidth={"200px"}>
                {link.title}
              </Heading>
              <Text
                noOfLines={2}
                py="1"
                fontSize={14}
                fontWeight={500}
                maxWidth={"200px"}
              >
                <a target="_blank" href={link.shortUrl}>
                  {link.shortUrl}
                </a>
              </Text>
              <Text noOfLines={2} fontSize={12} maxWidth={"200px"}>
                <a target="_blank" href={link.longUrl}>
                  {link.longUrl}
                </a>
              </Text>
            </Box>
          ) : (
            <NoData message="No Link Data" />
          )}
        </Stack>
      </GridItem>
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
          onClick={() => goTo(`/links/${link?.id}`)}
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
    </Grid>
  );
};

export default LinkCard;
