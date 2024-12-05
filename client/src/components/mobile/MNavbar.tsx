import { HStack, Icon, useDisclosure, useMediaQuery } from "@chakra-ui/react";
import { Link, useLocation } from "react-router-dom";
import MDrawer from "./MDrawer";
import SearchInput from "../SearchInput";
import ColorModeSwitch from "../ColorModeSwitch";
import Logo from "../Logo";
import { FcMenu } from "react-icons/fc";
import { IoClose } from "react-icons/io5";

const MNavBar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isMobile] = useMediaQuery("(max-width: 800px)");
  const { pathname } = useLocation();

  return (
    <HStack padding="10px" paddingBottom={"5px"} gap={{ base: 2, lg: 6 }}>
      <Link to="/">
        <Logo
          onClick={() => {
            if (isMobile && pathname === "/") onOpen();
          }}
          height="12"
          width="12"
        />
      </Link>
      <SearchInput />
      <ColorModeSwitch />
      <Icon onClick={onOpen} boxSize={8} as={isOpen ? IoClose : FcMenu} />
      <MDrawer isOpen={isOpen} onClose={onClose} />
    </HStack>
  );
};

export default MNavBar;
