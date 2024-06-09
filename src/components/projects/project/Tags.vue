<script>
import AuthService from '../../../auth';

export default {
    name: 'ProjectTags',
    props: ['isOwnedByUser'],
    data() {
        return {
            id: '',
            tags: [],
            isOwnedByUser: this.isOwnedByUser,
            inputVisible: false,
        }
    },
    mounted() {
        this.id = this.$route.params.id;

        this.getTags();
    },
    methods: {
        async getTags() {
            let response = await fetch('/api/projects/' + this.id + '/tags');
            let responseBody = await response.json();

            this.tags = responseBody.t;
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

            await fetch('/api/projects/' + this.id + '/tags', request);
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

            await fetch('/api/projects/' + this.id + '/tags/' + tag, request);
        }
    }
}
</script>

<template>
    <div>
        <div v-for="tag in tags" class="badge bg-primary text-black me-1 mb-2 p-0">
            <span class="p-1">{{ tag }}</span>
            <button v-if="isOwnedByUser" class="btn btn-danger btn-sm p-0 px-1 rounded-2" @click.prevent="remove(tag)">&times;</button>
        </div>
        <button v-if="isOwnedByUser" class="btn badge bg-secondary text-black me-1 mb-2" @click.prevent="inputVisible = true">&plus; Add Tag</button>
        <input 
            v-if="inputVisible" 
            type="text" 
            class="form-control bg-black border-primary text-primary mt-2 mb-2" 
            v-on:keyup.enter="add($event.target.value)" 
            @blur="inputVisible = false" 
            placeholder="Enter Tag"
        />
    </div>
</template>