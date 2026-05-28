<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckMockAuth
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Check if user is authenticated in our session
        if (!$request->session()->has('auth_user')) {
            return redirect()->route('login');
        }

        // Share the user with all Inertia views
        inertia()->share('auth', [
            'user' => $request->session()->get('auth_user')
        ]);

        return $next($request);
    }
}
