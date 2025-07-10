
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TraderAvatar } from "./TraderAvatar";
import { TrendingUp, TrendingDown, Clock, DollarSign } from "lucide-react";
import { useState } from "react";

interface StrategyCardProps {
  traderName: string;
  traderAvatar?: string;
  platform: string;
  investedAmount: number;
  totalAUM: number;
  runningDays: number;
  monthlyReturn: number;
  maxDrawdown: number;
  status: "following" | "paused" | "unfollow";
}

export const StrategyCard = (props: StrategyCardProps) => {
  const {
    traderName,
    traderAvatar,
    platform,
    investedAmount,
    totalAUM,
    runningDays,
    monthlyReturn,
    maxDrawdown,
  } = props;
  const [status, setStatus] = useState<"following" | "paused" | "unfollow">(
    props.status || "unfollow"
  );

  // 跟单按钮点击事件，后续可在此调用后端接口
  const handleFollowClick = () => {
    if (status === "unfollow") {
      setStatus("following");
    } else if (status === "following") {
      setStatus("paused");
    }
    
    else if (status === "paused") {
      setStatus("following");
    }
    // TODO: 在这里调用后端接口
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M`;
    }
    if (amount >= 1000) {
      return `${(amount / 1000).toFixed(1)}K`;
    }
    return amount.toLocaleString();
  };

  return (
    <Card className="bg-card border-border hover:border-primary/50 transition-colors">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <TraderAvatar src={traderAvatar} name={traderName} size="lg" />
            <div>
              <h3 className="font-semibold text-foreground">{traderName}</h3>
              <p className="text-sm text-muted-foreground">{platform}</p>
            </div>
          </div>
          <Badge 
            variant={status === "following" ? "default" : "secondary"}
            className={status === "following" ? "bg-green-500/10 text-green-500 border-green-500/20" : ""}
          >
            {status === "following" ? "跟单中" : "已暂停"}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">投入资金</p>
            <p className="font-semibold text-foreground flex items-center">
              ${formatCurrency(investedAmount)}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">管理规模</p>
            <p className="font-semibold text-foreground">
              ${formatCurrency(totalAUM)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              运行天数
            </p>
            <p className="font-semibold text-foreground">{runningDays}天</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground flex items-center">
              {monthlyReturn >= 0 ? (
                <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1 text-red-500" />
              )}
              30日收益率
            </p>
            <p className={`font-semibold ${monthlyReturn >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {monthlyReturn >= 0 ? '+' : ''}{monthlyReturn.toFixed(2)}%
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">最大回撤</p>
            <p className="font-semibold text-red-500">-{Math.abs(maxDrawdown).toFixed(2)}%</p>
          </div>
        </div>

        <div className="flex space-x-2 pt-2">
          <Button variant="outline" size="sm" className="flex-1">
            调整金额
          </Button>
          <Button 
            variant={status === "following" ? "destructive" : "default"} 
            size="sm" 
            className="flex-1"
            onClick={handleFollowClick}
          >
            {status === "following"
              ? "停止跟单"
              : status === "paused"
              ? "恢复跟单"
              : "开始跟单"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
