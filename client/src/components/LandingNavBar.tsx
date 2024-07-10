import MLandingNavBar from "./Mobile/LandingNavBar";
import DLandingNavBar from "./Desktop/LandingNavBar";

const LandingNavBar = () => {
  return (
    <div className="border border-red-500">
      <MLandingNavBar />
      <DLandingNavBar />
    </div>
  );
};

export default LandingNavBar;
