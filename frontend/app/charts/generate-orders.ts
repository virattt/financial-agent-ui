import { faker } from "@faker-js/faker";
import { Order } from "./schema";

export function generateOrders(): Order[] {
  const orders: Order[] = [];

  const products = Array.from({ length: 5 }).map((_) => ({
    productName: faker.commerce.product(),
    amount: faker.number.int({
      min: 10,
      max: 1000,
    }),
  }));

  for (let i = 0; i < 250; i++) {
    const product = faker.helpers.arrayElement(products);
    // 1 in 5 orders (ish) should have a discount
    const shouldApplyDiscount = faker.helpers.arrayElement([
      ...Array.from({ length: 4 }).map((_) => "no"),
      "yes",
    ]);
    const order: Order = {
      ...product,
      id: faker.string.uuid(),
      discount:
        shouldApplyDiscount === "yes"
          ? faker.number.int({ min: 10, max: 75 })
          : undefined,
      address: {
        street: faker.location.streetAddress(),
        city: faker.location.city(),
        state: faker.location.state(),
        zip: faker.location.zipCode(),
      },
      status: faker.helpers.arrayElement([
        "pending",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
        "returned",
      ]),
      orderedAt: faker.date.past(),
    };

    orders.push(order);
  }

  return orders;
}
