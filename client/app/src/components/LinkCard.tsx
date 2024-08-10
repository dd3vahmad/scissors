import {
  Box,
  Flex,
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
import { FaCopy, FaDownload, FaShare } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import NoData from "./NoData";
import { FaEdit } from "react-icons/fa";

interface IProps {
  link: ILink | undefined;
}

const LinkCard = ({ link }: IProps) => {
  const iconColor = useColorModeValue("grey", "gray");
  const goTo = useNavigate();

  return (
    <Flex
      gap={3}
      p={2}
      alignItems={"start"}
      border={"1px solid gray"}
      borderRadius={5}
    >
      <Image
        objectFit="cover"
        maxW={{ base: "100px", sm: "50px" }}
        src={getCroppedImageUrl(link?.qrCode || "")}
        alt="Link QR Code"
        borderRadius={5}
        onClick={() => goTo(`/links/${link?.id}`)}
      />

      <Stack mt={2}>
        {link ? (
          <Box>
            <Heading size="sm">{link.title}</Heading>
            <Text py="1" fontSize={14} fontWeight={500}>
              <a target="_blank" href={link.shortUrl}>
                {link.shortUrl}
              </a>
            </Text>
            <Text fontSize={10}>
              <a target="_blank" href={link.longUrl}>
                {link.longUrl}
              </a>
            </Text>
          </Box>
        ) : (
          <NoData message="No Link Data" />
        )}
      </Stack>
      <VStack
        display={"flex"}
        justifyContent={"start"}
        alignItems={"end"}
        flex={1}
      >
        <Icon as={FaCopy} color={iconColor} />
        <Icon as={FaShare} color={iconColor} />
        <Icon as={FaDownload} color={iconColor} />
        <Icon as={FaEdit} color={iconColor} />
      </VStack>
    </Flex>
  );
};

export default LinkCard;
