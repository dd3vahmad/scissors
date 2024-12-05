import { Flex, Image, Switch, Text } from "@chakra-ui/react";
import getCroppedImageUrl from "../Utils/image-url";

const LinkPageShare = () => {
  return (
    <>
      <Flex direction={"column"} gap={5} mt={7}>
        <Flex direction={"column"} gap={2}>
          <Text fontSize={"xl"} fontWeight={700}>
            Sicsly Page (optional)
          </Text>
          <Flex alignItems={"center"} justifyContent={"space-between"} gap={2}>
            <Switch size="md" />
            <Text fontSize={"sm"} fontWeight={600}>
              Add this link to your page for people to easily find
            </Text>
          </Flex>
          <Flex alignItems={"center"} justifyContent={"space-between"}>
            <Image src={getCroppedImageUrl("")} />
          </Flex>
        </Flex>
      </Flex>
    </>
  );
};

export default LinkPageShare;
