<template>
     <div class="mt-5 pl-md-5">
        <v-list density="compact" nav>
          <v-divider></v-divider>

          <v-list-item :active="checkIfActive('home')"  
          :to="{ name: 'home'}"
          prepend-icon="mdi-view-dashboard-outline" title="Dashboard" value="home-page"></v-list-item>
          
          
          <!-- super admin menu options -->
          
          <v-list-item :active="checkIfActive('clients')"  
          prepend-icon="mdi-account-group-outline" title="Clients" value="m-clients"
          v-if="g_Store.isSuperAdmin()"
          :to="{ name: 'clients'}"
          ></v-list-item>
          

          <!-- <v-list-item :active="checkIfActive('orders')" prepend-icon="mdi-auto-fix"   title="Flows" value="orders"></v-list-item> -->
          <v-list-item :active="checkIfActive('orders')" @click.prevent="triggerLogout"  prepend-icon="mdi-logout"   title="Sign Out" value="orders"></v-list-item>
          
          <v-divider></v-divider>
        </v-list>
    </div>
</template>

<script setup>
import { onMounted, ref, onUnmounted } from 'vue';
import { AuthStore } from "@/stores/authStore";
import { globalStore } from "@/stores/globalStore";
import { useRoute, useRouter } from 'vue-router'
import axiosInst, { baseURL } from '@/services/api'
import { Toaster, toast } from 'vue-sonner'

const route = useRoute()
const router = useRouter();
const store = AuthStore();
const g_Store = globalStore();


function checkIfActive(routeName) {
  return routeName === route.name;
}


function triggerLogout() {
  g_Store.showLogoutModal();
}

async function fetchMyClients() {
  try {
    const response = await axiosInst.get(`${baseURL}/auth-usr/user-mappings-obj/get/${g_Store.getUserData().user_id}`);
    // sort
    response.data.sort((a, b) => a.client.client_name.localeCompare(b.client.client_name));
    g_Store.state.my_clients = response.data; // Assuming the API response is an array of client objects
  } catch (error) {
    console.error('Error fetching clients:', error);
    // Handle error gracefully, show error message, etc.
  }
}


// websockets
let socket = null;
const reconnectInterval = 5000; // 5 seconds


function conversationWebSocket() {

    console.log('we are here')
    if (socket) {
        socket.close();
    }

    socket = new WebSocket(`ws://172.105.37.163:9976/ws/chat/${g_Store.getUserData().client}/`);
    // socket = new WebSocket(`ws://127.0.0.1:8000/ws/chat/${g_Store.getUserData().client}/`);

    socket.onopen = function() {
        console.log('WebSocket connection opened');
    };

    socket.onmessage = function(event) {
        const data = JSON.parse(event.data);
        
        // Check if the message is for the selected conversation

        console.log(data)

        let text = data.content

        if (data.message_type == 'order_received'){
          text = 'Customer placed an order'
        }
        else if(data.message_type == 'request_shipping_option'){
          text = ''
        }
        else if(data.message_type == 'customer_selected_shipping_option'){
          text = 'Customer selected a shipping option'
        }
        else if(data.message_type == 'request_address_info'){
          text = ''
        }
        else if(data.message_type == 'customer_address_info'){
          text = 'Customer provided address information'
        }
        else if(data.message_type == 'request_payment_method'){
          text = ''
        }

        else if(data.message_type == 'customer_selected_payment_method'){
          text = 'Customer selected a payment method'
        }
        else if(data.message_type == 'request_mpesa_number'){
          text = ''
        }
        else if(data.message_type == 'customer_confirmed_mpesa_number'){
          text = 'Customer confirmed M-pesa checkout number'
        }
        else if(data.message_type == 'initiate_stk_push'){
          text = ''
        }
        else if(data.message_type == 'payment_success'){
          text = ''
        }
        else if(data.message_type == 'catalogue_message'){
          text = ''
        }
        else if(data.message_type == 'product_message' || data.message_type == 'product_list_message'){
          text = ''
        }

        if(text && data.sender == 'customer'){
          toast('New Message', {
            description: text,
            action: {
              label: 'Open',
              onClick: () => router.push({ name: 'message-agent', query: {
                waba_id: data.waba_id,
                conversation_id: data.conversation
              }})
            }
          })
        }

        g_Store.state.websocket_message.push(data);
    };

    socket.onclose = function(event) {
        console.log('WebSocket connection closed');
        if (!event.wasClean) {
            console.log('WebSocket connection lost, attempting to reconnect...');
            setTimeout(() => {
              if(g_Store.getUserData().client){
                conversationWebSocket(); // Attempt to reconnect
              }
            }, reconnectInterval);
        }
    };

    socket.onerror = function() {
        console.log('WebSocket encountered an error, closing connection.');
        socket?.close();
    };
}



let broad_socket = null;

const connectBroadcastWs = () => {
  
  if (broad_socket) {
    broad_socket.close();
  }
  

  broad_socket = new WebSocket("ws://172.105.37.163:9976/ws/broadcast/");
  // broad_socket = new WebSocket("ws://127.0.0.1:8000/ws/broadcast/");
  
  broad_socket.onopen = function () {
    console.log("Broadcast WebSocket connection established.");
  };

  broad_socket.onmessage = function (event) {
    const data = JSON.parse(event.data);

    // Check if the message is for the selected conversation
    console.log(data);

    if(data == 'reconnect_conversations'){
      if(g_Store.getUserData().client){
        conversationWebSocket()
      }

      g_Store.state.flip_refetch_conversations = !g_Store.state.flip_refetch_conversations
    }

  };

  broad_socket.onclose = function (event) {
    console.log("WebSocket connection closed");
    if (!event.wasClean) {
      console.log(
        "WebSocket connection lost, attempting to reconnect..."
      );
      setTimeout(() => {
        connectBroadcastWs(); // Attempt to reconnect
      }, reconnectInterval);
    }
  };

  broad_socket.onerror = function () {
    console.log("WebSocket encountered an error, closing connection.");
    socket?.close();
  };
};

watch(()=> g_Store.state.flip_reconnect_socket, (newVal)=>{
  if(g_Store.getUserData().client){
    conversationWebSocket()
  }
})

onMounted(()=>{
  // g_Store.fetchClients()
  // fetchMyClients()
  // g_Store.state.flip_reconnect_socket = !g_Store.state.flip_reconnect_socket
 
})

onUnmounted(() => {
  // if (socket) {
  //   socket.close();
  // }
  // if (broad_socket) {
  //     broad_socket.close();
  // }
})
</script>
