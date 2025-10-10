<?php

// app/Http/Middleware/ForceSponsorPasswordChange.php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ForceSponsorPasswordChange
{
    public function handle(Request $request, Closure $next)
    {
        $user = Auth::guard('sponsor')->user();
        if ($user && $user->must_change_password) {
            // Allow only the change-password routes while forcing change
            if (! $request->routeIs('sponsor.password.edit', 'sponsor.password.update', 'sponsor.logout')) {
                return redirect()->route('sponsor.password.edit');
            }
        }
        return $next($request);
    }
}
