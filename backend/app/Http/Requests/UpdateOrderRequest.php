<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use App\Enums\OrderStatus;

class UpdateOrderRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $rules = [
            'customer_id' => 'sometimes|required|exists:customers,id',
            'status' => ['sometimes', 'required', 'string', Rule::in(OrderStatus::values())],
        ];
    
        if ($this->has('products')) {
            $rules['products'] = 'required|array|min:1';
            $rules['products.*.id'] = 'required|exists:products,id';
            $rules['products.*.quantity'] = 'required|integer|min:1';
        }
    
        return $rules;
    }
}
