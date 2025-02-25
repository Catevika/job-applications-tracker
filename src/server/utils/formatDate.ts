import { format, isValid, parseISO } from 'date-fns';

export function formatDate(date: Date | string | number): string {
  if (!date) return '';

  let parsedDate: Date;

  if (typeof date === 'string') {
    parsedDate = parseISO(date);
  } else if (typeof date === 'number') {
    parsedDate = new Date(date);
  } else {
    parsedDate = date;
  }

  if (!isValid(parsedDate)) {
    console.error("Invalid date:", date);
    return '';
  }

  try {
    return format(parsedDate, 'MM/dd/yyyy');
  } catch (error) {
    console.error("Error formatting date:", error);
    return '';
  }
}

export function toISOString(date: Date | string | number): string {
  if (!date) return '';

  let parsedDate: Date;

  if (typeof date === 'string') {
    parsedDate = parseISO(date);
  } else if (typeof date === 'number') {
    parsedDate = new Date(date);
  } else {
    parsedDate = date;
  }

  if (!isValid(parsedDate)) {
    console.error("Invalid date:", date);
    return '';
  }

  return parsedDate.toISOString();
}