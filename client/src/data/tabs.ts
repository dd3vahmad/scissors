import { BiHome, BiLink } from "react-icons/bi";
import { ImQrcode } from "react-icons/im";
import { IoAnalyticsOutline } from "react-icons/io5";
import { RiPagesLine } from "react-icons/ri";
import ITab from "../entites/Tab";

const tabs: ITab[] = [
  {
    name: "Dashboard",
    icon: BiHome,
    path: "/app",
  },
  {
    name: "Links",
    icon: BiLink,
    path: "/app/links",
  },
  {
    name: "QR Codes",
    icon: ImQrcode,
    path: "/app/qrcodes",
  },
  {
    name: "Pages",
    icon: RiPagesLine,
    path: "/app/pages",
  },
  {
    name: "Custom Urls",
    icon: BiLink,
    path: "/app/custom-urls",
  },
  {
    name: "Analytics",
    icon: IoAnalyticsOutline,
    path: "/app/analytics",
  },
];

export default tabs;
