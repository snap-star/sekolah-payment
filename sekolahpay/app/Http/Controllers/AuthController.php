<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AuthController extends Controller
{
    /**
     * Show the login form
     */
    public function login()
    {
        // If user is already authenticated, redirect to dashboard
        if (Auth::check()) {
            return redirect()->route('dashboard');
        }

        return Inertia::render('Auth/Login');
    }

    /**
     * Handle authentication with mock data
     */
    public function authenticate(Request $request)
    {
        // Validate login request
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required|min:6',
        ]);

        // Mock user data - this matches your existing mock pattern in other controllers
        $mockUsers = [
            [
                'id' => 1,
                'name' => 'Kepala Sekolah',
                'email' => 'kepala@sekolah.test',
                'password' => 'password123',
                'role' => 'kepala_sekolah',
            ],
            [
                'id' => 2,
                'name' => 'Bendahara',
                'email' => 'bendahara@sekolah.test',
                'password' => 'password123',
                'role' => 'bendahara',
            ],
            [
                'id' => 3,
                'name' => 'Operator',
                'email' => 'operator@sekolah.test',
                'password' => 'password123',
                'role' => 'operator',
            ],
            [
                'id' => 4,
                'name' => 'Admin',
                'email' => 'admin@sekolah.test',
                'password' => 'password123',
                'role' => 'admin',
            ],
        ];

        // Find user by email
        $user = collect($mockUsers)->firstWhere('email', $credentials['email']);

        // Verify credentials
        if ($user && $user['password'] === $credentials['password']) {
            // Store mock user in session since we're not using a real database
            $request->session()->put('auth_user', $user);

            // Regenerate session to prevent fixation
            $request->session()->regenerate();

            // Redirect to intended URL or dashboard
            return redirect()->intended(route('dashboard'));
        }

        // Return back with error if credentials don't match
        return back()->withErrors([
            'email' => 'Email atau password yang Anda masukkan salah.',
        ])->onlyInput('email');
    }

    /**
     * Log the user out of the application
     */
    public function logout(Request $request)
    {
        // Remove mock user from session
        $request->session()->forget('auth_user');

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('login');
    }
}
