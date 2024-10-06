<script setup lang="ts">
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const orders = [
  {
    orderId: 'ORD001',
    status: 'Shipped',
    totalAmount: '$320.00',
    shippingMethod: 'Express',
  },
  {
    orderId: 'ORD002',
    status: 'Processing',
    totalAmount: '$180.00',
    shippingMethod: 'Standard',
  },
  {
    orderId: 'ORD003',
    status: 'Cancelled',
    totalAmount: '$420.00',
    shippingMethod: 'Express',
  },
  {
    orderId: 'ORD004',
    status: 'Delivered',
    totalAmount: '$550.00',
    shippingMethod: 'Next Day',
  },
  {
    orderId: 'ORD005',
    status: 'Shipped',
    totalAmount: '$270.00',
    shippingMethod: 'Standard',
  },
  {
    orderId: 'ORD006',
    status: 'Processing',
    totalAmount: '$190.00',
    shippingMethod: 'Express',
  },
  {
    orderId: 'ORD007',
    status: 'Delivered',
    totalAmount: '$380.00',
    shippingMethod: 'Standard',
  },
]
</script>

<template>
  <div>
    <Table>
      <TableCaption>A list of your recent orders.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead class="w-[100px]">Order ID</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Shipping</TableHead>
          <TableHead class="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="order in orders" :key="order.orderId">
          <TableCell class="font-medium">{{ order.orderId }}</TableCell>
          <TableCell>
            <span
                :class="[
                'px-2 py-1 text-xs rounded',
                'bg-gray-100 text-gray-900'
              ]"
            >
              {{ order.status }}
            </span>
          </TableCell>
          <TableCell>{{ order.shippingMethod }}</TableCell>
          <TableCell class="text-right">{{ order.totalAmount }}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>