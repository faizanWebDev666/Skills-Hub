<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Review;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function store(Request $request, Order $order)
    {
        $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
        ]);

        $user = auth()->user();

        // Check if the order belongs to this customer
        if ($order->customer_id !== $user->id) {
            abort(403);
        }

        // Check if order is completed
        if ($order->status !== 'completed') {
            return back()->with('error', 'You can only review completed orders.');
        }

        // Check if already reviewed
        $existingReview = Review::where('order_id', $order->id)
            ->where('reviewer_id', $user->id)
            ->first();

        if ($existingReview) {
            return back()->with('error', 'You have already reviewed this order.');
        }

        Review::create([
            'order_id' => $order->id,
            'reviewer_id' => $user->id,
            'reviewee_id' => $order->freelancer_id,
            'rating' => $request->rating,
            'comment' => $request->comment,
        ]);

        return back()->with('success', 'Review submitted successfully!');
    }
}
