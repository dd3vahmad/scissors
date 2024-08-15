import { Text, VStack } from "@chakra-ui/react";

const Hero = () => {
  return (
    <VStack display={"flex"} justifyContent={"center"} alignItems={"center"}>
      <Text
        as={"samp"}
        textAlign="center"
        mt={4}
        fontSize={{ base: "3xl", sm: "4xl", md: "3xl", lg: "4xl" }}
        fontWeight={700}
        px={{ base: 4, sm: 6, md: 8, lg: 10 }}
      >
        YOUR CONNECTIONS
      </Text>
      <Text
        as={"samp"}
        textAlign="left"
        fontSize={{ base: "3xl", sm: "4xl", md: "3xl", lg: "4xl" }}
        fontWeight={700}
        px={{ base: 4, sm: 6, md: 8, lg: 10 }}
      >
        IN A
      </Text>
      <Text
        as={"samp"}
        textAlign="left"
        mb={4}
        fontSize={{ base: "3xl", sm: "4xl", md: "3xl", lg: "4xl" }}
        fontWeight={700}
        px={{ base: 4, sm: 6, md: 8, lg: 10 }}
      >
        SINGLE LOCATION
      </Text>
    </VStack>
  );
};

export default Hero;
