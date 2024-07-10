"use client";

import { Copy, CreditCard, MoreVertical, Truck } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import { Skeleton } from "../ui/skeleton";
import { format } from "date-fns";

export type LineItem = {
  id: string;
  name: string;
  quantity: number;
  price: number;
};

export type ShippingAddress = {
  name: string;
  street: string;
  city: string;
  state: string;
  zip: string;
};

export type CustomerInfo = {
  name: string;
  email?: string;
  phone?: string;
};

export type PaymentInfo = {
  cardType: string;
  cardNumberLastFour: string;
};

export interface InvoiceProps {
  orderId: string;
  lineItems: LineItem[];
  shippingAddress?: ShippingAddress;
  customerInfo?: CustomerInfo;
  paymentInfo?: PaymentInfo;
}

export function InvoiceLoading(): JSX.Element {
  return (
    <Card className="overflow-hidden w-[700px]">
      <CardHeader className="flex flex-row items-start bg-muted/50">
        <div className="grid gap-0.5"></div>
      </CardHeader>
      <CardContent className="p-6 text-sm">
        <div className="grid gap-3">
          <div className="font-semibold">Order Details</div>
          <ul className="grid gap-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <li
                key={`order-detail=${i}`}
                className="flex items-center justify-between"
              >
                <span className="text-muted-foreground">
                  <Skeleton className="h-[12px] w-[250px]" />
                </span>
                <span>
                  <Skeleton className="h-[12px] w-[100px]" />
                </span>
              </li>
            ))}
          </ul>
          <Separator className="my-2" />
          <ul className="grid gap-3">
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>
                <Skeleton className="h-[12px] w-[100px]" />
              </span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span>
                <Skeleton className="h-[12px] w-[100px]" />
              </span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">Tax</span>
              <span>
                <Skeleton className="h-[12px] w-[100px]" />
              </span>
            </li>
            <li className="flex items-center justify-between font-semibold">
              <span className="text-muted-foreground">Total</span>
              <span>
                <Skeleton className="h-[12px] w-[100px]" />
              </span>
            </li>
          </ul>
        </div>
        <Separator className="my-4" />
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-3">
            <div className="font-semibold">Shipping Information</div>
            <address className="grid gap-0.5 not-italic text-muted-foreground">
              <span>
                <Skeleton className="h-[12px] w-[150px]" />
              </span>
              <span>
                <Skeleton className="h-[12px] w-[200px]" />
              </span>
              <span>
                <Skeleton className="h-[12px] w-[250px]" />
              </span>
            </address>
          </div>
          <div className="grid auto-rows-max gap-3">
            <div className="font-semibold">Billing Information</div>
            <address className="grid gap-0.5 not-italic text-muted-foreground">
              <span>
                <Skeleton className="h-[12px] w-[150px]" />
              </span>
              <span>
                <Skeleton className="h-[12px] w-[200px]" />
              </span>
              <span>
                <Skeleton className="h-[12px] w-[250px]" />
              </span>
            </address>
          </div>
        </div>
        <Separator className="my-4" />
        <div className="grid gap-3">
          <div className="font-semibold">Customer Information</div>
          <dl className="grid gap-3">
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Customer</dt>
              <dd>
                <Skeleton className="h-[12px] w-[150px]" />
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Email</dt>
              <dd>
                <a href="mailto:">
                  <Skeleton className="h-[12px] w-[150px]" />
                </a>
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Phone</dt>
              <dd>
                <a href="tel:">
                  <Skeleton className="h-[12px] w-[150px]" />
                </a>
              </dd>
            </div>
          </dl>
        </div>
        <Separator className="my-4" />
        <div className="grid gap-3">
          <div className="font-semibold">Payment Information</div>
          <dl className="grid gap-3">
            <div className="flex items-center justify-between">
              <dt className="flex items-center gap-1 text-muted-foreground">
                <CreditCard className="h-4 w-4" />
                <Skeleton className="h-[12px] w-[200px]" />
              </dt>
              <dd>
                <Skeleton className="h-[12px] w-[250px]" />
              </dd>
            </div>
          </dl>
        </div>
      </CardContent>
      <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
        <div className="flex flex-row gap-3 items-center text-xs text-muted-foreground">
          Updated <Skeleton className="h-[12px] w-[250px]" />
        </div>
      </CardFooter>
    </Card>
  );
}

export function Invoice(props: InvoiceProps): JSX.Element {
  const [priceDetails, setPriceDetails] = useState({
    shipping: 5.0,
    tax: 0.0,
    total: 0.0,
    lineItemTotal: 0.0,
  });
  const currentMonth = format(new Date(), "MMMM");
  const currentDay = format(new Date(), "EEEE");
  const currentYear = format(new Date(), "yyyy");

  useEffect(() => {
    if (props.lineItems.length > 0) {
      const totalPriceLineItems = props.lineItems
        .reduce((acc, lineItem) => {
          return acc + lineItem.price * lineItem.quantity;
        }, 0)
        .toFixed(2);
      const shipping = 5.0;
      const tax = Number(totalPriceLineItems) * 0.075;
      const total = (Number(totalPriceLineItems) + shipping + tax).toFixed(2);
      setPriceDetails({
        shipping,
        tax,
        total: Number(total),
        lineItemTotal: Number(totalPriceLineItems),
      });
    }
  }, [props.lineItems]);

  return (
    <Card className="overflow-hidden w-[700px]">
      <CardHeader className="flex flex-row items-start bg-muted/50">
        <div className="grid gap-0.5">
          <CardTitle className="group flex items-center gap-2 text-lg">
            Order {props.orderId}
            <Button
              size="icon"
              variant="outline"
              className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
            >
              <Copy className="h-3 w-3" />
              <span className="sr-only">Copy Order ID</span>
            </Button>
          </CardTitle>
          <CardDescription>
            Date: {currentMonth} {currentDay}, {currentYear}
          </CardDescription>
        </div>
        <div className="ml-auto flex items-center gap-1">
          <Button size="sm" variant="outline" className="h-8 gap-1">
            <Truck className="h-3.5 w-3.5" />
            <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
              Track Order
            </span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="outline" className="h-8 w-8">
                <MoreVertical className="h-3.5 w-3.5" />
                <span className="sr-only">More</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuItem>Export</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Trash</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="p-6 text-sm">
        <div className="grid gap-3">
          <div className="font-semibold">Order Details</div>
          <ul className="grid gap-3">
            {props.lineItems.map((lineItem) => {
              const totalPrice = (lineItem.price * lineItem.quantity).toFixed(
                2,
              );
              return (
                <li
                  key={lineItem.id}
                  className="flex items-center justify-between"
                >
                  <span className="text-muted-foreground">
                    {lineItem.name} x <span>{lineItem.quantity}</span>
                  </span>
                  <span>${totalPrice}</span>
                </li>
              );
            })}
          </ul>
          <Separator className="my-2" />
          <ul className="grid gap-3">
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>${priceDetails.lineItemTotal}</span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span>${priceDetails.shipping}</span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">Tax</span>
              <span>${priceDetails.tax}</span>
            </li>
            <li className="flex items-center justify-between font-semibold">
              <span className="text-muted-foreground">Total</span>
              <span>${priceDetails.total}</span>
            </li>
          </ul>
        </div>

        {props.shippingAddress && (
          <>
            <Separator className="my-4" />
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-3">
                <div className="font-semibold">Shipping Information</div>
                <address className="grid gap-0.5 not-italic text-muted-foreground">
                  <span>{props.shippingAddress.name}</span>
                  <span>{props.shippingAddress.street}</span>
                  <span>
                    {props.shippingAddress.city} {props.shippingAddress.state},{" "}
                    {props.shippingAddress.zip}
                  </span>
                </address>
              </div>
              <div className="grid auto-rows-max gap-3">
                <div className="font-semibold">Billing Information</div>
                <div className="text-muted-foreground">
                  Same as shipping address
                </div>
              </div>
            </div>
          </>
        )}

        {props.customerInfo && (
          <>
            <Separator className="my-4" />
            <div className="grid gap-3">
              <div className="font-semibold">Customer Information</div>
              <dl className="grid gap-3">
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Customer</dt>
                  <dd>{props.customerInfo.name}</dd>
                </div>
                {props.customerInfo.email && (
                  <div className="flex items-center justify-between">
                    <dt className="text-muted-foreground">Email</dt>
                    <dd>
                      <a href="mailto:">{props.customerInfo.email}</a>
                    </dd>
                  </div>
                )}
                {props.customerInfo.phone && (
                  <div className="flex items-center justify-between">
                    <dt className="text-muted-foreground">Phone</dt>
                    <dd>
                      <a href="tel:">{props.customerInfo.phone}</a>
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          </>
        )}

        {props.paymentInfo && (
          <>
            <Separator className="my-4" />
            <div className="grid gap-3">
              <div className="font-semibold">Payment Information</div>
              <dl className="grid gap-3">
                <div className="flex items-center justify-between">
                  <dt className="flex items-center gap-1 text-muted-foreground">
                    <CreditCard className="h-4 w-4" />
                    {props.paymentInfo.cardType}
                  </dt>
                  <dd>**** **** **** {props.paymentInfo.cardNumberLastFour}</dd>
                </div>
              </dl>
            </div>
          </>
        )}
      </CardContent>
      <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
        <div className="text-xs text-muted-foreground">
          Updated <time dateTime="2023-11-23">November 23, 2023</time>
        </div>
      </CardFooter>
    </Card>
  );
}
