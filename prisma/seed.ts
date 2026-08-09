import bcrypt from 'bcrypt'
import prisma from '../src/lib/prisma';
import { Order_Status, PaymentMethod, PaymentProvider, PaymentStatus, Role } from './generated/prisma/enums';
import type { Decimal } from '@prisma/client/runtime/index-browser';
import { randomUUID } from 'node:crypto';

async function main() {
    const password = await bcrypt.hash('password123', 10);

    const [customer1, customer2, provider1, provider2, admin] = await Promise.all([
        prisma.user.create({
            data: {
                name: 'Fahim',
                email: 'fahim18@gmail.com',
                password,
                role: Role.CUSTOMER,
            }
        }),
        prisma.user.create({
            data: {
                name: 'Rahim',
                email: 'rahim18@gmail.com',
                password,
                role: Role.CUSTOMER,
            }
        }),
        prisma.user.create({
            data: {
                name: 'karim',
                email: 'karim18@gmail.com',
                password,
                role: Role.PROVIDER,
            }
        }),

        prisma.user.create({
            data: {
                name: 'jamil',
                email: 'jamil18@gmail.com',
                password,
                role: Role.PROVIDER,
            }
        }),
        prisma.user.create({
            data: {
                name: 'admin',
                email: 'admin18@gmail.com',
                password,
                role: Role.ADMIN,
            }
        })
    ]
    )

    console.log('5 User created');

    const [category1, category2, category3, category4] = await Promise.all([
        prisma.category.create({
            data: {
                name: "Cycling",
                description: "Gear and equipment for cycling and bike riding."
            }
        }),
        prisma.category.create({
            data: {
                name: "Camping",
                description: "Essential gear and equipment for outdoor camping and adventures."
            }
        }),
        prisma.category.create({
            data: {
                name: "Fitness",
                description: "Equipment and accessories for workouts, exercise, and fitness activities."
            }
        }),
        prisma.category.create({
            data: {
                name: "Water Sports",
                description: "Gear and equipment for water-based sports and recreational activities."
            }
        })
    ])

    console.log('4 category created');


    const gears = [];
    const GearToCreate = [
        {
            provider_id: provider1.id,
            category_id: category1.id,
            name: "Mountain Bike",
            price_per_day: 800,
            available_stock: 10,

        },
        {
            provider_id: provider2.id,
            category_id: category2.id,
            name: "Road Bike",
            price_per_day: 1000,
            available_stock: 8,

        },
        {
            provider_id: provider1.id,
            category_id: category3.id,
            name: "Camping Tent",
            price_per_day: 500,
            available_stock: 15,

        },
        {
            provider_id: provider2.id,
            category_id: category4.id,
            name: "Sleeping Bag",
            price_per_day: 300,
            available_stock: 20,

        },
        {
            provider_id: provider1.id,
            category_id: category1.id,
            name: "Dumbbell Set",
            price_per_day: 250,
            available_stock: 12,

        },


    ];

    for (const gearData of GearToCreate) {
        const gear = await prisma.gear.create({ data: gearData })
        gears.push(gear)
    }

    console.log(`${GearToCreate.length} gears created`);

    const OrderToCreate = [
        {
            customer_id: customer1.id,
            gear: gears[0],
            total_amount: 1600,
            startDate: new Date("2026-08-10"),
            endDate: new Date("2026-08-12"),
            status: Order_Status.PENDING,
            paymentStatus: PaymentStatus.PENDING
        },
        {
            customer_id: customer2.id,
            gear: gears[1],
            total_amount: 3000,
            startDate: new Date("2026-08-11"),
            endDate: new Date("2026-08-14"),
            status: Order_Status.CONFIRM,
            paymentStatus: PaymentStatus.PAID
        },
        {
            customer_id: customer1.id,
            gear: gears[3],
            total_amount: 1000,
            startDate: new Date("2026-08-15"),
            endDate: new Date("2026-08-17"),
            status: Order_Status.PENDING,
            paymentStatus: PaymentStatus.PENDING
        },
        {
            customer_id: customer1.id,
            gear: gears[4],
            total_amount: 900,
            startDate: new Date("2026-08-18"),
            endDate: new Date("2026-08-20"),
            status: Order_Status.CONFIRM,
            paymentStatus: PaymentStatus.PAID
        },
        {
            customer_id: customer2.id,
            gear: gears[5],
            total_amount: 750,
            startDate: new Date("2026-08-20"),
            endDate: new Date("2026-08-22"),
            status: Order_Status.CANCELED,
            paymentStatus: PaymentStatus.REFUNDED
        }

    ]

    for (const o of OrderToCreate) {
        if (o.gear) {
            const total_amount = 10 * o.gear.price_per_day
            const gear_order = await prisma.order.create({
                data: {
                    gear_id: o.gear.id,
                    customer_id: o.customer_id,
                    status: o.status,
                    total_amount,
                    startDate: o.startDate,
                    endDate: o.endDate
                }
            });

            if (o.paymentStatus !== PaymentStatus.PENDING) {
                await prisma.payment.create({
                    data: {
                        order_id: gear_order.id,
                        status: o.paymentStatus,
                        transaction_id: randomUUID(),
                        amount: total_amount,
                        method: PaymentMethod.MOBILE_BANKING
                    }
                })
            }

        }

    }

    console.log(`${OrderToCreate.length} Order created`);


    const ReviewToCreate = [
        {
            user_id: customer1.id,
            gear_id: gears[0]?.id,
            rating: 5,
            comment: "Excellent mountain bike. Very smooth and comfortable to ride.",
        },
        {
            user_id: customer2.id,
            gear_id: gears[1]?.id,
            rating: 4,
            comment: "Good quality road bike. The condition was really good.",
        },
        {
            user_id: customer1.id,
            gear_id: gears[2]?.id,
            rating: 5,
            comment: "The camping tent was spacious and easy to set up.",
        },
        {
            user_id: customer2.id,
            gear_id: gears[3]?.id,
            rating: 4,
            comment: "Very comfortable sleeping bag. Perfect for outdoor camping.",
        },
        {
            user_id: customer1.id,
            gear_id: gears[4]?.id,
            rating: 5,
            comment: "Great dumbbell set. Everything was in good condition.",
        },
    ];

    for (const reviewData of ReviewToCreate) {
        await prisma.review.create({
            data: reviewData,
        });
    }

    console.log(`${ReviewToCreate.length} review created`);


    console.log('seeding completed');
}

main().then(() => {
    process.exit(0);
})