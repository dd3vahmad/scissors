import { Box, Button, Heading, Text } from "@chakra-ui/react";

const _404 = () => {
  return (
    <Box
      width={"80%"}
      height={"100vh"}
      margin={"auto"}
      display={"flex"}
      flexDirection={"column"}
      justifyContent={"center"}
      alignItems={"center"}
    >
      <Heading>404</Heading>
      <Heading size={"lg"} color={"red.300"}>
        Page Not Found
      </Heading>
      <Text mt={4} textAlign={"center"}>
        Oops! The page you are looking for does not exist. The resource you are
        looking for may not exist or has been removed.
      </Text>
      <Button mt={4} colorScheme={"teal"} onClick={() => window.history.back()}>
        Go Back
      </Button>
    </Box>
  );
};

export default _404;
