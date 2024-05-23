<script>
import AuthService from '../../auth';

export default {
    name: 'Project',
    data() {
        return {
            id: 0,
            name: '',
            owner: 0,
            files: [],
            isOwnedByUser: false,
        }
    },
    async mounted() {
        let getProjectResponse = await fetch("/api/projects/" + this.$route.params.id);
        let getProjectResponseBody = await getProjectResponse.json();

        this.id = this.$route.params.id;
        this.name = getProjectResponseBody.name;
        this.owner = getProjectResponseBody.user_id;
        this.files = getProjectResponseBody.files;
        
        this.isOwnedByUser = this.owner == new AuthService().getUserId();
    },
    methods: {
        async remove(index) {
            let request = {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + new AuthService().getToken(),
                },
                body: JSON.stringify({
                    rm: {
                        p: [this.files[index].name]
                    }
                })
            };
    
            let response = await fetch('/api/projects/' + this.id, request);
    
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
                            [this.files[index].name]: to,
                        }
                    }
                })
            };

            fetch('/api/projects/' + this.id, request);
        }
    }
}
</script>

<template>
    <div class="container bg-black mt-4 border border-dark rounded">
        <div class="row p-2">
            <div class="col-sm-8">
                <h3 class="text-white mt-2 ms-3">{{ name }}</h3>
            </div>

            <div v-if="isOwnedByUser" class="mt-1 mb-1 col-sm-4 d-flex">
                <div class="flex-fill"></div>

                <a v-bind:href="'/projects/' + id + '/upload'">
                    <button class="btn btn-secondary">Add Files</button>
                </a>
            </div>
        </div>

        <div class="container-fluid border-top border-dark">
            <ul class="list-group mt-3 mb-3">
                <li v-for="(file, i) in files" class="list-group-item border-dark d-flex p-0">
                    <div class="flex-grow-1">
                        <input 
                            v-if="isOwnedByUser"
                            type="text" 
                            class="form-control bg-black border-dark text-primary rounded-0 border-0"
                            v-bind:value="file.name" 
                            v-on:change.prevent="rename(i, $event.target.value)"/>
                        <a v-else class="text-light text-decoration-none m-2" v-bind:href="'/api/files/' + file.id">{{ file.name }}</a>
                    </div>

                    <div>
                        <button class="btn btn-sm btn-danger rounded-0 m-1 me-0" @click.prevent="remove(i)" v-if="isOwnedByUser">Remove</button>
                    </div>
                    <a v-bind:href="'/api/files/' + file.id">
                        <button class="btn btn-sm btn-primary rounded-0 rounded-end-1 m-1">Download</button>
                    </a>
                </li>
            </ul>
        </div>
    </div>
</template>