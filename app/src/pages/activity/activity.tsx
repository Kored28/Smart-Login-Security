import { LogIn, ShieldX, Monitor, Smartphone, Terminal } from 'lucide-react';

import { useEffect, useState } from 'react';
import Header from '../../components/header';
import { 
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '../../components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import ShieldC from '../../assets/Container shield.svg';
import Pagination from '../../components/pagination';
import { Skeleton } from '../../components/ui/skeleton';

interface LoginRecord {
    status: "Success" | "Failed" | "Blocked";
    user: string;
    ip: string;
    userAgent: string;
    timestamp: string;
}


const recents = [
    {
        status: 'Failed',
        user: 'appy',
        ip: '192.168.1.112',
        userAgent: 'unknown',
        timestamp: '3 min',
    },
    {
        status: 'Success',
        user: 'appy',
        ip: '192.162.1.100',
        userAgent: 'Chrome on MacOS',
        timestamp: '5 min',
    },
    {
        status: 'Failed',
        user: 'fred',
        ip: '192.122.1.102',
        userAgent: 'Chrome on Windows',
        timestamp: '10 min',
    },
    {
        status: 'Failed',
        user: 'fred',
        ip: '192.122.1.102',
        userAgent: 'Chrome on Windows',
        timestamp: '10 min',
    },
    {
        status: 'Failed',
        user: 'fred',
        ip: '192.122.1.102',
        userAgent: 'Chrome on Windows',
        timestamp: '10 min',
    },
    {
        status: 'Success',
        user: 'fred',
        ip: '192.122.1.102',
        userAgent: 'Chrome on Windows',
        timestamp: '10 min',
    },
    {
        status: 'Success',
        user: 'fred',
        ip: '192.122.1.102',
        userAgent: 'Chrome on IOS',
        timestamp: '10 min',
    },
    {
        status: 'Blocked',
        user: 'fred',
        ip: '192.122.1.102',
        userAgent: 'Chrome on Android',
        timestamp: '10 min',
    },
];


const DeviceIcon = ({ userAgent }: { userAgent: string }) => {
    console.log('userAgent received:', JSON.stringify(userAgent));
    
    const ua = (userAgent ?? '').toLowerCase();
    if (ua.includes('windows')) {
        return <Monitor className="w-4 h-4 shrink-0 text-secondary-foreground" />;
    }
    if ( ua.includes('macos')) {
        return <Monitor className="w-4 h-4 shrink-0 text-secondary-foreground" />;
    }
    if (ua.includes('ios') || ua.includes('android')) {
        return <Smartphone className="w-4 h-4 shrink-0 text-secondary-foreground" />;
    }
    return <Terminal className="w-4 h-4 text-secondary-foreground" />;
}

const StatusBadge = ({ status }: { status: string }) => {
    const styles: Record<string, string> = {
        Success: "bg-[#FDF3E2] text-[#B4780A]",
        Failed: "bg-[#FBEAEA] text-[#D92D20] border border-[#F4C2C2]",
        Blocked: "bg-[#F2F2F5] text-[#6B7280]",
    };

    return (
        <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-medium ${
                styles[status] ?? styles.Blocked
            }`}
        >
            {status}
        </span>
    );
}

const SkeletonRow = () => {
    return (
        <TableRow className="grid grid-cols-6 items-center px-6">
            <TableCell className="px-0 py-4">
                <Skeleton className="h-4 w-28 shrink-0 bg-secondary-foreground"></Skeleton>
            </TableCell>

            <TableCell className="px-0 py-4">
                <Skeleton className="h-4 w-20 shrink-0 bg-secondary-foreground"></Skeleton>
            </TableCell>

            <TableCell className="px-0 py-4">
                <Skeleton className="h-6 w-16 rounded-full shrink-0 bg-secondary-foreground"></Skeleton>
            </TableCell>

            <TableCell className="px-0 pr-6 py-4 flex flex-row items-center gap-2">
                <Skeleton className="h-4 w-4 rounded-full shrink-0 bg-secondary-foreground"></Skeleton>
                <Skeleton className="h-4 w-32 shrink-0 bg-secondary-foreground"></Skeleton>
            </TableCell>

            <TableCell className="px-0 py-4">
                <Skeleton className="h-4 w-16 shrink-0 bg-secondary-foreground"></Skeleton>
            </TableCell>

            <TableCell className="px-0 py-4 flex items-center gap-2">
                <Skeleton className="h-7 w-20 rounded-[8px] shrink-0 bg-secondary-foreground"></Skeleton>
                <Skeleton className="h-7 w-16 rounded-[8px] shrink-0 bg-secondary-foreground"></Skeleton>
            </TableCell>
        </TableRow>
    );
}


// MAIN FUNCTION
const Activity = () => {
    const [page, setPage] = useState(1);
    //const [recents, setRecents] = useState<LoginRecord[]>([]);
    const [totalEntries, setTotalEntries] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        async function fetchLogs() {
            setIsLoading(true);
            try {
                const response = await fetch(`/wp-json/smart-login-security/v1/logs?page=${page}&per_page=4`);
                const data = await response.json();

                if (!cancelled) {
                    //setRecents(data.rows);
                    setTotalEntries(data.total);
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
    }, [page]);
   
  return (
    <div className='flex flex-col gap-8 max-w-5xl mx-auto'>
       <div className='flex flex-col sm:flex-row justify-between gap-4'>
            <Header
            heading="Recent Login Activity"
            text="Monitor real-time authentication events across your WordPress site."          
            />

            <Tabs
                defaultValue='all'
            >
                <TabsList
                    className='bg-[#DCE9FF] p-1 rounded-[8px]'
                >
                    <TabsTrigger 
                        value="all"
                        className='px-4 py-1.5 active:bg-white rounded-[6px]'
                    >
                        All
                    </TabsTrigger>
                    <TabsTrigger 
                        value="success"
                        className='px-4 py-1.5 active:bg-white rounded-[6px]'
                    >
                        Success
                    </TabsTrigger>
                    <TabsTrigger 
                        value="failed"
                        className='px-4 py-1.5 active:bg-white rounded-[6px]'
                    >
                        Failed
                    </TabsTrigger>
                    <TabsTrigger 
                        value="blocked"
                        className='px-4 py-1.5 active:bg-white rounded-[6px]'
                    >
                        Blocked
                    </TabsTrigger>
                </TabsList>
            </Tabs>
       </div>

       {/* Cards */}
       <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
            <Card className='bg-white border border-bd-secondary rounded-[12px] gap-1 p-5'>
                <CardHeader className='flex flex-row gap-2.75 items-center p-0'>
                    <LogIn color='#0058BE' size={14}/>
                    <h3 className='text-secondary-foreground text-[12px] font-medium leading-4 tracking-[0.6px]'>
                        Total Logins
                    </h3>
                </CardHeader>
                <CardContent className='flex flex-row gap-2 items-end p-0'>
                    <h2 className='text-primary-foreground text-[24px] font-semibold leading-8 tracking-[-0.48px]'>
                        2,481
                    </h2>
                    <p className='text-[#924700] text-[11px] font-semibold leading-3.5'>
                        +12%
                    </p>
                </CardContent>
            </Card>

            
            <Card className='bg-white border border-bd-secondary rounded-[12px] gap-1 p-5'>
                <CardHeader className='flex flex-row gap-2.75 items-center p-0'>
                    <ShieldX color="#BA1A1A" size={14}/>
                    <h3 className='text-secondary-foreground text-[12px] font-medium leading-4 tracking-[0.6px]'>
                        Failed Attempts
                    </h3>
                </CardHeader>
                <CardContent className='flex flex-row gap-2 items-end p-0'>
                    <h2 className='text-primary-foreground text-[24px] font-semibold leading-8 tracking-[-0.48px]'>
                       42
                    </h2>
                    <p className='text-[#924700] text-[11px] font-semibold leading-3.5'>
                        -4%
                    </p>
                </CardContent>
            </Card>

            <Card className='bg-white border border-bd-secondary rounded-[12px] gap-1 p-5'>
                <CardHeader className='flex flex-row gap-2.75 items-center p-0'>
                    <LogIn color='#0058BE' size={14}/>
                    <h3 className='text-secondary-foreground text-[12px] font-medium leading-4 tracking-[0.6px]'>
                        Threats Blocked
                    </h3>
                </CardHeader>
                <CardContent className='flex flex-row gap-2 items-end p-0'>
                    <h2 className='text-primary-foreground text-[24px] font-semibold leading-8 tracking-[-0.48px]'>
                        18
                    </h2>
                    <p className='text-[#924700] text-[11px] font-semibold leading-3.5'>
                        +2
                    </p>
                </CardContent>
            </Card>

            <Card className='bg-[#0058BE0D] relative border border-[#0058BE33] rounded-[12px] gap-1 px-5 pt-5 pb-8'>
                <CardHeader className='flex flex-row gap-2.75 items-center p-0'>
                    <h3 className='text-accent text-[12px] font-bold leading-4 tracking-[0.6px]'>
                        Security Status
                    </h3>
                </CardHeader>
                <CardContent className='flex flex-row gap-2 items-center p-0'>
                    <div className="w-2 h-2 rounded-full bg-[#924700]"></div>
                    <h2 className='text-accent text-[16px] font-semibold leading-6'>
                        Vigilant
                    </h2>
                </CardContent>
                <img src={ShieldC} alt="Shield" className='absolute right-0 bottom-0'/>
            </Card>


        </div>


       {/* Table */}
        <div className="overflow-hidden border border-bd-secondary rounded-[12px] bg-white shadow-sm">
            <Table>
                <TableHeader>
                    <TableRow
                        className="grid grid-cols-6 px-6 h-14.25 bg-[#EFF4FF] border-b border-bd-secondary rounded-t-[12px] py-4"
                    >
                        <TableHead className="text-[12px] font-medium tracking-[0.6px] px-0 h-auto">
                            IP ADDRESS
                        </TableHead>
                        <TableHead className="text-[12px] font-medium tracking-[0.6px] px-0 h-auto">
                            USER
                        </TableHead>
                        <TableHead className="text-[12px] font-medium tracking-[0.6px] px-0 h-auto">
                            STATUS
                        </TableHead>
                        <TableHead className="text-[12px] font-medium tracking-[0.6px] px-0 h-auto">
                            DEVICE
                        </TableHead>
                        <TableHead className="text-[12px] font-medium tracking-[0.6px] px-0 h-auto">
                            TIME
                        </TableHead>
                        <TableHead className="text-[12px] font-medium tracking-[0.6px] px-0 h-auto">
                            ACTIONS
                        </TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody className="bg-white rounded-b-[12px]">
                    {isLoading
                        ? Array.from({ length: 4}).map((_, index) => (
                          <SkeletonRow key={`skeleton-${index}`}></SkeletonRow>
                      ))
                        :   recents.map((recent, index) => (
                                <TableRow key={index} className="grid grid-cols-6 items-center px-6">
                                    <TableCell className="px-0 py-4 text-[14px] font-bold leading-5 text-primary-foreground">
                                        {recent.ip}
                                    </TableCell>

                                    <TableCell className="px-0 py-4 text-primary-foreground text-[14px] font-medium leading-5">
                                        {recent.user}
                                    </TableCell>

                                    <TableCell className="px-0 py-4">
                                        <StatusBadge status={recent.status} />
                                    </TableCell>

                                    <TableCell className="px-0 pr-6 py-4 flex flex-row items-center gap-2 text-[14px] text-muted-foreground">
                                        <DeviceIcon userAgent={recent.userAgent} />
                                        {recent.userAgent}
                                    </TableCell>

                                    <TableCell className="px-0 py-4 text-[14px] text-muted-foreground">
                                        {recent.timestamp} ago
                                    </TableCell>

                                    <TableCell className="px-0 py-4 flex items-center gap-2">
                                        {recent.status === 'Failed' && (
                                            <>
                                                <button className="px-3 py-1 text-[12px] font-medium rounded-[8px] border border-[#D92D20] text-[#D92D20] hover:bg-[#FBEAEA] transition-colors">
                                                    Block IP
                                                </button>
                                                <button className="px-3 py-1 text-[12px] font-medium rounded-[8px] bg-[#EEF0F4] text-primary-foreground hover:bg-[#E2E5EB] transition-colors">
                                                    Details
                                                </button>
                                            </>
                                        )}
                                        {recent.status === 'Blocked' && (
                                            <>
                                                <button
                                                    disabled
                                                    className="px-3 py-1 text-[12px] font-medium rounded-[8px] border border-[#D1D5DB] text-[#9CA3AF] cursor-not-allowed"
                                                >
                                                    Blocked
                                                </button>
                                                <button
                                                    disabled
                                                    className="px-3 py-1 text-[12px] font-medium rounded-[8px] bg-[#F2F2F5] text-[#9CA3AF] cursor-not-allowed"
                                                >
                                                    Details
                                                </button>
                                            </>
                                        )}
                                    </TableCell>
                                </TableRow>
                        ))}
                </TableBody>

                <TableFooter className='bg-white rounded-b-[12px]'>
                    <TableRow>
                        <TableCell colSpan={6} className='p-0'>
                            <Pagination 
                                currentPage={page}
                                totalPages={Math.ceil(recents.length/ 4)}
                                totalEntries={recents.length}
                                entriesPerPage={4}
                                onPageChange={setPage}
                            />
                        </TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
        </div>

    </div>
  )
}

export default Activity;