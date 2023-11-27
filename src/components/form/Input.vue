<template>
    <div class="input-form">
        <label :class="{required: isRequired}">{{ labelName }}</label>
        <slot></slot>
        <p v-if="isValid" class="error-message">{{ errorMessage }}</p>
    </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  labelName: String,
  errorMessage: String,
  isRequired: Boolean,
  isValid: Boolean
})

</script>

<style lang="scss" scoped>
    .input-form {
        margin-bottom:15px;
    }
    .error-message {
        color:$danger-color;
        font-size:12px;
        margin-top:4px;
    }
    .required {
        position: relative;

        &:after {
            content:'*';
            position: relative;
            left:5px;
            color:$danger-color;
        }
    }
</style>