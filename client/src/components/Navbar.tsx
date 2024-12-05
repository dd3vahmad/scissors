import MNavbar from "./mobile/MNavbar";
import DNavbar from "./desktop/DNavbar";
import { useMediaQuery } from "@chakra-ui/react";

const Navbar = () => {
  const [isMobile] = useMediaQuery("(max-width: 800px)");

  return <div>{isMobile ? <MNavbar /> : <DNavbar />}</div>;
};

export default Navbar;
