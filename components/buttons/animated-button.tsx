"use client";
import React from "react";
import { Button } from "../ui/moving-border";

interface AnimatedButtonProps {
    label: string;
    link?: string;
    className?: string;
}

export function AnimatedButton({ label, link, className }: AnimatedButtonProps) {
    return (
        <div>
            <Button
                borderRadius="1.75rem"
                className="bg-white dark:bg-slate-900 text-black dark:text-white border-neutral-200 dark:border-slate-800 font-semibold"
            >
                Say Hello!
            </Button>
        </div>
    );
}
