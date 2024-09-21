<script>
import AuthService from '../../auth';

export default {
    name: 'User',
    data () {
        return {
            userId: 0,
            username: '',
            projects: [],
            isLoggedInUser: false,
        }
    },
    async mounted () {
        let getUserResponse = await fetch("/web/users/@" + this.$route.params.username);
        let getUserResponseBody = await getUserResponse.json();

        this.username = getUserResponseBody.u;
        this.userId = getUserResponseBody.i;
        this.projects = getUserResponseBody.p;

        this.isLoggedInUser = this.userId == new AuthService().getUserId();
    }
}
</script>

<template>
    <div class="container bg-black mt-4 border border-dark rounded">
        <div class="row p-2">
            <div class="col-md-3 border-end border-dark">
            </div>

            <div class="col-md-9">
                <div class="row">
                    <div class="col-sm-8">
                        <h3 class="text-white mt-2 ms-3">{{ username }}</h3>
                    </div>
    
                    <div v-if="isLoggedInUser" class="mt-1 mb-1 col-sm-4 d-flex">
                        <div class="flex-fill"></div>

                        <a href="/projects/create">
                            <button class="btn btn-secondary">New Project</button>
                        </a>
                    </div>
                </div>

                <div class="container-fluid border-top border-dark mb-2">
                    <div class="row">
                        <div v-for="(project, _) in projects" class="col-md-4">
                            <a :href="'/projects/' + project.i" class="card mt-3">
                                <div class="card-body">
                                    <h5 class="text-white mt-2">{{ project.n }}</h5>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>