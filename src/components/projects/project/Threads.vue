<script>
import AuthService from '../../../auth';

export default {
    name: 'ProjectThreads',
    data() {
        return {
            project_id: '',
            threads: [],
            isAuthenticated: new AuthService().isAuthenticated(),
        }
    },
    async mounted() {
        this.project_id = this.$route.params.project_id;

        let getThreadsResponse = await fetch("/api/projects/" + this.project_id + "/threads");
        let getThreadsResponseBody = await getThreadsResponse.json();

        this.threads = getThreadsResponseBody.t;
    }
}
</script>

<template>
    <div class="container-fluid px-0">
        <div class="d-flex">
            <a v-bind:href="'/projects/' + project_id" class="p-2 pb-0 flex-fill border-bottom border-3 border-black text-center text-decoration-none text-primary">
                Files
            </a>
            <a v-bind:href="'/projects/' + project_id + '/threads'" class="p-2 pb-0 flex-fill border-bottom border-3 border-primary text-center text-decoration-none text-primary">
                Threads
            </a>
            <a v-bind:href="'/projects/' + project_id + '/contribute'" class="p-2 pb-0 flex-fill border-bottom border-3 border-black text-center text-decoration-none text-primary">
                Contribute
            </a>
        </div>

        <div class="container-fluid px-0">
            <ul class="list-group rounded-0">
                <li v-for="thread in threads" class="list-group-item text-white border-0 border-top border-dark bg-black p-0">
                    <a v-bind:href="'/projects/' + project_id + '/threads/' + thread.id" class="text-decoration-none text-white h5">
                        <div class="p-3">
                            {{ thread.t }}
                        </div>
                    </a>
                </li>
            </ul>
        </div>
    </div>
</template>