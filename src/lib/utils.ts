import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatAmount(amount: number): string {
  if (amount >= 100000000) {
    return `${(amount / 100000000).toFixed(0)}億円`;
  } else if (amount >= 10000) {
    return `${(amount / 10000).toFixed(0)}万円`;
  }
  return `${amount.toLocaleString()}円`;
}

export function formatRate(rate: number): string {
  return `${Math.round(rate * 100)}%`;
}
