<script>
export default {
    name: 'NewSourceRequest',
    data() {
        return {
            project_id: '',
            title: '',
            files: [],
            source_request: {},
        }
    },
    async mounted() {
        this.project_id = this.$route.params.project_id;

        let getProjectResponse = await fetch("/api/projects/" + this.project_id);
        let getProjectResponseBody = await getProjectResponse.json();

        this.files = getProjectResponseBody.f;
    }
}
</script>

<template>
    <div class="container bg-black mt-4 border border-dark rounded">
        <h3 class="mt-3 ms-3 text-white">New Source Request</h3>
        <hr class="border-dark opacity-100" />

        <div class="mx-3">
            <div class="form-group">
                <label for="title" class="form-label text-white">Title</label>
                <input type="text" class="form-control bg-dark border-dark text-white" name="title" v-model="title">
            </div>
    
            <ul class="list-group rounded-0 mt-3">
                <li v-for="file in files" class="list-group-item text-white border-0 border-top border-dark bg-black pt-4 pb-4">
                    <p class="m-0">{{ file.n }}</p>
                </li>
            </ul>
        </div>
    </div>
</template>