<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use App\Http\Requests\StoreOrderRequest;
use App\Http\Requests\UpdateOrderRequest;

class OrderController extends Controller
{
    public function index()
    {
        return Order::with('customer', 'products')->paginate(10);
        //return response()->json(Order::with('customer', 'products')->get());
    }

    public function store(StoreOrderRequest $request)
    {
        $order = Order::create($request->only(['customer_id', 'status']));
        $products = collect($request->products)->mapWithKeys(fn($p) => [$p['id'] => ['quantity' => $p['quantity']]]);
        $order->products()->attach($products);
        return response()->json($order->load('customer', 'products'), 201);
    }

    public function show(Order $order)
    {
        return response()->json($order->load('customer', 'products'));
    }

    public function update(UpdateOrderRequest $request, Order $order)
    {
        $order->update($request->only(['customer_id', 'status']));

        if ($request->has('products')) {
            $products = collect($request->products)->mapWithKeys(fn($p) => [$p['id'] => ['quantity' => $p['quantity']]]);
            $order->products()->sync($products);
        }

        return response()->json($order->load('customer', 'products'));
    }

    public function destroy(Order $order)
    {
        $order->delete();
        return response()->noContent();
    }
}