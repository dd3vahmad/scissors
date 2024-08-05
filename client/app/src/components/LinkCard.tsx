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

interface IProps {
  link: ILink;
}

const LinkCard = ({ link }: IProps) => {
  const iconColor = useColorModeValue("grey", "gray");

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
        src={getCroppedImageUrl(link.qrCode || "")}
        alt="Link QR Code"
        borderRadius={5}
      />

      <Stack>
        <Box>
          <Heading size="sm">{link.title}</Heading>
          <Text py="1" fontSize={14} fontWeight={500}>
            {link.shortUrl}
          </Text>
          <Text fontSize={10}>{link.longUrl}</Text>
        </Box>
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
      </VStack>
    </Flex>
  );
};

export default LinkCard;
