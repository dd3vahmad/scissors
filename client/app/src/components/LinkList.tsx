import { Container, Flex, Icon, Stack, Text } from "@chakra-ui/react";
import ILink from "../entites/Link";
import LinkCard from "./LinkCard";
import { useNavigate } from "react-router-dom";
import { IoAddSharp } from "react-icons/io5";

interface IProps {
  links: ILink[];
  onDeleteLink: () => void;
}
const LinkList = ({ links, onDeleteLink }: IProps) => {
  const location = useNavigate();

  return (
    <Container>
      <Flex justifyContent={"space-between"} alignItems={"center"} mb={2}>
        <Text fontSize={"larger"} py={2} fontWeight={600}>
          My Sicsly Links:
        </Text>
        <Flex gap={2} onClick={() => location("/create-new")}>
          <Text fontWeight={600}>Create</Text>
          <Icon
            as={IoAddSharp}
            borderRadius={"50%"}
            minInlineSize={26}
            minBlockSize={26}
            borderWidth={2}
          />
        </Flex>
      </Flex>
      <Stack>
        {links.map((link: ILink, i) => {
          return <LinkCard onDelete={onDeleteLink} key={i} link={link} />;
        })}
      </Stack>
    </Container>
  );
};

export default LinkList;
