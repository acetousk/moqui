import { UserOrderGetters, AgnosticPagination } from '@vue-storefront/core';
import type { CustomerOrders, Order, OrderItem } from '@vue-storefront/moqui-api';
import formatDate from 'src/helpers/formatDate';

function getDate(order: Order): string {
  const orderDate = order?.placedDate || order?.entryDate;
  if (orderDate) {
    return formatDate(orderDate);
  }
  return '';
}

function getOrders(customerOrders: CustomerOrders): Order[] {
  return customerOrders?.orderInfoList || [];
}

function getId(order: Order): string {
  return order?.orderId || '';
}

function getStatus(order: Order): string {
  return order?.statusDescription || '';
}

function getPrice(order: Order): number | null {
  return order?.grandTotal || 0;
}

function getItems(order: Order): OrderItem[] {
  return order?.orderItemList?.filter(item => item.isProduct) || [];
}

function getShippingTotal(order: Order): number {
  return (order?.orderItemList?.filter(item => item.isShipping) || []).reduce((prev, cur) => prev + (cur.quantity * cur.unitAmount), 0);
}
function getTaxTotal(order: Order): number {
  return (order?.orderItemList?.filter(item => item.isTax) || []).reduce((prev, cur) => prev + (cur.quantity * cur.unitAmount), 0);
}
function getDiscountTotal(order: Order): number {
  return (order?.orderItemList?.filter(item => item.isDiscount) || []).reduce((prev, cur) => prev + (cur.quantity * cur.unitAmount), 0);
}
function getItemSku(item: OrderItem): string {
  return item?.productSku || '';
}

function getItemName(item: OrderItem): string {
  return item?.itemDescription || '';
}

function getItemQty(item: OrderItem): number {
  return item?.quantity || 1;
}

function getItemPrice(item: OrderItem): number {
  return item?.unitAmount || 0;
}

function getFormattedPrice(price: number): string {
  return (price || 0).toFixed(2);
}

function getOrdersTotalCount(customerOrders: CustomerOrders): number {
  return customerOrders?.orderInfoListCount || 0;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getOrdersTotal(orders: any): number {
  return 0;
}

function getPagination(customerOrders: CustomerOrders): AgnosticPagination {
  return {
    currentPage: (customerOrders?.orderInfoListPageIndex || 0) + 1,
    totalPages: (customerOrders?.orderInfoListPageMaxIndex || 0) + 1,
    totalItems: (customerOrders?.orderInfoListCount || 0),
    itemsPerPage: (customerOrders?.orderInfoListPageSize || 0),
    pageOptions: [5]
  };
}

export const orderGetters: UserOrderGetters<Order, OrderItem> = {
  getOrders,
  getDate,
  getId,
  getStatus,
  getPrice,
  getItems,
  getShippingTotal,
  getDiscountTotal,
  getTaxTotal,
  getItemSku,
  getItemName,
  getItemQty,
  getItemPrice,
  getFormattedPrice,
  getOrdersTotal,
  getOrdersTotalCount,
  getPagination
};
