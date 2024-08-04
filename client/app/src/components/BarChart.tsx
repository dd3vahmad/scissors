import { ChartData } from "chart.js";
import { Bar } from "react-chartjs-2";

interface IProps {
  chartData: ChartData<"bar", (number | [number, number] | null)[], unknown>;
}

const BarChart = ({ chartData }: IProps) => {
  return (
    <div className="self-center w-1/2">
      <Bar
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

export default BarChart;
