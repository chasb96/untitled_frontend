import Vue from 'vue'
import Router from 'vue-router'
import NotFound from '@/components/error_pages/NotFound.vue'
import InternalServerError from '../components/error_pages/InternalServerError.vue'
import User from '../components/users/User.vue'
import SignUp from '../components/SignUp.vue'
import Login from '../components/Login.vue'
import CreateProject from '../components/projects/CreateProject.vue'
import Project from '../components/projects/Project.vue'
import Thread from '../components/projects/Thread.vue'
import SourceRequest from '../components/projects/SourceRequest.vue'
import NewSourceRequest from '../components/projects/NewSourceRequest.vue'
import Home from '../components/Home.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    { path: '/sign_up', component: SignUp },
    { path: '/login', component: Login },
    { path: '/@:username', component: User },
    { path: '/projects/create', component: CreateProject },
    { path: '/projects/:project_id', component: Project, props: { page: 'files' } },
    { path: '/projects/:project_id/threads', component: Project, props: { page: 'threads' } },
    { path: '/projects/:project_id/threads/:thread_id', component: Thread },
    { path: '/projects/:project_id/contribute', component: Project, props: { page: 'contribute' } },
    { path: '/projects/:project_id/contribute/create', component: NewSourceRequest },
    { path: '/projects/:project_id/contribute/:source_request_id', component: SourceRequest },
    { path: '/internal_server_error', component: InternalServerError },
    { path: '/', component: Home },
    { path: '*', component: NotFound }
  ]
})
