import { Flex, Icon, Text, useColorModeValue } from "@chakra-ui/react";
import { FaFolderOpen } from "react-icons/fa6";

interface IProps {
  message: string;
}

const NoData = ({ message }: IProps) => {
  const bgColor = useColorModeValue("white", "gray.800");
  const color = useColorModeValue("gray.400", "gray.700");

  return (
    <Flex
      direction={"column"}
      justifyContent={"center"}
      alignItems={"center"}
      mx={0}
      my={"auto"}
      borderRadius="md"
      bg={bgColor}
      height={"45vh"}
      borderBottomWidth={2}
    >
      <Icon color={color} as={FaFolderOpen} boxSize={14} />
      <Text color={color} fontWeight={600} fontSize={"lg"}>
        {message}
      </Text>
    </Flex>
  );
};

export default NoData;
