<script>
import AuthService from '../../auth';

export default {
    name: 'CreateProject',
    data() {
        return {
            project_id: '',
            title: '',
            comment: '',
            authService: new AuthService(),
        }
    },
    async mounted() {
        this.project_id = this.$route.params.project_id;
    },
    methods: {
        async submit() {
            let request = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + this.authService.getToken(),
                },
                body: JSON.stringify({
                    t: this.title,
                    c: this.$refs
                        .commentInput
                        .innerHTML,
                })
            };

            let response = await fetch('/web/projects/' + this.project_id + '/threads', request);

            switch (response.status) {
                case 500: this.$router.push('/internal_server_error'); break;
                case 201: {
                    let responseBody = await response.json();

                    this.$router
                        .push('/projects/' + this.project_id + '/threads/' + responseBody.i); 
                }
            };
        }
    }
}
</script>

<template>
    <div class="container-lg bg-black mt-4 border border-dark rounded" style="max-width: 55rem;">
        <h3 class="mt-3 ms-3 text-white">New Thread</h3>
        <hr class="border-dark opacity-100" />

        <form>
            <div class="mb-3 mx-3">
                <label class="form-label text-white">Title</label>
                <input 
                    type="text" 
                    class="form-control bg-dark border-dark text-white" 
                    name="title" 
                    v-model="title"
                />
            </div>

            <div class="mb-3 mx-3">
                <label class="form-label text-white">Comment</label>
                <div 
                    type="text" 
                    class="form-control bg-dark border-dark text-white" 
                    name="comment" 
                    ref="commentInput"
                    contenteditable="true"
                    style="min-height: 8rem;"
                >
                </div>
            </div>

            <hr class="border-dark opacity-100 mt-4" />

            <div class="float-end me-3">
                <button type="submit" class="btn btn-primary" @click.prevent="submit">Submit</button>
            </div>
            <div class="clearfix mb-3"></div>
        </form>
    </div>
</template>