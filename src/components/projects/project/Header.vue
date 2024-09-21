<script>
import AuthService from '../../../auth';

export default {
    name: 'ProjectHeader',
    props: ['name', 'page'],
    data() {
        return {
            project_id: '',
            name: this.name,
            page: this.page,
            isAuthenticated: new AuthService().isAuthenticated(), 
        }
    },
    async mounted() {
        this.project_id = this.$route.params.project_id;
    }
}
</script>

<template>
    <div class="d-flex p-2">
        <div>
            <h3 class="text-white mt-2 ms-3">{{ name }}</h3>
        </div>

        <div class="flex-fill"></div>

        <div v-if="isAuthenticated">
            <a v-if="page == 'threads'" href="">
                <button class="btn btn-primary mt-2">New Thread</button>
            </a>
            <a v-if="page == 'contribute'" v-bind:href="'/projects/' + project_id + '/contribute/create'">
                <button class="btn btn-primary mt-2">New Source Request</button>
            </a>
        </div>
    </div>
</template>