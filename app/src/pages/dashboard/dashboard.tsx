import { GlobeOff, LogIn, RotateCcw, ShieldAlert, ShieldCheck, ShieldX } from "lucide-react";

import Header from "../../components/header";
import ShieldDiagonal from '../../assets/shield-diagonal.svg';
import ShieldLove from '../../assets/shield-love.svg';
import AreaChartBoard from "../../components/charts/area-chart-board";
import BarsChartBoard from "../../components/charts/bars-chart-board";
import { Card, CardContent } from "../../components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { useEffect, useState } from "react";
import { Skeleton } from "../../components/ui/skeleton";

// Types
interface LoginRecord {
    status: "Success" | "Failed" | "Blocked";
    user: string;
    ip: string;
    userAgent: string;
    timestamp: string;
}

type SecurityStatus = 'Secure' | 'Vigilant' | 'Under Attack';

interface Stats {
    threats_blocked: number;
    security_score: number;
    security_status: SecurityStatus;
}

interface DailyStat {
    day: string;
    date: string;
    success: number;
    failed: number;
    attempts: number;
}

const threatConfig: Record<SecurityStatus, { label: string; dot: string; bg: string; text: string }> = {
    'Secure':       { label: 'Safe',         dot: 'bg-[#22C55E]', bg: 'bg-[#DCFCE7]', text: 'text-[#15803D]' },
    'Vigilant':     { label: 'Vigilant',     dot: 'bg-[#F59E0B]', bg: 'bg-[#FEF3C7]', text: 'text-[#B45309]' },
    'Under Attack': { label: 'Under Attack', dot: 'bg-[#DC2626]', bg: 'bg-[#FEE2E2]', text: 'text-[#B91C1C]' },
};


const Dashboard = () => {
    const [events, setEvents] = useState<LoginRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isStatsLoading, setIsStatsLoading] = useState(true);
    const [stats, setStats] = useState<Stats>({
        threats_blocked: 0,
        security_score: 100,
        security_status: 'Secure',
    });
    const [selectedDays, setSelectedDays] = useState<number>(7);
    const [dailyStats, setDailyStats] = useState<DailyStat[]>([]);
    const [isDailyLoading, setIsDailyLoading] = useState(true);

    // GET Logs
    useEffect(() => {
        let cancelled = false;

        async function fetchLogs() {
            setIsLoading(true);
            try {
                const response = await fetch(
                    `${window.smartLoginSecurity.apiUrl}/logs?per_page=4`,
                    {
                        headers: {
                            'X-WP-Nonce': window.smartLoginSecurity.nonce,
                        },
                    }
                );
                const data = await response.json();

                if (!cancelled) {
                    setEvents(data.rows);
                }
            } catch (error) {
                console.error("Failed to fetch login logs:", error);
            } finally {
                if (!cancelled) {
                    setIsLoading(false);
                }
            }
        }

        fetchLogs();

        return () => {
            cancelled = true;
        };
    }, [status]);

    // GET stats
    useEffect(() => {
        async function fetchStats() {
            setIsStatsLoading(true);
            try {
                const response = await fetch(
                    `${window.smartLoginSecurity.apiUrl}/logs/stats`,
                    {
                        headers: {
                            'X-WP-Nonce': window.smartLoginSecurity.nonce,
                        },
                    }
                );
                const data = await response.json();
                setStats(data);
            } catch (error) {
                console.error("Failed to fetch stats:", error);
            } finally {
                setIsStatsLoading(false);
            }
        }

        fetchStats();
    }, []);

    useEffect(() => {
        async function fetchDaily() {
            setIsDailyLoading(true);
            try {
                const response = await fetch(
                    `${window.smartLoginSecurity.apiUrl}/logs/daily?days=${selectedDays}`,
                    {
                        headers: {
                            'X-WP-Nonce': window.smartLoginSecurity.nonce,
                        },
                    }
                );
                const data = await response.json();
                setDailyStats(data);
            } catch (error) {
                console.error("Failed to fetch daily stats:", error);
            } finally {
                setIsDailyLoading(false);
            }
        }

        fetchDaily();
    }, [selectedDays]);

    const derivedTotals = dailyStats.reduce(
        (acc, day) => ({
            total_logins: acc.total_logins + day.attempts,
            failed_attempts: acc.failed_attempts + day.failed,
            success_attempts: acc.success_attempts + day.success,
        }),
        { total_logins: 0, failed_attempts: 0, success_attempts: 0 }
    );

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto">
        <Header
            heading="Security Overview"
            text="Real-time monitoring of your site's access security."
            buttonIcon={<RotateCcw />}
            buttonText="Force Scan"
            isButton
            isSelect
            selectedDays={selectedDays}
            onDaysChange={setSelectedDays}
        />

        {/* Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <Card 
                className={`bg-[#FFFFFFCC] p-5 border border-[#E2E8F0CC] 
                    rounded-[12px] backdrop-blur-sm flex flex-col
                `}
            >
                <CardContent className="p-0 flex flex-col gap-4">
                    <div className="flex flex-row gap-6.75 items-start justify-between">
                        <div className="bg-[#0058BE1A] p-2 rounded-[8px] h-8.5 w-8.5">
                            <LogIn size={18} strokeWidth={3} className="text-[#0058BE]"/>
                        </div>
                        <div className="bg-[#0058BE1A] py-0.5 px-2 rounded-[8px]">
                            <p className="text-[#0058BE] text-[11px] font-semibold">12%</p>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-xs font-medium text-secondary-foreground leading-4 ">
                            TOTAL ATTEMPTS
                        </h2>
                        {isDailyLoading ? (
                            <Skeleton className="h-8 w-16 bg-secondary-foreground" />
                        ) : (
                            <p className="text-[20px] text-foreground font-semibold leading-7 tracking-[-0.2px]">
                                {derivedTotals.total_logins.toLocaleString()}
                            </p>
                        )}
                    </div>
                </CardContent>
            </Card>
            
            <Card 
                className={`bg-[#FFFFFFCC] p-5 border border-border 
                    rounded-[12px] backdrop-blur-sm flex flex-col 
                `}
            >
                <CardContent className="p-0 flex flex-col gap-4">
                    <div className="flex flex-row gap-6.75 items-start justify-between">
                        <div className="bg-[#BA1A1A1A] p-2 rounded-[8px] h-8.5 w-8.5">
                            <ShieldX size={18} strokeWidth={3} className="text-[#BA1A1A]"/>
                        </div>
                        <div className="bg-[#BA1A1A1A] py-0.5 px-2 rounded-[8px]">
                            <p className="text-[#BA1A1A] text-[11px] font-semibold">-5%</p>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-xs font-medium text-secondary-foreground leading-4 ">
                            FAILED LOGINS
                        </h2>
                        {isDailyLoading ? (
                            <Skeleton className="h-8 w-12 bg-secondary-foreground" />
                        ) : (
                            <p className="text-[20px] text-foreground font-semibold leading-7 tracking-[-0.2px]">
                                {derivedTotals.failed_attempts.toLocaleString()}
                            </p>
                        )}
                    </div>
                </CardContent>
            </Card>

            <Card 
                className={`bg-[#FFFFFFCC] p-5 border border-border 
                    rounded-[12px] backdrop-blur-sm flex flex-col 
                `}
            >
                <CardContent className="p-0 flex flex-col gap-4">
                    <div className="flex flex-row gap-6.75 items-start justify-between">
                        <div className="bg-[#B75B001A] p-2 rounded-[8px] h-8.5 w-8.5">
                            <ShieldCheck size={18} strokeWidth={3} className="text-[#924700]"/>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-xs font-medium text-secondary-foreground leading-4 ">
                            SUCCESSFUL
                        </h2>
                        {isDailyLoading ? (
                            <Skeleton className="h-8 w-12 bg-secondary-foreground" />
                        ) : (
                            <p className="text-[20px] text-foreground font-semibold leading-7 tracking-[-0.2px]">
                                {derivedTotals.success_attempts.toLocaleString()}
                            </p>
                        )}
                    </div>
                </CardContent>
            </Card>

            <Card 
                className={`bg-[#FFFFFFCC] p-5 border border-border 
                    rounded-[12px] backdrop-blur-sm flex flex-col 
                `}
            >
                <CardContent className="p-0 flex flex-col gap-4">
                    <div className="flex flex-row gap-6.75 items-start justify-between">
                        <div className="bg-[#D5E0F8] p-2 rounded-[8px] h-8.5 w-8.5">
                            <GlobeOff size={18} strokeWidth={3} className="text-secondary-foreground"/>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-xs font-medium text-secondary-foreground leading-4 ">
                            BLOCKED IPS
                        </h2>
                        {isStatsLoading ? (
                            <Skeleton className="h-8 w-12 bg-secondary-foreground" />
                        ) : (
                            <p className="text-[20px] text-foreground font-semibold leading-7 tracking-[-0.2px]">
                                {stats.threats_blocked.toLocaleString()}
                            </p>
                        )}
                    </div>
                </CardContent>
            </Card>
                    
            <Card 
                className={`bg-[#FFFFFFCC] p-5 border border-border 
                    rounded-[12px] backdrop-blur-sm flex flex-col 
                `}
            >
                <CardContent className="p-0 flex flex-col gap-4">
                    <div className="flex flex-row gap-6.75 items-start justify-between">
                        <div className="bg-[#0058BE1A] p-2 rounded-[8px] h-8.5 w-8.5">
                            <img src={ShieldDiagonal} className="w-4 h-5"/>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-xs font-medium text-secondary-foreground leading-4 ">
                            SECURITY SCORE
                        </h2>
                        {isStatsLoading ? (
                            <Skeleton className="h-8 w-12 bg-secondary-foreground" />
                        ) : (
                            <p className="text-[20px] text-foreground font-semibold leading-7 tracking-[-0.2px]">
                                {stats.security_score}
                            </p>
                        )}
                    </div>
                </CardContent>
            </Card>
                    
            <Card 
                className={`bg-[#FFFFFFCC] p-5 border border-border 
                    rounded-[12px] backdrop-blur-sm flex flex-col 
                `}
            >
                <CardContent className="p-0 flex flex-col gap-4">
                    <div className="flex flex-row gap-6.75 items-start justify-between">
                        <div className="bg-[#DCFCE7] p-2 rounded-[8px] h-8.5 w-8.5">
                            <img src={ShieldLove} className="w-4 h-5"/>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-xs font-medium text-secondary-foreground leading-4 ">
                            THREAT LEVEL
                        </h2>
                        {isStatsLoading ? (
                            <Skeleton className="h-6 w-20 bg-secondary-foreground" />
                        ) : (
                            <div 
                                className={`${threatConfig[stats.security_status].bg} py-1 px-2.5 rounded-full flex flex-row gap-1.5 items-center w-fit`}
                            >
                                <div className={`w-2 h-2 rounded-full ${threatConfig[stats.security_status].dot}`}></div>
                                <p className={`${threatConfig[stats.security_status].text} text-[12px] font-bold leading-4 tracking-[0.6px]`}>
                                    {threatConfig[stats.security_status].label}
                                </p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <AreaChartBoard data={dailyStats} isLoading={isDailyLoading} />
            <BarsChartBoard data={dailyStats} isLoading={isDailyLoading} />
        </div>

        {/* Table */}
        <div className="overflow-hidden border border-bd-secondary rounded-[12px] bg-white shadow-sm">
            <Table>
                <TableHeader>
                    <TableRow 
                        className={`flex flex-row items-center justify-between px-6 h-14.25
                            bg-[#EFF4FF] border-b border-bd-secondary rounded-t-[12px] py-4
                        `}
                    >
                        <TableHead className="text-base font-semibold leading-6 px-0 h-auto">
                            Critical Activity Logs
                        </TableHead>

                        <a href="/logs" className="text-accent text-xs leading-4 tracking-[0.6px]">
                            View All Logs
                        </a>
                    </TableRow>
                </TableHeader>
                <TableBody className="bg-white">
                    {isLoading ? (
                        Array.from({ length: 4 }).map((_, index) => (
                            <TableRow key={`skeleton-${index}`}>
                                <TableCell className="flex flex-row justify-between items-center px-6 py-4">
                                    <div className="flex flex-row gap-4">
                                        <Skeleton className="w-10 h-10 rounded-full bg-secondary-foreground" />
                                        <div className="flex flex-col gap-1.5 justify-center">
                                            <Skeleton className="h-4 w-24 bg-secondary-foreground" />
                                            <Skeleton className="h-3.5 w-40 bg-secondary-foreground" />
                                        </div>
                                    </div>

                                    <Skeleton className="h-3 w-16 bg-secondary-foreground" />
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        events.map((event, index) => (
                            <TableRow key={index}>
                                <TableCell className="flex flex-row justify-between items-center px-6 py-4">
                                    <div className="flex flex-row gap-4">
                                        {event.status === 'Failed' ? 
                                            <div className="bg-[#BA1A1A1A] w-10 h-10 rounded-full flex justify-center items-center">
                                                <ShieldAlert color="#BA1A1A"/>
                                            </div> 
                                        : 
                                            <div className="bg-[#dcfce7] w-10 h-10 rounded-full flex justify-center items-center">
                                                <ShieldCheck color="#16A34A" />
                                            </div> 
                                        }
                                        <div className="flex flex-col">
                                            <h3 className="text-sm text-primary-foreground font-bold leading-5">
                                                {event.user}
                                            </h3>
                                            <p className="text-p-foreground text-[13px] leading-4.5">
                                                IP: {event.ip} • Location: {event.userAgent}
                                            </p>
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-primary-foreground text-xs leading-4 tracking-[0.6px]">
                                            {event.timestamp} ago
                                        </p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>

    </div>
  )
}

export default Dashboard