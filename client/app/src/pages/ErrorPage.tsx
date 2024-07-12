import { Box, Button, Heading, Text } from "@chakra-ui/react";
import {
  isRouteErrorResponse,
  useNavigate,
  useRouteError,
} from "react-router-dom";
import MNavBar from "../components/mobile/MNavbar";

const ErrorPage = () => {
  const navigate = useNavigate();
  const error = useRouteError();
  console.log(error);

  return (
    <Box paddingX={3}>
      <MNavBar />
      <Heading pb={2}>Shoot!...</Heading>
      {isRouteErrorResponse(error) ? (
        <Text>This page does not exist.</Text>
      ) : (
        <Text>An unexpected error occured.</Text>
      )}
      <Button mt={5} onClick={() => navigate("/")}>
        Go Home
      </Button>
    </Box>
  );
};

export default ErrorPage;
