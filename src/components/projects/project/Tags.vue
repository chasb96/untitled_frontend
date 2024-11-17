<script>
import AuthService from '../../../auth';

export default {
    name: 'ProjectTags',
    props: ['tags', 'isOwnedByUser'],
    data() {
        return {
            project_id: '',
            tags: this.tags,
            isOwnedByUser: this.isOwnedByUser,
            inputVisible: false,
        }
    },
    mounted() {
        this.project_id = this.$route.params.project_id;
    },
    methods: {
        showInput() {
            this.inputVisible = true;

            this.$nextTick(() => {
                this.$refs.input.focus()
            })
        },
        async add(value) {
            this.tags.push(value);
            this.inputVisible = false;

            let request = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + new AuthService().getToken(),
                },
                body: JSON.stringify({
                    t: value,
                })
            };

            await fetch('/web/projects/' + this.project_id + '/tags', request);
        },
        async remove(tag) {
            let index = this.tags.indexOf(tag);
            this.tags.splice(index, 1);

            let request = {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + new AuthService().getToken(),
                },
            };

            await fetch('/web/projects/' + this.project_id + '/tags/' + tag, request);
        }
    }
}
</script>

<template>
    <div>
        <div v-for="tag in tags" class="badge bg-primary text-black me-1 mb-2 p-0">
            <div class="px-2 p-1 d-inline">{{ tag }}</div>
            <button v-if="isOwnedByUser" class="btn btn-danger btn-sm p-0 px-1 rounded-2" @click.prevent="remove(tag)">&times;</button>
        </div>
        <button v-if="isOwnedByUser" class="btn badge bg-secondary text-black me-1 mb-2" @click.prevent="showInput()">&plus; Add Tag</button>
        <input 
            v-if="inputVisible" 
            ref="input"
            type="text" 
            class="form-control bg-black border-primary text-primary mt-2 mb-2" 
            v-on:keyup.enter="add($event.target.value)" 
            @blur="inputVisible = false" 
            placeholder="Enter Tag"
        />
    </div>
</template>