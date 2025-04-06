<?php

namespace Database\Factories;

use App\Models\Customer;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class OrderFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    public function configure()
    {
        return $this->afterCreating(function (Order $order) {
            $products = \App\Models\Product::factory(3)->create();
            foreach ($products as $product) {
                $order->products()->attach($product->id, [
                    'quantity' => rand(1, 5),
                ]);
            }
        });
    }

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'customer_id' => Customer::factory(),
            'status' => $this->faker->randomElement(['pending', 'processing', 'shipped', 'delivered', 'canceled', 'closed']),
        ];
    }

}
