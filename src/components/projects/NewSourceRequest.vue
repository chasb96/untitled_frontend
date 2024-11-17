<script>
import AuthService from '../../auth';

export default {
    name: 'NewSourceRequest',
    data() {
        return {
            authService: new AuthService(),
            projectId: '',
            title: '',
            files: [],
            updates: {},
        }
    },
    async mounted() {
        this.projectId = this.$route.params.project_id;

        let getProjectResponse = await fetch("/web/projects/" + this.projectId);
        let getProjectResponseBody = await getProjectResponse.json();

        this.files = getProjectResponseBody.f;
    },
    methods: {
        updateClick(i) {
            this.$refs
                .fileInputs[i]
                .click()
        },
        async updateFile(name, i) {
            let file = this.$refs
                .fileInputs[i]
                .files[0];

            let form = new FormData();

            form.append(name, file);
            
            let request = {
                method: "POST",
                headers: {
                    'Authorization': 'Bearer ' + this.authService.getToken(),
                },
                body: form,
            };

            let uploadResponse = await fetch('/api/files', request);
            let uploadResponseBody = await uploadResponse.json();

            this.updates[name] = uploadResponseBody.i;
        },
        async submit() {
            let request = {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + this.authService.getToken(),
                },
                body: JSON.stringify({
                    t: this.title,
                    d: this.$refs
                        .descriptionInput
                        .innerHTML,
                    f: Object.keys(this.updates)
                        .map(k => {
                            return {
                                p: k,
                                f: this.updates[k],
                            }
                        }),
                }),
            }

            let submitResponse = await fetch('/web/projects/' + this.projectId + '/source_requests', request);
            
            switch (submitResponse.status) {
                case 500: this.$router.push('/internal_server_error'); break;
                case 201: {
                    let submitResponseBody = await submitResponse.json();
                    
                    this.$router
                        .push('/projects/' + this.projectId + '/contribute/' + submitResponseBody.i);
                }
            }
        }
    }
}
</script>

<template>
    <div class="container bg-black mt-4 border border-dark rounded">
        <h3 class="mt-3 ms-3 text-white">New Source Request</h3>
        <hr class="border-dark opacity-100" />

        <div class="mx-3">
            <div class="form-group">
                <div class="mb-3">
                    <label for="title" class="form-label text-white">Title</label>
                    <input type="text" class="form-control bg-dark border-dark text-white" name="title" v-model="title">
                </div>

                <div class="mb-3">
                    <label class="form-label text-white">Description</label>
                    <div 
                        type="text" 
                        class="form-control bg-dark border-dark text-white" 
                        name="comment" 
                        ref="descriptionInput"
                        contenteditable="true"
                        style="min-height: 8rem;"
                    >
                    </div>
                </div>
            </div>
            
            <ul class="list-group rounded-0 mb-2">
                <li 
                    v-for="(file, i) in files" 
                    class="list-group-item text-light border-0 border-top border-dark bg-black m-1 mt-0 mb-0 p-2 d-flex"
                >
                    <div class="flex-grow-1">
                        <p class="m-0 pt-2">{{ file.n }}</p>
                    </div>
                    <div>
                        <input ref="fileInputs" type="file" hidden @change="updateFile(file.n, i)" />
                        <button class="btn btn-sm btn-primary rounded-0 m-1 me-0" @click.prevent="updateClick(i)">Upload</button>
                        <button class="btn btn-sm btn-danger rounded-0 m-1 me-0" @click.prevent="remove(i)">Remove</button>
                    </div>
                </li>
                <li class="list-group-item text-light border-0 border-top border-dark bg-black m-1 mt-0 mb-0 p-2 d-flex">
                    <div class="flex-grow-1"></div>
                    <div>
                        <button class="btn btn-sm btn-primary rounded-0 m-1 me-0" @click.prevent="submit(i)">Submit</button>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>