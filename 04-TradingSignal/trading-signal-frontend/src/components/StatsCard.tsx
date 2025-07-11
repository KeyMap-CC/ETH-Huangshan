
import { Card, CardContent } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: string;
  change?: number;
  prefix?: string;
  suffix?: string;
}

export const StatsCard = ({ title, value, change, prefix, suffix }: StatsCardProps) => {
  const getChangeColor = (change?: number) => {
    if (!change) return "text-muted-foreground";
    return change >= 0 ? "text-green-500" : "text-red-500";
  };

  return (
    <Card className="bg-card border-border">
      <CardContent className="p-6">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">{title}</p>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-foreground">
              {prefix}{value}{suffix}
            </span>
            {change !== undefined && (
              <span className={`text-sm font-medium ${getChangeColor(change)}`}>
                {change >= 0 ? '+' : ''}{change.toFixed(2)}%
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
