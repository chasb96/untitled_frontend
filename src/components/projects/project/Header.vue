<script>
export default {
    name: 'ProjectHeader',
    props: ['name'],
    data() {
        return {
            name: this.name,
        }
    }
}
</script>

<template>
    <div class="row p-2">
        <div class="col-sm-8">
            <h3 class="text-white mt-2 ms-3">{{ name }}</h3>
        </div>
    </div>
</template>