<html>
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        @viteReactRefresh
        @vite('resources/js/app.tsx')
        @vite('resources/js/app.js')
        <x-inertia::head />
    </head>
    <body>
        <x-inertia::app />
        <div id="app" data-page="{{ json_encode($page) }}"></div>
    </body>
</html>
