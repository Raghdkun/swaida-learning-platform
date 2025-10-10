<?php

// app/Http/Controllers/SponsorPortalController.php
namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class SponsorPortalController extends Controller
{
    public function __invoke(): Response
    {
        $sponsor = Auth::guard('sponsor')->user()
            ->load([
                'allocations' => fn($q) => $q->with('course:id,title')->latest(),
                'transactions' => fn($q) => $q->latest(),
            ]);

        return Inertia::render('Sponsor/Portal', [
            'sponsor' => $sponsor,
        ]);
    }
}
