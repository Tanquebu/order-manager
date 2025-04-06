<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;
use App\Models\User;
use App\Models\Customer;
use App\Models\Product;

class OrderApiTest extends TestCase
{
    use RefreshDatabase;

    protected function authenticate()
    {
        $user = User::factory()->create([
            'email' => 'test@example.com',
            'password' => Hash::make('password')
        ]);

        $this->actingAs($user);
    }

    public function test_user_can_login()
    {
        $user = User::factory()->create([
            'email' => 'test@example.com',
            'password' => Hash::make('password'),
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'test@example.com',
            'password' => 'password'
        ]);

        $response->assertStatus(200);
    }

    public function test_create_order_successfully()
    {
        $this->authenticate();

        $customer = Customer::factory()->create();
        $product = Product::factory()->create();
        

        $response = $this->postJson('/api/orders', [
            'customer_id' => $customer->id,
            'status' => 'pending',
            'products' => [
                ['id' => $product->id, 'quantity' => 2],
            ],
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('orders', ['customer_id' => $customer->id]);
    }

    public function test_create_order_validation_fails()
    {
        $this->authenticate();

        $response = $this->postJson('/api/orders', [
            'status' => 'pending',
            'products' => [],
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['customer_id', 'products']);
    }
}