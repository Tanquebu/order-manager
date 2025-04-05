<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Order;
use App\Models\Customer;
use App\Models\Product;

class OrderSeeder extends Seeder
{
    const STATUSES = [
        'new',
        'processing',
        'shipped',
        'delivered',
    ];

    private $products;

    private function createSingleOrder($customer)
    {
        $statuses = self::STATUSES;
        $order = Order::create([
            'customer_id' => $customer->id,
            'status' => $statuses[array_rand($statuses)],
        ]);

        $sampleProducts = $this->products->random(min(3, $this->products->count()));

        foreach ($sampleProducts as $product) {
            $order->products()->attach($product->id, [
                'quantity' => rand(1, 3),
            ]);
        }
    }

    private function createRandomMultipleOrders($customer)
    {
        $orderCount = rand(1, 5);
        for ($i = 0; $i < $orderCount; $i++) {
            $this->createSingleOrder($customer);
        }
    }

    public function run(): void
    {
        $customers = Customer::all();
        $this->products = Product::all();

        if ($customers->isEmpty() || $this->products->isEmpty()) return;


        foreach ($customers as $customer) {
            $this->createRandomMultipleOrders($customer);
        }
    }
}
