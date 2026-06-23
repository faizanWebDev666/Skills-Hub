<?php

namespace Database\Seeders;

use App\Models\Gig;
use App\Models\User;
use Illuminate\Database\Seeder;

class GigSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            'developers',
            'designers',
            'tutors',
            'electricians',
            'repair_experts',
            'agencies',
            'freelancers',
            'writers',
        ];

        $titles = [
            'Professional Website Development',
            'Modern UI/UX Design for Web Apps',
            'Expert Copywriting for Landing Pages',
            'E-commerce Store Setup and Customization',
            'Mobile App UI Design',
            'SEO-Friendly Blog Content Creation',
            'Logo and Brand Identity Design',
            'Fast WordPress Website Build',
            'Technical Support & Troubleshooting',
            'Social Media Graphics Package',
            'High-Converting Sales Funnel Design',
            'Landing Page Redesign for Better Conversions',
            'Shopify Store Optimization',
            'Custom CRM Integration Services',
            'Illustration and Icon Design',
            'Business Portfolio Website',
            'Performance Review and Consulting',
            'Full-Stack Application Development',
            'Product Description Writing',
            'Marketing Strategy Audit',
        ];

        $descriptions = [
            'Delivering clean, responsive, and fast-loading pages with a focus on conversion and accessibility.',
            'Designing polished interfaces that feel modern, intuitive, and easy to navigate for end users.',
            'Creating persuasive copy that speaks directly to your target audience and drives action.',
            'Building powerful online shops with payment integration, inventory support, and a seamless checkout flow.',
            'Crafting beautiful mobile experiences with consistent branding and user-friendly interactions.',
            'Producing SEO-ready blog posts, articles, and web content that increase visibility and engagement.',
            'Developing memorable visual brands with custom logos, color palettes, and typography systems.',
            'Launching WordPress sites fast using best practices for speed, security, and scalability.',
            'Providing expert troubleshooting and rapid fixes for software, hardware, and network issues.',
            'Designing social media assets that stand out and help your brand get noticed online.',
            'Creating sales funnels that turn visitors into leads with a strong messaging framework.',
            'Refreshing landing pages with a clean layout, clear CTAs, and better mobile performance.',
            'Optimizing Shopify setups for conversions, navigation, and product presentation.',
            'Connecting systems and automating workflows with custom CRM and API integrations.',
            'Designing custom illustrations, icons, and visual assets that bring your project to life.',
            'Building polished portfolio sites that highlight your skills and help you win clients.',
            'Analyzing your business performance and delivering practical improvement recommendations.',
            'Delivering scalable, full-stack apps built with modern frameworks and solid architecture.',
            'Writing product descriptions that communicate value and drive customer trust.',
            'Reviewing your marketing approach and recommending stronger campaign strategies.',
        ];

        $vendorUsers = User::factory()
            ->count(5)
            ->create()
            ->each(function (User $user) {
                $user->assignRole('vendor');
            });

        $vendorIds = $vendorUsers->pluck('id')->toArray();

        foreach (range(0, 19) as $index) {
            $category = $categories[$index % count($categories)];

            Gig::create([
                'user_id' => $vendorIds[array_rand($vendorIds)],
                'title' => $titles[$index],
                'description' => $descriptions[$index],
                'price' => rand(30, 250),
                'category' => $category,
                'tags' => [
                    $category,
                    'featured',
                    'premium',
                ],
                'active' => true,
                'category_fields' => [],
            ]);
        }
    }
}
