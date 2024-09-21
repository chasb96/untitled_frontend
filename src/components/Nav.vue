<script>
import AuthService from '../auth';
import Search from './Search.vue';

export default {
  name: 'Nav',
  components: {
    'search': Search,
  },
  data() {
    let auth_service = new AuthService();

    return {
        auth_service: auth_service,
        logged_in: auth_service.isAuthenticated(),
    }
  },
  mounted() {
    window.addEventListener('token-change', (_) => {
        this.logged_in = this.auth_service.isAuthenticated();
    });
  }
}
</script>

<template>
    <nav class="navbar bg-black border-bottom border-dark">
        <a class="navbar-brand fs-1 text-white fst-italic text-decoration-none mb-0 pt-0 pb-0 ms-3" href="/">
            site.com
        </a>

        <div class="flex-grow-1 mx-5">
            <search />
        </div>

        <div v-if="!this.logged_in" class="me-3 mt-0">
            <a href="/login" class="me-2">
                <button class="btn btn-secondary">Login</button>
            </a>
            <a href="/sign_up">
                <button class="btn btn-primary">Sign Up</button>
            </a>
        </div>
    </nav>
</template>

<style>
.navbar {
    padding: 0;
}
</style>