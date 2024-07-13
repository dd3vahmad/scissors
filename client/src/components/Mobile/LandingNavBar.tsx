import {
  Button,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { FaChevronRight } from "react-icons/fa6";

const MLandingNavBar = () => {
  return (
    <div>
      <div className="text-xl text-green-500 border">Scissors</div>
      <div>
        <Menu>
          <MenuButton
            as={Button}
            px={2}
            py={2}
            transition="all 0.2s"
            bgColor={"white"}
            borderRadius="sm"
            borderWidth="0px"
            display={"flex"}
            width={"100%"}
            _hover={{ bg: "gray.100" }}
            rightIcon={<FaChevronRight size={15} />}
          >
            <span>Our Services</span>
          </MenuButton>
          <MenuList>
            <MenuItem>New File</MenuItem>
            <MenuItem>New Window</MenuItem>
            <MenuDivider />
            <MenuItem>Open...</MenuItem>
            <MenuItem>Save File</MenuItem>
          </MenuList>
        </Menu>
        <ul>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
        </ul>
      </div>
    </div>
  );
};

export default MLandingNavBar;
