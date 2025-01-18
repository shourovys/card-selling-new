export interface IOrderResponse {
  count: number;
  total: number;
  Processing: number;
  Confirmed: number;
  Shipped: number;
  Delivered: number;
  Return: number;
  Cancelled: number;

  totalRevenue: number;
  orderItem: number;
  returnItem: number;
  fulfilledOrders: number;

  orders: IOrder[];
}

export interface IOrder {
  _id: {
    $oid: string;
  };
  user: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  products: IProduct[];
  totalAmount: {
    baseTotal: number;
    discount: number;
    shipping: number;
    tax: number;
    grandTotal: number;
  };
  status: string;
  shipping: IShippingDetails;
  payment: IPaymentDetails;
  notes: INotes;
  delivery: IDeliveryDetails;
  createdAt: {
    $date: string;
  };
  history: any[]; // Update this type based on the actual structure of history if known
  __v: number;
  updatedAt: {
    $date: string;
  };
}

interface IProduct {
  product: {
    $oid: string;
  };
  quantity: number;
  basePrice: number;
  totalPrice: number;
  discount: number;
  _id: {
    $oid: string;
  };
}

interface IShippingDetails {
  name: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

interface IPaymentDetails {
  paymentMethod: string;
  paymentResult: {
    id: string;
    status: string;
    update_time: string;
    email_address: string;
  };
  amount: number;
  status: string;
}

interface INotes {
  customer: string;
  admin: string;
  invoice: string;
  delivery: string;
}

interface IDeliveryDetails {
  deliveryMethod: string;
  deliveryTime: string;
  deliveryCost: number;
  deliveryTrackingLink: string;
  deliveryTrackingId: string;
}

export interface IOrderFilter {
  id: string;
  search: string;
}

export interface IApiQueryParamsBase {
  offset: number;
  limit: number;
  sort_by: string;
  order: 'asc' | 'desc';
}
export interface IOrderApiQueryParams extends IApiQueryParamsBase {
  id?: string;
  status?: string[];
  paymentStatus?: string[];
  date?: string;
  customStartDate?: string;
  customEndDate?: string;
}
