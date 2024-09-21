<script>
import AuthService from '../../../auth';

export default {
    name: 'ProjectFiles',
    props: ['files', 'isOwnedByUser'],
    data() {
        return {
            project_id: '',
            files: this.files,
            isOwnedByUser: this.isOwnedByUser,
        }
    },
    mounted() {
        this.project_id = this.$route.params.project_id;

        this.sortFiles()
    },
    methods: {
        sortFiles() {
            this.files.sort((a, b) => a.n.toUpperCase().localeCompare(b.n.toUpperCase()));
        },
        async remove(index) {
            let request = {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + new AuthService().getToken(),
                },
                body: JSON.stringify({
                    rm: {
                        p: [this.files[index].n]
                    }
                })
            };
    
            let response = await fetch('/api/projects/' + this.project_id, request);
    
            if (response.status == 204) {
                this.files.splice(index, 1);
            }
        },
        rename(index, to) {
            let request = {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + new AuthService().getToken(),
                },
                body: JSON.stringify({
                    mv: {
                        p: {
                            [this.files[index].n]: to,
                        }
                    }
                })
            };

            fetch('/web/projects/' + this.project_id, request);

            this.sortFiles()
        },
        async addFile(e) { 
            if (!this.isOwnedByUser) {
                return;
            }
            
            let form = new FormData();

            for (let file in [...e.dataTransfer.files]) {
                form.append(file.name, file);
            }

            let request = {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + new AuthService().getToken(),
                },
                body: form,
            };

            let uploadResponse = await fetch('/api/files', request);
            let uploadResponseBody = await uploadResponse.json();

            let associateRequest = {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + new AuthService().getToken(),
                },
                body: JSON.stringify({
                    af: {
                        f: Object.entries(uploadResponseBody.ids)
                            .map(([path, file_id]) => { 
                                return {
                                    p: path,
                                    fid: file_id
                                }
                            })
                    }
                })
            };

            let response = await fetch('/web/projects/' + this.$route.params.id, associateRequest);

            if (response.status == 500) {
                this.$router.push('/internal_server_error');

                return;
            }

            let getProjectResponse = await fetch("/web/projects/" + this.$route.params.id);
            let getProjectResponseBody = await getProjectResponse.json();

            this.files = getProjectResponseBody.f;

            this.sortFiles()
        }
    }
}
</script>

<template>
    <div class="container-fluid px-0">
        <div class="d-flex">
            <a v-bind:href="'/projects/' + project_id" class="p-2 pb-0 flex-fill border-bottom border-3 border-primary text-center text-decoration-none text-primary">
                Files
            </a>
            <a v-bind:href="'/projects/' + project_id + '/threads'" class="p-2 pb-0 flex-fill border-bottom border-3 border-black text-center text-decoration-none text-primary">
                Threads
            </a>
            <a v-bind:href="'/projects/' + project_id + '/contribute'" class="p-2 pb-0 flex-fill border-bottom border-3 border-black text-center text-decoration-none text-primary">
                Contribute
            </a>
        </div>

        <div 
            id="dropZone"   
            class="container-fluid border-top border-dark"
            @drop.prevent="addFile"
            @dragenter.prevent
            @dragover.prevent
        >
            <div v-if="isOwnedByUser && files.length == 0" class="d-flex flex-column justify-content-center mt-2">
                <span>Drag and drop files here...</span>
            </div>
    
            <ul class="list-group mt-3 mb-3">
                <li v-for="(file, i) in files" class="list-group-item border-dark d-flex p-0">
                    <div class="flex-grow-1">
                        <input 
                            v-if="isOwnedByUser"
                            type="text" 
                            class="form-control bg-black border-dark text-primary rounded-0 border-0"
                            v-bind:value="file.n" 
                            v-on:change.prevent="rename(i, $event.target.value)"/>
                        <div v-else class="pt-2">
                            <a class="text-light text-decoration-none m-2" v-bind:href="'/api/files/' + file.id">{{ file.n }}</a>
                        </div>
                    </div>
    
                    <div v-if="isOwnedByUser">
                        <button class="btn btn-sm btn-danger rounded-0 m-1 me-0" @click.prevent="remove(i)">Remove</button>
                    </div>
                    <a v-bind:href="'/api/files/' + file.id">
                        <button class="btn btn-sm btn-primary rounded-0 rounded-end-1 m-1">Download</button>
                    </a>
                </li>
            </ul>
        </div>
    </div>
</template>

<style scoped>
    #dropZone {
        min-height: 13rem;
    }
</style>