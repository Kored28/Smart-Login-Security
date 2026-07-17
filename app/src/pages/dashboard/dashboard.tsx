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

const events = [
    {
        status: 'Failed',
        event: 'Failed attempt',
        user: 'appy',
        ip: '192.168.1.112',
        userAgent: 'unknown',
        timestamp: '3 min',
    },
    {
        status: 'Success',
        event: 'Success attempt',
        user: 'appy',
        ip: '192.162.1.100',
        userAgent: 'Mac Chrome',
        timestamp: '5 min',
    },
    {
        status: 'Failed',
        event: 'Failed attempt',
        user: 'fred',
        ip: '192.122.1.102',
        userAgent: 'Windows',
        timestamp: '10 min',
    },
];

const Dashboard = () => {
  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto">
        <Header
            heading="Security Overview"
            text="Real-time monitoring of your site's access security."
            buttonIcon={<RotateCcw />}
            buttonText="Force Scan"
            isButton
            isSelect
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
                        <p className="text-[20px] text-foreground font-semibold leading-7 tracking-[-0.2px]">
                            2.5K
                        </p>
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
                        <p className="text-[20px] text-foreground font-semibold leading-7 tracking-[-0.2px]">
                           142
                        </p>
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
                        <p className="text-[20px] text-foreground font-semibold leading-7 tracking-[-0.2px]">
                            2.3k
                        </p>
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
                        <p className="text-[20px] text-foreground font-semibold leading-7 tracking-[-0.2px]">
                           48
                        </p>
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
                        <p className="text-[20px] text-foreground font-semibold leading-7 tracking-[-0.2px]">
                            92
                        </p>
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
                        <div 
                            className="bg-[#DCFCE7] py-1 px-2.5 rounded-full flex flex-row gap-1.5 items-center w-[62.91px]"
                        >
                            <div className="w-2 h-2 rounded-full bg-[#22C55E]"></div>
                            <p className="text-[#15803D] text-[12px] font-bold leading-4 tracking-[0.6px]">Safe</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <AreaChartBoard />
            <BarsChartBoard />
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
                    {events.map((event, index) => (
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
                                            {event.event} : {event.user}
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
                    ))}
                </TableBody>
            </Table>
        </div>

    </div>
  )
}

export default Dashboard