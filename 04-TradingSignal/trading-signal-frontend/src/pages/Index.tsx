import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StrategyCard } from "@/components/StrategyCard";
import { StatsCard } from "@/components/StatsCard";
import { TraderAvatar } from "@/components/TraderAvatar";
import LoginModal from "@/components/auth/LoginModal";
import { useAuthStore } from "@/store/useAuthStore";
import { useAuth } from "@/hooks/useAuth";
import {
  TrendingUp,
  DollarSign,
  Users,
  Activity,
  Plus,
  Filter,
  LogIn,
  LogOut,
} from "lucide-react";

const Index = () => {
  // 模拟数据
  const mockStrategies = [
    {
      traderName: "CryptoMaster2024",
      traderAvatar: "/placeholder.svg",
      platform: "币安期货",
      investedAmount: 5000,
      totalAUM: 2500000,
      runningDays: 89,
      monthlyReturn: 15.67,
      maxDrawdown: -12.3,
      status: "unfollow" as const,
    },
    {
      traderName: "AI量化策略",
      traderAvatar: "/placeholder.svg",
      platform: "OKX",
      investedAmount: 3000,
      totalAUM: 1200000,
      runningDays: 156,
      monthlyReturn: -2.45,
      maxDrawdown: -8.7,
      status: "paused" as const,
    },
    {
      traderName: "稳健收益王",
      traderAvatar: "/placeholder.svg",
      platform: "TradingFlow",
      investedAmount: 8000,
      totalAUM: 890000,
      runningDays: 234,
      monthlyReturn: 8.92,
      maxDrawdown: -5.2,
      status: "following" as const,
    },
    {
      traderName: "短线高手",
      traderAvatar: "/placeholder.svg",
      platform: "币安现货",
      investedAmount: 2500,
      totalAUM: 450000,
      runningDays: 67,
      monthlyReturn: 22.31,
      maxDrawdown: -18.9,
      status: "following" as const,
    },
  ];

  const totalInvested = mockStrategies.reduce(
    (sum, strategy) => sum + strategy.investedAmount,
    0
  );
  const followingStrategies = mockStrategies.filter(
    (s) => s.status === "following"
  ).length;
  const unfollowStrategies = mockStrategies.filter(
    (s) => s.status === "unfollow"
  ).length;
  const avgReturn =
    mockStrategies.reduce((sum, strategy) => sum + strategy.monthlyReturn, 0) /
    mockStrategies.length;

  const { wholeUser } = useAuthStore();
  const { isAuthenticated, logout } = useAuth(); // 使用isAuthenticated而不是fetchUser
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // 移除可能导致循环请求的useEffect，认证状态检查由useAuth内部处理

  return (
    <div className="min-h-screen bg-background">
      {/* 页头 */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">跟单交易</h1>
              <p className="text-muted-foreground mt-1">
                管理您的跟单策略投资组合
              </p>
            </div>
            <div className="flex space-x-3 items-center">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                筛选
              </Button>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                添加策略
              </Button>
              {wholeUser ? (
                <div className="flex items-center space-x-3">
                  <TraderAvatar
                    src={wholeUser.user?.avatar || "/avatar.png"}
                    name={wholeUser.user?.name || "用户"}
                    size="md"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={logout}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    登出
                  </Button>
                </div>
              ) : (
                <Button
                  size="sm"
                  onClick={() => setIsLoginModalOpen(true)}
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  登录
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* 总览统计 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="总投资金额"
            value={totalInvested.toLocaleString()}
            prefix="$"
          />
          <StatsCard
            title="活跃策略"
            value={followingStrategies.toString()}
            suffix="个"
          />
          <StatsCard
            title="平均收益率"
            value={avgReturn.toFixed(2)}
            suffix="%"
            change={avgReturn}
          />
          <StatsCard
            title="今日盈亏"
            value="1,247.83"
            prefix="$"
            change={3.26}
          />
        </div>

        {/* 策略列表 */}
        <Tabs defaultValue="all" className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList className="bg-muted">
              <TabsTrigger value="all">
                全部策略 ({mockStrategies.length})
              </TabsTrigger>
              <TabsTrigger value="unfollow">
                未跟单 ({unfollowStrategies})
              </TabsTrigger>
              <TabsTrigger value="following">
                跟单中 ({followingStrategies})
              </TabsTrigger>
              <TabsTrigger value="paused">
                已暂停 (
                {mockStrategies.length -
                  unfollowStrategies -
                  followingStrategies}
                )
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="all" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {mockStrategies.map((strategy, index) => (
                <StrategyCard key={index} {...strategy} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="unfollow" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {mockStrategies
                .filter((s) => s.status === "unfollow")
                .map((strategy, index) => (
                  <StrategyCard key={index} {...strategy} />
                ))}
            </div>
          </TabsContent>

          <TabsContent value="following" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {mockStrategies
                .filter((s) => s.status === "following")
                .map((strategy, index) => (
                  <StrategyCard key={index} {...strategy} />
                ))}
            </div>
          </TabsContent>

          <TabsContent value="paused" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {mockStrategies
                .filter((s) => s.status === "paused")
                .map((strategy, index) => (
                  <StrategyCard key={index} {...strategy} />
                ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* 风险提示 */}
        <Card className="mt-8 bg-card border-border">
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground flex items-center">
              <Activity className="h-4 w-4 mr-2" />
              风险提示
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p>
              跟单交易存在风险，过往表现不代表未来收益。请根据自身风险承受能力谨慎投资，合理配置资金。
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 登录模态框 */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </div>
  );
};

export default Index;
