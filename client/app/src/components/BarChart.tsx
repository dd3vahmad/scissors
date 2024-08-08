import {
  ChartData,
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

// Register the necessary components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface IProps {
  chartData:
    | ChartData<"bar", (number | [number, number] | null)[], unknown>
    | any;
  title: string;
}

const BarChart = ({ chartData, title }: IProps) => {
  return (
    <div className="self-center w-1/2">
      <Bar
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

export default BarChart;
