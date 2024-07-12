import { HStack, useDisclosure, useMediaQuery } from "@chakra-ui/react";
import { Link, useLocation } from "react-router-dom";
import MDrawer from "./MDrawer";
import SearchInput from "../SearchInput";
import ColorModeSwitch from "../ColorModeSwitch";
import Logo from "../Logo";

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
      <MDrawer isOpen={isOpen} onClose={onClose} />
    </HStack>
  );
};

export default MNavBar;
