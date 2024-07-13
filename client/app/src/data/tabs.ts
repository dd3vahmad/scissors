import { BiHome, BiLink } from "react-icons/bi";
import { ImQrcode } from "react-icons/im";
import { IoAnalyticsOutline } from "react-icons/io5";
import { RiPagesLine } from "react-icons/ri";
import ITab from "../entites/Tab";

const tabs: ITab[] = [
  {
    name: "Home",
    icon: BiHome,
    path: "/",
  },
  {
    name: "Links",
    icon: BiLink,
    path: "/links",
  },
  {
    name: "QR Codes",
    icon: ImQrcode,
    path: "/qrcodes",
  },
  {
    name: "Pages",
    icon: RiPagesLine,
    path: "/pages",
  },
  {
    name: "Analytics",
    icon: IoAnalyticsOutline,
    path: "/analytics",
  },
];

export default tabs;
