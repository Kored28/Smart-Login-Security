import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import {
  Card,
  CardContent,
  CardAction,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "../../components/ui/chart";
import { Skeleton } from "../../components/ui/skeleton";

interface DailyStat {
  day: string;
  date: string;
  success: number;
  failed: number;
  attempts: number;
}

interface BarsChartBoardProps {
  data: DailyStat[];
  isLoading?: boolean;
}

const chartConfig = {
  success: {
    label: "Success",
    color: "#2170E4",
  },
  failed: {
    label: "Failed",
    color: "#BA1A1A",
  },
} satisfies ChartConfig;


const BarsChartBoard = ({ data, isLoading }: BarsChartBoardProps) => {
  return (
    <Card
      className={`bg-[#FFFFFFCC] p-6 border border-[#E2E8F0CC] 
        rounded-[12px] backdrop-blur-sm flex flex-col
      `}
    >
      <CardHeader className="px-0.5 flex flex-row items-center justify-between gap-4">
        <CardTitle className="text-base font-semibold leading-6">
          Failed vs Successful
        </CardTitle>
        <CardAction className="flex flex-row items-center gap-3">
          <div 
            className="rounded-full flex flex-row gap-1.5 items-center"
          >
            <div className="w-3 h-3 rounded-full bg-[#2170E4]"></div>
            <p className="text-secondary-foreground text-[12px] font-bold leading-4 tracking-[0.6px]">Success</p>
          </div>
          <div 
            className="rounded-full flex flex-row gap-1.5 items-center"
          >
            <div className="w-3 h-3 rounded-full bg-[#BA1A1A]"></div>
            <p className="text-secondary-foreground text-[12px] font-bold leading-4 tracking-[0.6px]">Failed</p>
          </div>
        </CardAction>
      </CardHeader>
      <CardContent className="px-0">
        {isLoading ? (
            <Skeleton className="h-[200px] w-full bg-secondary-foreground" />
        ) : (
            <ChartContainer config={chartConfig}>
                <BarChart
                  accessibilityLayer
                  data={data}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                  dataKey="day"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                  />
                  <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dashed" />}
                  />
                  <Bar dataKey="success" fill="var(--color-success)" radius={4} />
                  <Bar dataKey="failed" fill="var(--color-failed)" radius={4} />
                </BarChart>
            </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}

export default BarsChartBoard