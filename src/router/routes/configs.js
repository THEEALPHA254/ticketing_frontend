import Clients from "@/pages/admin/clients.vue";


export default [
    {
        path: "/clients",
        name: "clients",
        component: Clients,
        meta: {
            requireLogin: true,
            title: "Clients",
    },
    }
];

