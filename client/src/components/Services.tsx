import { Container, List, ListItem, useColorModeValue } from "@chakra-ui/react";
import Service from "./Service";
import services from "../data/services";

const Services = () => {
  const bgColor = useColorModeValue("gray.50", "gray.700");

  return (
    <Container px={7} pb={5}>
      <List bg={bgColor} p={5} spacing={3} borderRadius={8}>
        {services.map((service, i) => {
          return (
            <ListItem key={i}>
              <Service service={service} />
            </ListItem>
          );
        })}
      </List>
    </Container>
  );
};

export default Services;
