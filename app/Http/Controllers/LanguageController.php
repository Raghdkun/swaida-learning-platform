<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Session;

class LanguageController extends Controller
{
    public function switch(Request $request)
    {
        $locale = $request->input('locale', 'en');
        
        // Validate locale
        if (!in_array($locale, ['en', 'ar'])) {
            $locale = 'en';
        }
        
        // Store in session
        Session::put('locale', $locale);
        
        // Set app locale immediately
        App::setLocale($locale);
        
        // Redirect back to refresh the page with new locale
        return redirect()->back();
    }
}
