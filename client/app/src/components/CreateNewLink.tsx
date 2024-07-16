import { Flex, HStack, Icon, Input, Switch, Text } from "@chakra-ui/react";
import { BiLock } from "react-icons/bi";

const CreateNewLink = () => {
  return (
    <>
      <Text fontSize={"3xl"} fontWeight={700}>
        Create new
      </Text>

      <Flex direction={"column"} gap={5}>
        <Flex direction={"column"} gap={2}>
          <Text fontSize={"md"} fontWeight={600}>
            Destination
          </Text>
          <Input
            size={"md"}
            placeholder="https://www.example.com/my-long-url"
          />
        </Flex>
        <Flex direction={"column"} gap={2}>
          <Text fontSize={"md"} fontWeight={600}>
            Title (Optional)
          </Text>
          <Input size={"md"} />
          <HStack>
            <Switch size="md" />
            <Text fontSize="sm" fontWeight={500}>
              Add UTMs to track web traffic in analytics tools
            </Text>
            <Icon size={8} as={BiLock} />
          </HStack>
        </Flex>
      </Flex>
    </>
  );
};

export default CreateNewLink;
