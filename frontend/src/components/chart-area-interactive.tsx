"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import { useIsMobile } from "@/hooks/use-mobile";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export const description = "An interactive area chart";

const chartData = [
  { date: "2024-04-01", youtube: 222, study: 150 },
  { date: "2024-04-02", youtube: 97, study: 180 },
  { date: "2024-04-03", youtube: 167, study: 120 },
  { date: "2024-04-04", youtube: 242, study: 260 },
  { date: "2024-04-05", youtube: 373, study: 290 },
  { date: "2024-04-06", youtube: 301, study: 340 },
  { date: "2024-04-07", youtube: 245, study: 180 },
  { date: "2024-04-08", youtube: 409, study: 320 },
  { date: "2024-04-09", youtube: 59, study: 110 },
  { date: "2024-04-10", youtube: 261, study: 190 },
  { date: "2024-04-11", youtube: 327, study: 350 },
  { date: "2024-04-12", youtube: 292, study: 210 },
  { date: "2024-04-13", youtube: 342, study: 380 },
  { date: "2024-04-14", youtube: 137, study: 220 },
  { date: "2024-04-15", youtube: 120, study: 170 },
  { date: "2024-04-16", youtube: 138, study: 190 },
  { date: "2024-04-17", youtube: 446, study: 360 },
  { date: "2024-04-18", youtube: 364, study: 410 },
  { date: "2024-04-19", youtube: 243, study: 180 },
  { date: "2024-04-20", youtube: 89, study: 150 },
  { date: "2024-04-21", youtube: 137, study: 200 },
  { date: "2024-04-22", youtube: 224, study: 170 },
  { date: "2024-04-23", youtube: 138, study: 230 },
  { date: "2024-04-24", youtube: 387, study: 290 },
  { date: "2024-04-25", youtube: 215, study: 250 },
  { date: "2024-04-26", youtube: 75, study: 130 },
  { date: "2024-04-27", youtube: 383, study: 420 },
  { date: "2024-04-28", youtube: 122, study: 180 },
  { date: "2024-04-29", youtube: 315, study: 240 },
  { date: "2024-04-30", youtube: 454, study: 380 },
  { date: "2024-05-01", youtube: 165, study: 220 },
  { date: "2024-05-02", youtube: 293, study: 310 },
  { date: "2024-05-03", youtube: 247, study: 190 },
  { date: "2024-05-04", youtube: 385, study: 420 },
  { date: "2024-05-05", youtube: 481, study: 390 },
  { date: "2024-05-06", youtube: 498, study: 520 },
  { date: "2024-05-07", youtube: 388, study: 300 },
  { date: "2024-05-08", youtube: 149, study: 210 },
  { date: "2024-05-09", youtube: 227, study: 180 },
  { date: "2024-05-10", youtube: 293, study: 330 },
  { date: "2024-05-11", youtube: 335, study: 270 },
  { date: "2024-05-12", youtube: 197, study: 240 },
  { date: "2024-05-13", youtube: 197, study: 160 },
  { date: "2024-05-14", youtube: 448, study: 490 },
  { date: "2024-05-15", youtube: 473, study: 380 },
  { date: "2024-05-16", youtube: 338, study: 400 },
  { date: "2024-05-17", youtube: 499, study: 420 },
  { date: "2024-05-18", youtube: 315, study: 350 },
  { date: "2024-05-19", youtube: 235, study: 180 },
  { date: "2024-05-20", youtube: 177, study: 230 },
  { date: "2024-05-21", youtube: 82, study: 140 },
  { date: "2024-05-22", youtube: 81, study: 120 },
  { date: "2024-05-23", youtube: 252, study: 290 },
  { date: "2024-05-24", youtube: 294, study: 220 },
  { date: "2024-05-25", youtube: 201, study: 250 },
  { date: "2024-05-26", youtube: 213, study: 170 },
  { date: "2024-05-27", youtube: 420, study: 460 },
  { date: "2024-05-28", youtube: 233, study: 190 },
  { date: "2024-05-29", youtube: 78, study: 130 },
  { date: "2024-05-30", youtube: 340, study: 280 },
  { date: "2024-05-31", youtube: 178, study: 230 },
  { date: "2024-06-01", youtube: 178, study: 200 },
  { date: "2024-06-02", youtube: 470, study: 410 },
  { date: "2024-06-03", youtube: 103, study: 160 },
  { date: "2024-06-04", youtube: 439, study: 380 },
  { date: "2024-06-05", youtube: 88, study: 140 },
  { date: "2024-06-06", youtube: 294, study: 250 },
  { date: "2024-06-07", youtube: 323, study: 370 },
  { date: "2024-06-08", youtube: 385, study: 320 },
  { date: "2024-06-09", youtube: 438, study: 480 },
  { date: "2024-06-10", youtube: 155, study: 200 },
  { date: "2024-06-11", youtube: 92, study: 150 },
  { date: "2024-06-12", youtube: 492, study: 420 },
  { date: "2024-06-13", youtube: 81, study: 130 },
  { date: "2024-06-14", youtube: 426, study: 380 },
  { date: "2024-06-15", youtube: 307, study: 350 },
  { date: "2024-06-16", youtube: 371, study: 310 },
  { date: "2024-06-17", youtube: 475, study: 520 },
  { date: "2024-06-18", youtube: 107, study: 170 },
  { date: "2024-06-19", youtube: 341, study: 290 },
  { date: "2024-06-20", youtube: 408, study: 450 },
  { date: "2024-06-21", youtube: 169, study: 210 },
  { date: "2024-06-22", youtube: 317, study: 270 },
  { date: "2024-06-23", youtube: 480, study: 530 },
  { date: "2024-06-24", youtube: 132, study: 180 },
  { date: "2024-06-25", youtube: 141, study: 190 },
  { date: "2024-06-26", youtube: 434, study: 380 },
  { date: "2024-06-27", youtube: 448, study: 490 },
  { date: "2024-06-28", youtube: 149, study: 200 },
  { date: "2024-06-29", youtube: 103, study: 160 },
  { date: "2024-06-30", youtube: 446, study: 400 },
];

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  youtube: {
    label: "Youtube",
    color: "var(--youtube)",
  },
  study: {
    label: "Study",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

export function ChartAreaInteractive() {
  const isStudy = useIsMobile();
  const [timeRange, setTimeRange] = React.useState("90d");

  React.useEffect(() => {
    if (isStudy) {
      setTimeRange("7d");
    }
  }, [isStudy]);

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date);
    const referenceDate = new Date("2024-06-30");
    let daysToSubtract = 90;
    if (timeRange === "30d") {
      daysToSubtract = 30;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    }
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return date >= startDate;
  });

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Study/Youtube History</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Total for the last 3 months
          </span>
          <span className="@[540px]/card:hidden">Last 3 months</span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="90d">Last 3 months</ToggleGroupItem>
            <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
            <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                Last 3 months
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Last 30 days
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillYoutube" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-youtube)"
                  stopOpacity={1.0}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-youtube)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillStudy" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-study)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-study)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              defaultIndex={isStudy ? -1 : 10}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="study"
              type="natural"
              fill="url(#fillStudy)"
              stroke="var(--color-study)"
              stackId="a"
            />
            <Area
              dataKey="youtube"
              type="natural"
              fill="url(#fillYoutube)"
              stroke="var(--color-youtube)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
