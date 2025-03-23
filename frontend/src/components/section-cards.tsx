import {
  IconTrendingDown,
  IconTrendingUp,
  IconMoodCheck,
} from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function UniqueCard({
  title,
  numTerms,
  lastStudied,
  score,
}: {
  title: string;
  numTerms: number;
  lastStudied: string;
  score: number;
}) {
  return (
    <Card className="@container/card">
      <CardHeader>
        <CardDescription>Study Set</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {title}
        </CardTitle>
        <CardAction>
          <Badge variant="outline">
            <IconMoodCheck />
            Last Test Score: {score}%
          </Badge>
        </CardAction>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5 text-sm">
        <div className="line-clamp-1 flex gap-2 font-medium">
          Number of terms: {numTerms}
        </div>
        <div className="text-muted-foreground">Last Studied: {lastStudied}</div>
      </CardFooter>
    </Card>
  );
}

export function SectionCards() {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <UniqueCard
        title="Philosophy"
        numTerms={10}
        lastStudied="April 24, 2024"
        score={80}
      />
      <UniqueCard
        title="History"
        numTerms={23}
        lastStudied="March 4, 2025"
        score={88}
      />
      <UniqueCard
        title="History"
        numTerms={23}
        lastStudied="March 4, 2025"
        score={88}
      />
      <UniqueCard
        title="History"
        numTerms={23}
        lastStudied="March 4, 2025"
        score={88}
      />
    </div>
  );
}
