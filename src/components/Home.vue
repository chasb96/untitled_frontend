<script>
export default {
    name: 'Home',
    data() {
        return {
            popularProjects: [],
            popularUsers: [],
        }
    },
    async mounted() {
        let popularResponse = await fetch('/web/popular');
        let popularResponseBody = await popularResponse.json();

        this.popularProjects = popularResponseBody.p;
        this.popularUsers = popularResponseBody.u;
    }
}
</script>

<template>
    <div class="container">
        <div class="row">
            <div class="col-md-6 p-5 px-3">
                <div class="card border border-black">
                    <div class="card-header bg-primary text-black">
                        <h4 class="mb-0 fst-italic">Popular Projects</h4>
                    </div>
                    <ul class="card-body bg-black list-group p-0">
                        <a v-for="project in popularProjects" 
                            v-bind:href="'/projects/' + project.i" 
                            class="list-group-item bg-black border-0 text-gray-light text-decoration-none h5 pt-3 pb-3 mb-0"
                        >
                            {{ project.n }}
                        </a>
                    </ul>
                </div>
            </div>

            <div class="col-md-6 p-5 px-3">
                <div class="card border border-black">
                    <div class="card-header bg-primary text-black">
                        <h4 class="mb-0 fst-italic">Top Users</h4>
                    </div>
                    <ul class="card-body bg-black list-group p-0">
                        <a v-for="user in popularUsers" 
                            v-bind:href="'/@' + user.u" 
                            class="list-group-item bg-black border-0 text-gray-light text-decoration-none h5 pt-3 pb-3 mb-0"
                        >
                            {{ user.u }}
                        </a>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>