import {
  ChartData,
  Chart as ChartJS,
  LineElement,
  PointElement,
  LineController,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

// Register the necessary components
ChartJS.register(
  LineElement,
  PointElement,
  LineController,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

interface IProps {
  chartData: ChartData<"line", (number | [number, number] | null)[], unknown>;
}

const LineChart = ({ chartData }: IProps) => {
  return (
    <div className="self-center w-1/2">
      <Line
        data={chartData}
        options={{
          plugins: {
            title: {
              display: true,
              text: "Link impressions for the past 5 days",
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

export default LineChart;
