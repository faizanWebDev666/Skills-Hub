<?php

namespace App\Http\Controllers;

use App\Models\Gig;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GigController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Gig::with('user')->active();

        // Filter by category
        if ($request->filled('category') && $request->category !== 'all') {
            $query->where('category', $request->category);
        }

        // Search by title or description
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Sort
        switch ($request->get('sort', 'recommended')) {
            case 'newest':
                $query->latest();
                break;
            case 'price_low':
                $query->orderBy('price', 'asc');
                break;
            case 'price_high':
                $query->orderBy('price', 'desc');
                break;
            default:
                $query->latest();
                break;
        }

        $gigs = $query->paginate(12)->withQueryString();

        return Inertia::render('Gigs/Index', [
            'gigs' => $gigs,
            'filters' => [
                'category' => $request->get('category', 'all'),
                'search' => $request->get('search', ''),
                'sort' => $request->get('sort', 'recommended'),
            ],
            'user' => auth()->user() ? auth()->user()->load('roles') : null,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Gigs/Create', [
            'user' => auth()->user() ? auth()->user()->load('roles') : null,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:5',
            'category' => 'required|string',
            'tags' => 'nullable|array',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('gigs', 'public');
        }

        Gig::create([
            'user_id' => auth()->id(),
            'title' => $request->title,
            'description' => $request->description,
            'price' => $request->price,
            'category' => $request->category,
            'tags' => $request->tags,
            'image' => $imagePath,
        ]);

        return redirect()->route('vendor.gigs')->with('success', 'Gig created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Gig $gig)
    {
        $gig->load('user');

        return Inertia::render('Gigs/Show', [
            'gig' => $gig,
            'user' => auth()->user() ? auth()->user()->load('roles') : null,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Gig $gig)
    {
        $this->authorize('update', $gig);

        return Inertia::render('Gigs/Edit', [
            'gig' => $gig,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Gig $gig)
    {
        $this->authorize('update', $gig);

        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:5',
            'category' => 'required|string',
            'tags' => 'nullable|array',
            'active' => 'boolean',
        ]);

        $gig->update($request->only(['title', 'description', 'price', 'category', 'tags', 'active']));

        return redirect()->route('gigs.show', $gig)->with('success', 'Gig updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Gig $gig)
    {
        $this->authorize('delete', $gig);

        $gig->delete();

        return redirect()->route('vendor.gigs')->with('success', 'Gig deleted successfully.');
    }
}
