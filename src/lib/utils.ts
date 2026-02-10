import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { PageContent } from "@/types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Sorts pages based on their 'order' property, then by 'createdAt' timestamp.
 * Filters out the special 'header' page.
 */
export function sortPages(pages: PageContent[] | null): PageContent[] {
  if (!pages) return [];
  
  return [...pages]
    .filter(p => p.id !== 'header')
    .sort((a, b) => {
      const orderA = a.order;
      const orderB = b.order;

      // Primary sort: numerical order
      if (orderA !== undefined && orderB !== undefined) {
        if (orderA !== orderB) return orderA - orderB;
      }
      
      // If only one has an order, prioritize it
      if (orderA !== undefined) return -1;
      if (orderB !== undefined) return 1;
      
      // Secondary sort: creation date
      const dateA = a.createdAt?.toMillis() ?? 0;
      const dateB = b.createdAt?.toMillis() ?? 0;
      return dateA - dateB;
    });
}
