import { Container, Flex, Stack, Text } from "@chakra-ui/react";
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
        <Flex gap={2} onClick={() => location("/create-new")}>
          <Text fontWeight={600}>Create</Text>
          <AddIcon
            px={4}
            py={2}
            borderRadius={"50%"}
            minInlineSize={26}
            minBlockSize={26}
            borderWidth={2}
          />
        </Flex>
      </Flex>
      <Stack>
        {links.map((link: ILink, i) => {
          return <LinkCard key={i} link={link} />;
        })}
      </Stack>
    </Container>
  );
};

export default LinkList;
