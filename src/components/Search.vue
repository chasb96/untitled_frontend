<script>
export default {
    name: 'Search',
    data() {
        return {
            query: '',
            users: [],
            projects: [],
        }
    },
    methods: {
        async search() {
            if (this.query == '') {
                return;
            }

            let response = await fetch('/api/search?q=' + this.query);
            let responseBody = await response.json();

            this.users = [];
            this.projects = [];

            responseBody.r.forEach(result => {
                if (result.u) {
                    this.users.push(result.u);
                } else if (result.p) {
                    this.projects.push(result.p);
                }
            });
        }
    }
}
</script>

<template>
    <div>
        <input 
            class="form-control bg-black border-dark text-primary" 
            type="text" 
            placeholder="Search" 
            aria-label="Search"
            v-model="query"
            @keyup.prevent="search"
        />
    
        <div v-if="users.length || projects.length" class="position-relative w-100">
            <ul class="position-absolute mt-3 bg-black border-dark border rounded-3 z-3 p-2 list-group w-100">
                <div class="border-bottom border-dark">Users</div>
                <a 
                    v-for="user in users" 
                    v-bind:href="'/@' + user.u"
                    class="text-dark-emphasis text-decoration-none h5 pt-1 pb-1 mb-0 mx-2">
                    @{{ user.u }}
                </a>
                
                <div class="border-bottom border-dark mt-3">Projects</div>
                <a 
                    v-for="project in projects" 
                    v-bind:href="'/projects/' + project.i"
                    class="text-dark-emphasis text-decoration-none h5 pt-1 pb-1 mb-0 mx-2">
                    {{ project.n }}
                </a>
            </ul>
        </div>
    </div>
</template>