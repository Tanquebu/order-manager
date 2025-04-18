<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Enums\OrderStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Testing\Fluent\Concerns\Has;

class Order extends Model
{
    use HasFactory;
    
    protected $fillable = ['customer_id', 'status'];
    
    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }
    
    public function products()
    {
        return $this->belongsToMany(Product::class)->withPivot('quantity')->withTimestamps();
    }
}
