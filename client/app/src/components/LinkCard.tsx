import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Heading,
  HStack,
  Icon,
  Image,
  Stack,
  Text,
} from "@chakra-ui/react";
import ILink from "../entites/Link";
import getCroppedImageUrl from "../Utils/image-url";
import {
  FaCopy,
  FaInstagram,
  FaShare,
  FaTiktok,
  FaTwitter,
  FaWhatsapp,
} from "react-icons/fa6";

interface IProps {
  link: ILink;
}

const LinkCard = ({ link }: IProps) => {
  return (
    <Card
      direction={{ base: "column", sm: "row" }}
      overflow="hidden"
      variant="outline"
      mb={5}
      shadow={"2xl"}
    >
      <Image
        objectFit="cover"
        maxW={{ base: "100%", sm: "200px" }}
        src={getCroppedImageUrl(link.qrCode || "")}
        alt="Link QR Code"
      />

      <Stack>
        <CardBody>
          <Heading size="md">{link.title}</Heading>
          <Text py="1" fontSize={24} fontWeight={500}>
            {link.shortUrl}
          </Text>
          <Text fontSize={15}>{link.longUrl}</Text>
        </CardBody>

        <CardFooter>
          <HStack>
            <Button variant="solid" colorScheme="blue">
              <Icon as={FaCopy} />
            </Button>
            <Button variant="solid" colorScheme="green">
              <Icon as={FaWhatsapp} />
            </Button>
            <Button variant="solid" colorScheme="blue">
              <Icon as={FaTwitter} />
            </Button>
            <Button variant="solid" colorScheme="blue">
              <Icon as={FaTiktok} />
            </Button>
            <Button variant="solid" colorScheme="blue">
              <Icon as={FaInstagram} />
            </Button>
            <Button variant="solid" colorScheme="red">
              <Icon as={FaShare} />
            </Button>
          </HStack>
        </CardFooter>
      </Stack>
    </Card>
  );
};

export default LinkCard;
