<script>
import AuthService from '../../auth';

export default {
    name: 'SourceRequest',
    data() {
        return {
            project_id: '',
            source_request_id: '',
            title: '',
            state: '',
            diff: {},
            comments: [],
            authenticated: new AuthService().isAuthenticated(),
            comment: ''
        }
    },
    async mounted() {
        this.project_id = this.$route.params.project_id;
        this.source_request_id = this.$route.params.source_request_id;

        let getSourceRequest = await fetch("/web/projects/" + this.project_id + "/source_requests/" + this.source_request_id);
        let getSourceRequestBody = await getSourceRequest.json();

        if (getSourceRequestBody.c != null) {
            this.state = "Completed";
            this.title = getSourceRequestBody.c.t;
        } else if (getSourceRequestBody.a != null) {
            this.state = "Approved";
            this.title = getSourceRequestBody.a.t;
        } else if (getSourceRequestBody.n != null) {
            this.state = "New";
            this.title = getSourceRequestBody.n.t;
        }

        let getSourceRequestComments = await fetch("/web/projects/" + this.project_id + "/source_requests/" + this.source_request_id + "/comments");
        let getSourceRequestCommentsBody = await getSourceRequestComments.json();

        this.comments = getSourceRequestCommentsBody.c;

        let getSourceRequestDiff = await fetch("/web/projects/" + this.project_id + "/source_requests/" + this.source_request_id + "/diff");
        let getSourceRequestDiffBody = await getSourceRequestDiff.json();

        this.diff = getSourceRequestDiffBody;
    },
    methods: {
        async createComment() {
            let request = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + new AuthService().getToken(),
                },
                body: JSON.stringify({
                    c: this.comment,
                }),
            };

            await fetch("/web/projects/" + this.project_id + "/source_requests/" + this.source_request_id + "/comments", request);

            this.comment = '';

            let getSourceRequestComments = await fetch("/web/projects/" + this.project_id + "/source_requests/" + this.source_request_id + "/comments");
            let getSourceRequestCommentsBody = await getSourceRequestComments.json();

            this.comments = getSourceRequestCommentsBody.c;
        }
    }
}
</script>

<template>
    <div class="container bg-black mt-4 border border-dark rounded">
        <div class="row p-2">
            <div class="col-sm-8">
                <h3 class="text-white mt-2 ms-3">{{ title }}</h3>
            </div>
        </div>

        <ul class="list-group rounded-0">
            <li v-for="(path, change) in diff" :path="path" class="list-group-item text-white border-0 border-top border-dark bg-black pt-3 pb-3">
                <p>{{ path }}: {{ change.f }} -> {{ change.t }}</p>
            </li>
        </ul>

        <ul class="list-group rounded-0">
            <li v-for="comment in comments" class="list-group-item text-white border-0 border-top border-dark bg-black pt-3 pb-3">
                <p>{{ comment.c }}</p>
            </li>
        </ul>

        <div v-if="authenticated" class="container-fluid p-2 px-0 border-top border-dark">
            <textarea v-model="comment" class="form-control bg-black text-white border border-dark" placeholder="Comment">
            </textarea>

            <div class="d-flex justify-content-end">
                <button v-on:click="createComment" class="mt-2 btn btn-primary">Submit</button>
            </div>
        </div>
    </div>
</template>