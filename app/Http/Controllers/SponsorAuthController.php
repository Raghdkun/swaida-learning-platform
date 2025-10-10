<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Http\RedirectResponse;

class SponsorAuthController extends Controller
{
    public function showLogin() {
        return Inertia::render('Sponsor/Login');
    }

    public function login(Request $request): RedirectResponse
    {
        $credentials = $request->validate([
            'email'    => ['required','email'],
            'password' => ['required','string','min:6'],
            'remember' => ['nullable','boolean'],
        ]);

        if (Auth::guard('sponsor')->attempt(
            ['email' => $credentials['email'], 'password' => $credentials['password']],
            $request->boolean('remember')
        )) {
            $request->session()->regenerate();

            // update last_login_at
            optional(Auth::guard('sponsor')->user())->update(['last_login_at' => now()]);

            return redirect()->intended(route('sponsor.portal'));
        }

        return back()->withErrors(['email' => 'Invalid credentials'])->onlyInput('email');
    }

    public function logout(Request $request): RedirectResponse
    {
        Auth::guard('sponsor')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect()->route('sponsor.login');
    }
}
