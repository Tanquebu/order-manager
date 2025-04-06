<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;
use App\Models\User;
use App\Models\Customer;
use App\Models\Order;
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

    
    public function test_authenticated_user_can_list_orders()
    {
        $this->authenticate();

        Order::factory()->count(2)->create();

        $response = $this->getJson('/api/orders');
        $response->assertStatus(200);
        $response->assertJsonStructure(['data']);
    }

    public function test_unauthenticated_user_cannot_list_orders()
    {
        $response = $this->getJson('/api/orders');
        $response->assertStatus(401);
    }

}