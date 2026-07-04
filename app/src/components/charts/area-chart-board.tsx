import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "../ui/chart";

const chartData = [
  { day: "Monday", attempts: 186 },
  { day: "Tuesday", attempts: 305 },
  { day: "Wednesday", attempts: 237 },
  { day: "Thursday", attempts: 73 },
  { day: "Friday", attempts: 209 },
  { day: "Saturday", attempts: 214 },
];

const chartConfig = {
  attempts: {
    label: "Attempts",
    color: "#0058BE",
  },
} satisfies ChartConfig;

const AreaChartBoard = () => {
  return (
    <Card
        className={`bg-[#FFFFFFCC] p-6 border border-[#E2E8F0CC] 
            rounded-[12px] backdrop-blur-sm flex flex-col
        `}
    >
        <CardHeader className="px-0.5">
            <CardTitle className="text-base font-semibold leading-6">
                Login Attempts Over Time
            </CardTitle>
            <CardAction>
                <div 
                    className=" rounded-full flex flex-row gap-1.5 items-center w-[62.91px]"
                >
                    <div className="w-3 h-3 rounded-full bg-[#0058BE]"></div>
                    <p className="text-secondary-foreground text-[12px] font-bold leading-4 tracking-[0.6px]">Safe</p>
                </div>
            </CardAction>
        </CardHeader>
        <CardContent className="px-0">
            <ChartContainer config={chartConfig}>
                <AreaChart
                    accessibilityLayer
                    data={chartData}
                    margin={{
                        left: 12,
                        right: 12,
                    }}
                >
                    <CartesianGrid vertical={false} />
                    <XAxis
                    dataKey="day"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    padding={{ left: 2, right: 2 }}
                    tickFormatter={(value) => value.slice(0, 3)}
                    />
                    <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="line" />}
                    />
                    <Area
                    dataKey="attempts"
                    type="natural"
                    fill="var(--color-attempts)"
                    fillOpacity={0.4}
                    stroke="var(--color-attempts)"
                    />
                </AreaChart>
            </ChartContainer>
        </CardContent>
    </Card>
  )
}

export default AreaChartBoard;