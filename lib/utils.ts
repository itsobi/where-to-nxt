import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const createChatRoomId = (userId: string, recipientUserId: string) => {
  const sortedIds = [userId, recipientUserId].sort();
  return sortedIds.join('-');
};

export const convertToSubcurrency = (amount: number, factor = 100) => {
  return Math.round(amount * factor);
};
