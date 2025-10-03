"use client";
import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "~/components/ui/popover";
import {
    Dialog,
    DialogContent,
} from "~/components/ui/dialog";

const ICON = `M20.2,15.7L20.2,15.7c1.1-1.6,1.8-3.6,1.8-5.7c0-5.6-4.5-10-10-10S2,4.5,2,10c0,2,0.6,3.9,1.6,5.4c0,0.1,0.1,0.2,0.2,0.3
  c0,0,0.1,0.1,0.1,0.2c0.2,0.3,0.4,0.6,0.7,0.9c2.6,3.1,7.4,7.6,7.4,7.6s4.8-4.5,7.4-7.5c0.2-0.3,0.5-0.6,0.7-0.9
  C20.1,15.8,20.2,15.8,20.2,15.7z`;

type PinProps = {
    size?: number;
    open: boolean;
    onOpenChange?: (open: boolean) => void;
    popoverContent?: React.ReactNode;
    flying?: boolean;
};

function Pin({ size = 40, open, onOpenChange, popoverContent, flying = false }: PinProps) {
    const [showDialog, setShowDialog] = React.useState(false);

    React.useEffect(() => {
        if (flying) {
            onOpenChange?.(false);
            setShowDialog(false);
        }
    }, [flying, onOpenChange]);

    const handlePopoverClick = () => {
        setShowDialog(true);
        onOpenChange?.(false);
    };

    return (
        <Popover open={!flying && (open || showDialog)} onOpenChange={(isOpen) => {
            if (!isOpen) {
                setShowDialog(false);
                onOpenChange?.(false);
            }
        }}>
            <PopoverTrigger asChild>
                <motion.svg
                    height={size}
                    viewBox="0 0 24 30"
                    style={{ cursor: "pointer", fill: "#d00", stroke: "none" }}
                    initial={{ scale: 0, y: -20 }}
                    animate={{ scale: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <ellipse cx="12" cy="26" rx="6" ry="2.5" fill="rgba(0,0,0,0.3)" />
                    <path d={ICON} />
                    <circle cx="12" cy="10" r="4" fill="white" />
                </motion.svg>
            </PopoverTrigger>
            <PopoverContent side="right" align="center" className={`w-auto p-3 ${flying && "hidden"}`}>
                <AnimatePresence mode="wait">
                    {showDialog ? (
                        <motion.div
                            key="dialog"
                            initial={{ opacity: 0, scale: 0.95, x: -10 }}
                            animate={{ opacity: 1, scale: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.95, x: -10 }}
                            transition={{ duration: 0.2 }}
                            className="max-w-96 w-96"
                        >
                            {popoverContent || (
                                <div>
                                    <h2 className="text-2xl font-bold mb-4">Chat with Claudiii</h2>
                                    <p className="text-gray-600">Start your conversation here...</p>
                                </div>
                            )}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="trigger"
                            initial={{ opacity: 0, scale: 0.95, x: -10 }}
                            animate={{ opacity: 1, scale: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.95, x: -10 }}
                            transition={{ duration: 0.2 }}
                            className="text-sm cursor-pointer hover:text-gray-600"
                            onClick={handlePopoverClick}
                        >
                            Chat with Claudiii
                        </motion.div>
                    )}
                </AnimatePresence>
            </PopoverContent>
        </Popover>
    );
}

export default React.memo(Pin);