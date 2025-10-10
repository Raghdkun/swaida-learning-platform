<?php

// app/Http/Controllers/SponsorPasswordController.php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Illuminate\Http\RedirectResponse;

class SponsorPasswordController extends Controller
{
    public function edit()
    {
        return Inertia::render('Sponsor/ChangePassword');
    }

    public function update(Request $request): RedirectResponse
    {
        $request->validate([
            // validate current password against sponsor guard
            'current_password' => ['required', 'current_password:sponsor'],
            'password' => ['required', 'confirmed', Password::min(8)->letters()->numbers()->mixedCase()],
        ]);

        $user = Auth::guard('sponsor')->user();
        $user->update([
            'password' => $request->password,
            'must_change_password' => false,
            'password_changed_at'  => now(),
        ]);

        return redirect()->route('sponsor.portal')->with('success', 'Password updated successfully.');
    }
}
