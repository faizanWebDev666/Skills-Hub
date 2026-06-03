<?php

namespace Database\Seeders;

use App\Models\Gig;
use App\Models\Order;
use App\Models\User;
use Illuminate\Database\Seeder;

class OrderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get a vendor and a customer
        $vendors = User::role('vendor')->get();
        $customers = User::whereDoesntHave('roles', function ($q) {
            $q->where('name', 'vendor')->orWhere('name', 'admin');
        })->get();

        // If no customers, create one
        if ($customers->isEmpty()) {
            $customer = User::factory()->create([
                'name' => 'Test Customer',
                'email' => 'customer@example.com',
            ]);
            $customers = collect([$customer]);
        }

        // Get gigs
        $gigs = Gig::all();

        if ($vendors->isEmpty() || $gigs->isEmpty()) {
            $this->command->info('No vendors or gigs found. Please run GigSeeder first.');
            return;
        }

        $statuses = ['pending', 'in_progress', 'completed', 'cancelled'];

        // Create 30 test orders with varying dates
        foreach (range(1, 30) as $i) {
            $gig = $gigs->random();
            $vendor = $vendors->random();
            $customer = $customers->random();
            
            // Create dates from last 30 days
            $daysAgo = rand(0, 29);
            $createdAt = now()->subDays($daysAgo);
            
            Order::create([
                'uuid' => \Illuminate\Support\Str::uuid(),
                'customer_id' => $customer->id,
                'freelancer_id' => $gig->user_id, // Use the gig's actual vendor
                'gig_id' => $gig->id,
                'status' => $statuses[array_rand($statuses)],
                'amount' => $gig->price,
                'requirements' => 'Sample order requirements for testing',
                'created_at' => $createdAt,
                'updated_at' => $createdAt,
            ]);
        }

        $this->command->info('Successfully seeded 30 test orders!');
    }
}
