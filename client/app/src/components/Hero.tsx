import { Text, VStack } from "@chakra-ui/react";

const Hero = () => {
  return (
    <VStack>
      <Text
        as={"samp"}
        textAlign="left"
        mt={4}
        fontSize="3xl"
        fontWeight={700}
        px={10}
        pe={55}
      >
        YOUR CONNECTIONS
      </Text>
      <Text
        as={"samp"}
        textAlign="left"
        fontSize="3xl"
        fontWeight={700}
        px={10}
        pe={55}
      >
        IN A
      </Text>
      <Text
        as={"samp"}
        textAlign="left"
        mb={4}
        fontSize="3xl"
        fontWeight={700}
        px={10}
        pe={55}
      >
        SINGLE LOCATION
      </Text>
    </VStack>
  );
};

export default Hero;
