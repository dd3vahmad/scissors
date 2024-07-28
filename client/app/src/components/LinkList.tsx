import { Button, Container, Flex, Text } from "@chakra-ui/react";
import ILink from "../entites/Link";
import LinkCard from "./LinkCard";
import { useNavigate } from "react-router-dom";
import { AddIcon } from "@chakra-ui/icons";

interface IProps {
  links: ILink[];
}
const LinkList = ({ links }: IProps) => {
  const location = useNavigate();

  return (
    <Container>
      <Flex justifyContent={"space-between"} alignItems={"center"} mb={2}>
        <Text fontSize={"larger"} py={2} fontWeight={600}>
          My Sicsly Links:
        </Text>
        <Button borderWidth={2} onClick={() => location("/create-new")}>
          <AddIcon />
        </Button>
      </Flex>
      {links.map((link: ILink) => {
        return <LinkCard link={link} />;
      })}
    </Container>
  );
};

export default LinkList;
