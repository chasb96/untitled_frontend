<script>
import AuthService from '../../auth';
import ProjectHeader from './project/Header.vue';
import ProjectFiles from './project/Files.vue';
import ProjectTags from './project/Tags.vue';

export default {
    name: 'Project',
    data() {
        return {
            id: '',
            name: '',
            owner: 0,
            files: [],
            isOwnedByUser: false,
        }
    },
    components: {
        'project-header': ProjectHeader,
        'project-files': ProjectFiles,
        'project-tags': ProjectTags,
    },
    async mounted() {
        this.id = this.$route.params.id;

        let getProjectResponse = await fetch("/api/projects/" + this.id);
        let getProjectResponseBody = await getProjectResponse.json();

        this.name = getProjectResponseBody.n;
        this.owner = getProjectResponseBody.uid;
        this.files = getProjectResponseBody.f;

        this.isOwnedByUser = this.owner == new AuthService().getUserId();
    }
}
</script>

<template>
    <div class="container bg-black mt-4 border border-dark rounded">
        <project-header v-bind:name="name"></project-header>

        <project-tags v-bind:isOwnedByUser="isOwnedByUser"></project-tags>

        <project-files v-bind:files="files" v-bind:isOwnedByUser="isOwnedByUser"></project-files>
    </div>
</template>