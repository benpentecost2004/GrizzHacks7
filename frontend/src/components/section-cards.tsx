'use client';

import { useEffect, useState } from 'react';
import { IconMoodCheck } from '@tabler/icons-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

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
  const [titles, setTitles] = useState<string[]>([]);

  useEffect(() => {
    const fetchTitles = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/get_subjects_by_user');
        const data = await response.json();

        // Count occurrences of each subject
        const frequencyMap: Record<string, number> = {};
        data.forEach((subject: string) => {
          frequencyMap[subject] = (frequencyMap[subject] || 0) + 1;
        });

        // Sort subjects by frequency in descending order
        const sortedTitles = Object.entries(frequencyMap)
          .sort((a, b) => b[1] - a[1]) // Sort by frequency
          .map(([subject]) => subject); // Extract subject names

        // Take the top 4 subjects
        setTitles(sortedTitles.slice(0, 4));
      } catch (error) {
        console.error('Failed to fetch titles:', error);
      }
    };

    fetchTitles();
  }, []);

  return (
    <div className="grid grid-cols-2 gap-4 px-4 lg:px-6">
      {titles.map((title, index) => (
        <UniqueCard
          key={index}
          title={title}
          numTerms={10}
          lastStudied="April 24, 2024"
          score={80}
        />
      ))}
    </div>
  );
}
