// import { Button, Flex, Text, useColorModeValue } from "@chakra-ui/react";
// import { useNavigate } from "react-router-dom";
import LinkCard from "../components/LinkCard";
import ILink from "../entites/Link";
import { Text } from "@chakra-ui/react";

interface IProps {
  link: ILink;
}

const Link = ({ link }: IProps) => {
  // const location = useNavigate();
  // const bgColor = useColorModeValue("gray.100", "gray.800");
  // const bgColor1 = useColorModeValue("white", "gray.800");
  // const color = useColorModeValue("gray.400", "whitesmoke");

  return (
    <>
      <LinkCard link={link} />
      <Text>Charts</Text>
    </>
  );
};

export default Link;
