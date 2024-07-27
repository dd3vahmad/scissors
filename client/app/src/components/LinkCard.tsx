import { Flex, Icon, Text, VStack } from "@chakra-ui/react";
import ILink from "../entites/Link";
import { BiCopy } from "react-icons/bi";

interface IProps {
  link: ILink;
}

const LinkCard = ({ link }: IProps) => {
  return (
    <Flex
      px={5}
      py={2}
      mx={3}
      my={2}
      rounded={8}
      justifyContent={"space-between"}
      border={2}
    >
      <Flex direction={"column"}>
        <Text>{link.title}</Text>
        <Text fontSize={24}>{link.shortUrl}</Text>
        <Text fontSize={14}>{link.longUrl}</Text>
      </Flex>
      <VStack>
        <Text fontSize={"large"}>{link.clicks}</Text>
        <Icon as={BiCopy} />
      </VStack>
    </Flex>
  );
};

export default LinkCard;
