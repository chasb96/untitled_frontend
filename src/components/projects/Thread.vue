<script>
import AuthService from '../../auth';

export default {
    name: 'ProjectThread',
    data() {
        return {
            project_id: '',
            thread_id: '',
            title: '',
            comments: [],
            authenticated: new AuthService().isAuthenticated(),
            comment: ''
        }
    },
    async mounted() {
        this.project_id = this.$route.params.project_id;
        this.thread_id = this.$route.params.thread_id;

        let getThreadResponse = await fetch("/web/projects/" + this.project_id + "/threads/" + this.thread_id);
        let getThreadResponseBody = await getThreadResponse.json();

        this.title = getThreadResponseBody.t;
        this.comments = getThreadResponseBody.c;
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

            await fetch("/web/projects/" + this.project_id + "/threads/" + this.thread_id + "/comments", request);

            this.comment = '';

            let getThreadResponse = await fetch("/web/projects/" + this.project_id + "/threads/" + this.thread_id);
            let getThreadResponseBody = await getThreadResponse.json();

            this.title = getThreadResponseBody.t;
            this.comments = getThreadResponseBody.c;
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