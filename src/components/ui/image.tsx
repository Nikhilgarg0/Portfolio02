"use client";

import NextImage, { ImageProps } from "next/image";
import { cn } from "@/lib/utils";

export function Image({ className, alt, ...props }: ImageProps) {
    return (
        <div className={cn("overflow-hidden rounded-md", className)}>
            <NextImage
                alt={alt}
                layout="responsive"
                width={800}
                height={600}
                {...props}
                className={cn("h-auto w-auto object-cover transition-all hover:scale-105", className)}
            />
        </div>
    );
}
