import {
  ChartData,
  Chart as ChartJS,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Pie } from "react-chartjs-2";

// Register the necessary components
ChartJS.register(ArcElement, Title, Tooltip, Legend);

interface IProps {
  chartData: ChartData<"pie", (number | [number, number] | null)[], unknown>;
  title: string;
}

const PieChart = ({ chartData, title }: IProps) => {
  return (
    <div className="self-center w-1/2">
      <Pie
        data={chartData}
        options={{
          plugins: {
            title: {
              display: true,
              text: title,
            },
            legend: {
              display: false,
            },
          },
        }}
      />
    </div>
  );
};

export default PieChart;
