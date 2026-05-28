/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Laravel's helpers and other libraries. It's a great starting point
 * when building robust, powerful web applications using Laravel and React.
 */

import axios from 'axios';

window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

/**
 * Laravel's CSRF token configuration
 * This will automatically include the CSRF token in all Axios requests
 */
const csrfToken = document.querySelector('meta[name="csrf-token"]');

if (csrfToken) {
    window.axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken.getAttribute('content');
}
