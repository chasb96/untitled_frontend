<script>
import AuthService from '../../auth';
import ProjectHeader from './project/Header.vue';
import ProjectFiles from './project/Files.vue';
import ProjectTags from './project/Tags.vue';
import ProjectThreads from './project/Threads.vue';
import ProjectSourceRequests from './project/SourceRequests.vue';

export default {
    name: 'Project',
    props: ['page'],
    data() {
        return {
            project_id: '',
            page: this.page,
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
        'project-threads': ProjectThreads,
        'project-source-requests': ProjectSourceRequests
    },
    async mounted() {
        this.project_id = this.$route.params.project_id;

        let getProjectResponse = await fetch("/web/projects/" + this.project_id);
        let getProjectResponseBody = await getProjectResponse.json();

        this.name = getProjectResponseBody.n;
        this.owner = getProjectResponseBody.o.i;
        this.files = getProjectResponseBody.f;

        this.isOwnedByUser = this.owner == new AuthService().getUserId();
    }
}
</script>

<template>
    <div class="container bg-black mt-4 border border-dark rounded">
        <project-header v-bind:name="name" v-bind:page="page"></project-header>

        <project-tags v-bind:isOwnedByUser="isOwnedByUser"></project-tags>

        <project-files v-if="page == 'files'" v-bind:files="files" v-bind:isOwnedByUser="isOwnedByUser"></project-files>
        <project-threads v-else-if="page == 'threads'"></project-threads>
        <project-source-requests v-else-if="page == 'contribute'"></project-source-requests>
    </div>
</template>