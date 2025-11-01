import { User } from '@/types';

export const kpiData = [
  {
    title: 'Total Revenue',
    value: '$45,231.89',
    change: '+20.1% from last month',
    icon: 'DollarSign',
  },
  {
    title: 'Subscriptions',
    value: '+2350',
    change: '+180.1% from last month',
    icon: 'Users',
  },
  {
    title: 'Sales',
    value: '+12,234',
    change: '+19% from last month',
    icon: 'CreditCard',
  },
  {
    title: 'Active Now',
    value: '+573',
    change: '+201 since last hour',
    icon: 'Activity',
  },
];

export const recentSignups: User[] = [
  { id: '1', name: 'Olivia Martin', email: 'olivia.martin@email.com', role: 'USER' },
  { id: '2', name: 'Jackson Lee', email: 'jackson.lee@email.com', role: 'USER' },
  { id: '3', name: 'Isabella Nguyen', email: 'isabella.nguyen@email.com', role: 'ADMIN' },
  { id: '4', name: 'William Kim', email: 'will@email.com', role: 'USER' },
  { id: '5', name: 'Sofia Davis', email: 'sofia.davis@email.com', role: 'USER' },
];

export const chartData = [
  { name: 'Jan', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: 'Feb', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: 'Mar', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: 'Apr', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: 'May', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: 'Jun', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: 'Jul', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: 'Aug', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: 'Sep', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: 'Oct', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: 'Nov', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: 'Dec', total: Math.floor(Math.random() * 5000) + 1000 },
];
