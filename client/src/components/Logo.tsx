import { Box } from "@chakra-ui/react";
import ILogo from "../entites/Logo";

const Logo = ({ onClick, height, width }: ILogo) => (
  <Box
    as="svg"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 64 64"
    width={width}
    height={height}
    onClick={onClick}
  >
    {/* Link chain */}
    <g id="chain" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21,21 L29,29 M43,21 L35,29" strokeLinecap="round" />
      <rect
        x="14"
        y="14"
        width="8"
        height="24"
        rx="4"
        ry="4"
        transform="rotate(-45 18 26)"
      />
      <rect
        x="42"
        y="14"
        width="8"
        height="24"
        rx="4"
        ry="4"
        transform="rotate(45 46 26)"
      />
    </g>
    {/* Scissors */}
    <g id="scissors" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="24" cy="24" r="6" />
      <circle cx="40" cy="24" r="6" />
      <path d="M30,30 L12,48" />
      <path d="M34,30 L52,48" />
      <path d="M30,30 L34,30" />
    </g>
  </Box>
);

export default Logo;
