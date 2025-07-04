import { ref } from "vue";

export function validationRules(){

    const rules = ref({
    required: (value) => !!value || "Required.",
    counter: (value) => value.length <= 20 || "Max 20 characters",
    email: (value) => {
        const pattern =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return pattern.test(value) || "Invalid e-mail.";
    },
    });
    return { rules }
}