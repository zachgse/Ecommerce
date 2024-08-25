import { format } from 'date-fns';

export function formatMoney(amount){
    return Math.floor(amount)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function formatDate(dateString) {
    const date = new Date(dateString);
    return format(date, 'MMMM dd, yyyy | hh:mm a');
};