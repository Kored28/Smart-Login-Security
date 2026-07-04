import { CalendarDays } from "lucide-react";
import { Button } from "../components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { timelines } from '../components/store'
import { useState } from "react";


interface HeaderProps {
    heading: string;
    text: string;
    isSelect?: boolean;
    buttonText?: string;
    buttonIcon?: React.ReactElement;
    buttonClicked?: () => void;
}

const Header: React.FC<HeaderProps> = ({
    heading, 
    text,
    isSelect,
    buttonText,
    buttonIcon, 
    buttonClicked
}) => {
    const [selectedDays, setSelectedDays] = useState<number>(7)
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center">
        <div className="flex flex-col gap-0">
            <h1 className="font-semibold text-[24px] leading-2 tracking-[-0.48px]">
                {heading}
            </h1>
            <p className="text-p-foreground text-sm leading-2 my-0">
                {text}
            </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
            {isSelect && (
                <>
                    <Select
                        value={String(selectedDays)}
                        onValueChange={(val) => setSelectedDays(Number(val))}
                    >
                        <SelectTrigger className="rounded-[8px]">
                            <CalendarDays />
                            <SelectValue placeholder="Select timeline" />
                        </SelectTrigger>
                        <SelectContent
                            position="popper"
                            className="bg-primary"
                        >
                            <SelectGroup>
                                {Object.entries(timelines).map(([key, value]) => (
                                    <SelectItem key={key} value={key}>{value}</SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>

                    </Select>
                </>
            )}

            <Button 
            onClick={buttonClicked}
            className="bg-accent hover:bg-accent text-accent-foreground text-xs leading-3.5 py-2.5 px-4 rounded-[8px]"
            >
                {buttonIcon}
                {buttonText}
            </Button>
        </div>
    </div>
  )
}

export default Header