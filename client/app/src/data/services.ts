export interface IService {
  name: string;
  title: string;
  path: string;
  banner: string;
}

const services: IService[] = [
  {
    name: "Links",
    title: "Make It Short And Precise",
    path: "/links",
    banner: "",
  },
  {
    name: "QR Codes",
    title: "Make It Scannable",
    path: "/qrcodes",
    banner: "",
  },
  {
    name: "Pages",
    title: "Put It All In A Page",
    path: "/pages",
    banner: "",
  },
  {
    name: "Analytics",
    title: "View Link Analytics",
    path: "/analytics",
    banner: "",
  },
];

export default services;
