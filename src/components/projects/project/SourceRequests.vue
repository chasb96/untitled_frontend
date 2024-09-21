<script>
import AuthService from '../../../auth';

export default {
    name: 'SourceRequests',
    data() {
        return {
            project_id: '',
            source_requests: [],
            isAuthenticated: new AuthService().isAuthenticated(),
        }
    },
    async mounted() {
        this.project_id = this.$route.params.project_id;

        let getSourceRequestsResponse = await fetch("/api/projects/" + this.project_id + "/source_requests");
        let getSourceRequestsResponseBody = await getSourceRequestsResponse.json();

        this.source_requests = getSourceRequestsResponseBody.sr
            .map(source_request => {
                let mapped = {
                    id: source_request.id,
                };

                if (source_request.sr.c != null) {
                    mapped.state = "Completed";
                    mapped.p = source_request.sr.c.p;
                    mapped.u = source_request.sr.c.u;
                    mapped.t = source_request.sr.c.t;
                } else if (source_request.sr.a != null) {
                    mapped.state = "Approved";
                    mapped.p = source_request.sr.a.p;
                    mapped.u = source_request.sr.a.u;
                    mapped.t = source_request.sr.a.t;
                } else if (source_request.sr.n != null) {
                    mapped.state = "New";
                    mapped.p = source_request.sr.n.p;
                    mapped.u = source_request.sr.n.u;
                    mapped.t = source_request.sr.n.t;
                }

                return mapped;
            })
    }
}
</script>

<template>
    <div class="container-fluid px-0">
        <div class="d-flex">
            <a v-bind:href="'/projects/' + project_id" class="p-2 pb-0 flex-fill border-bottom border-3 border-black text-center text-decoration-none text-primary">
                Files
            </a>
            <a v-bind:href="'/projects/' + project_id + '/threads'" class="p-2 pb-0 flex-fill border-bottom border-3 border-black text-center text-decoration-none text-primary">
                Threads
            </a>
            <a v-bind:href="'/projects/' + project_id + '/contribute'" class="p-2 pb-0 flex-fill border-bottom border-3 border-primary text-center text-decoration-none text-primary">
                Contribute
            </a>
        </div>

        <div class="container-fluid px-0">
            <ul class="list-group rounded-0">
                <li v-for="source_request in source_requests" class="list-group-item text-white border-0 border-top border-dark bg-black p-0">
                    <a v-bind:href="'/projects/' + project_id + '/contribute/' + source_request.id" class="text-decoration-none text-white h5">
                        <div class="p-3">
                            {{ source_request.t }}
                        </div>
                    </a>
                </li>
            </ul>
        </div>
    </div>
</template>