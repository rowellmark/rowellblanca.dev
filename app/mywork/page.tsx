import { MyWork } from "@/components/homepage/my-work";

import Link from "next/link";

import {
    IconCornerUpLeft
} from "@tabler/icons-react";

export default function MyWorkPage() {
    return (
        <>
            <div className="py-28 bg-primary-accent">
                <div className="container mx-auto">
                    <div className="back-button flex items-start pb-6">
                        <Link href="/" className="flex items-center px-4 py-2 uppercase font-semibold rounded-md border border-neutral-300 bg-neutral-100 text-primary text-sm hover:-translate-y-1 transform transition duration-200 hover:shadow-md">
                            <IconCornerUpLeft></IconCornerUpLeft> Back
                        </Link>
                    </div>
                    <MyWork />
                </div>
               
            </div>
        </>
    )
} 

