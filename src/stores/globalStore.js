import { ref } from 'vue';
import { defineStore } from 'pinia';
// import useJwt from "@/auth/jwt/useJwt";
import axiosInst from '../services/api'
import { baseURL } from '@/services/api';




export const globalStore = defineStore("globalStore", () => {

    const state = ref({
      logoutModal: false,
      drawer: false,
      clients: [],
      my_clients: [],
      platforms: [],
      my_platforms: [],
      all_platforms: [],
      warehouse_types: [],
      warehouse_statuses: [],
      supplier_statuses: [],
      all_suppliers: [],
      warehouses: [],
      all_brands: [],
      order: [],
      purchase_orders: [],
      products: [],
      purchases: [],
      profiles: [],
      colors: [],
      sizes: [],
      models: [],
      weights: [],
      websocket_message: [],
      flip_reconnect_socket: false,
      flip_refetch_conversations: false,
      flip_changed_client: false,
      flip_refetch_conversation_count: false,
      unread_conversations: 0,
      overlay: false,
      cached_term_options: [],
      // actions: [],
    });


    function showLogoutModal() {
      state.value.logoutModal = true;
    }

    function hideLogoutModal() {
      state.value.logoutModal = false;
    }


    /* These are helper functions to be used globally */

    function getUserData() {
      let userData = JSON.parse(localStorage.getItem("userData"));
      return userData
    }

    function isSuperAdmin() {
      if (getUserData().user_type == 'superadmin') {
        return true
      } else {
        return false
      }
    }

    function isAdmin() {
      if (getUserData().user_type == 'admin') {
        return true
      } else {
        return false
      }
    }


    //fetching all clients
    function fetchClients(){
      axiosInst.get(`${baseURL}/clients/clients`, {
      })
      .then((response) => {
        state.value.clients = response.data.clients
      })
    }

    // function for getting a client name
    function getClientName(id){
      if(!id || state.value.clients.length<1) {
        return 'N/A'
      }else{
      let the_client = state.value.clients.filter(
        client => client.id == id)
      return the_client[0] ? the_client[0].client_name : "N/A"
      }
    }


    function fetchPlatforms(){
      axiosInst.get(`${baseURL}/platforms/platforms`, {
    })
    .then((response) => {
      // console.log(response)
      state.value.platforms = response.data
    })
    .catch(error => {
      console.log(error)
    });
  }

    //function for getting platform name
    function getPlatformName(id){
      if(!id || state.value.platforms.length<1) {
        return 'N/A'
      }else{
      let the_platform = state.value.platforms.filter(
        platform => platform.id == id)
      return the_platform[0] ? the_platform[0].platform_name : "N/A"
      }
    }



    // Fetch my platforms
    function fetchMyPlatforms(){
      let userData = JSON.parse(localStorage.getItem("userData"));
        axiosInst.get(`${baseURL}/platforms/my-platforms/my/${userData.client}`, {
      })
      .then(response => {
          state.value.my_platforms = response.data
          console.log(state.value.my_platforms);
      })
      .catch(error => {
        console.log(error)
      });
    }


        // Get Platform Names for SYNC in orders and Assortments
    function getMyPlatformName(id){
      if(!id || state.value.my_platforms.length<1) {
        return 'N/A'
      }else{
      let platform = state.value.my_platforms.filter(
        platform => platform.id == id)
      return platform[0] ? platform[0].platform : "N/A"
      }
    }


    // ******
    // Get Platform Ids for SYNC in orders and Assortments

    function getPlatformId(name){
      if(name){
        let index = state.value.platforms.findIndex(x => x.platform_name == name )

        if(index > -1){
          return state.value.platforms[index].id
        }else{
          return 'N/A'
        }
      }
    }




// Convert back Platform Name to MyPlatform ID
    function getMyPlatformId(name){
      if(name){
        let index = state.value.my_platforms.findIndex(x => x.platform == name )

        if(index > -1){
          return state.value.my_platforms[index].id
        }else{
          return 'N/A'
        }
      }
    }


    // Fetch All Platforms regardless of client
      function fetchAllMyPlatforms(){
          axiosInst.get(`${baseURL}/platforms/my-platforms`, {
        })
        .then((response) => {
          // console.log(response)
          state.value.all_platforms = response.data
        })
        .catch(error => {
          console.log(error)
        });
      }


    // Get All My Platform Names
    function getAllMyPlatformName(id){
      if(!id || state.value.all_platforms.length<1) {
        return 'N/A'
      }else{
      let the_platform = state.value.all_platforms.filter(
        platform => platform.id == id)
      return the_platform[0] ? the_platform[0].platform : "N/A"
      }
    }

     // Display all Sizes in table
 function fetchSizes(){
    axiosInst.get(`${baseURL}/whitelabel/sizes/${getUserData().client}`, {
  })
  .then(response => {
       console.log(response)
       // sizes.value = response.data
      state.value.sizes = response.data
   })
  .catch(error => {
    console.log(error)

  });
}
 // Display all Weightss in table
 function fetchWeights(){
    axiosInst.get(`${baseURL}/whitelabel/weights/${getUserData().client}`, {
  })
  .then(response => {
      console.log(response)
      //weights.value = response.data
      state.value.weights = response.data
   })
  .catch(error => {
    console.log(error)
  });
}

 // Display all Models in table
 function fetchModels(){
    axiosInst.get(`${baseURL}/whitelabel/modeltypes/${getUserData().client}`, {
  })
  .then(response => {
      //console.log(response)
      //models.value = response.data
      state.value.models = response.data
   })
  .catch(error => {
    console.log(error)
  });
}
    // Fetch warehouses
    function fetchWarehouses(){
      axiosInst.get(`${baseURL}/warehouses/warehouse/${getUserData().client}`, {
    })
    .then((response) => {
        //   warehouses.value = response.data
        state.value.warehouses = response.data
     })
    .catch((error) => {
      console.log(error)
    });
  }
   // Display all Colors in table
 function fetchColors(){
    axiosInst.get(`${baseURL}/whitelabel/colors/${getUserData().client}`, {
  })
  .then(response => {
      // console.log(response)
        //colors.value = response.data
      state.value.colors = response.data
   })
  .catch(error => {
    console.log(error)
  });
}


  // Fetch warehouse names

  function getWarehouseName(id){
    if(!id || state.value.warehouses.length<1){
      return 'N/A'
    }else{
      let w_name = state.value.warehouses.filter(
        warehouse => warehouse.id == id)
        return w_name[0] ? w_name[0].warehouse_name: "N/A"
    }
  }




// fetching warehouse type
    function fetchWarehouseType(){
      axiosInst.get(`${baseURL}/warehouses/warehouse_types`, {
    })
    .then((response) => {
        state.value.warehouse_types = response.data
    })
    .catch((error) => {
      console.log(error)
    });
  }

    // function for getting warehouse type
    function getWarehouseType(id){
      if(!id || state.value.warehouse_types.length<1){
        return 'N/A'
      }else{
        let the_type = state.value.warehouse_types.filter(
          warehouse_type => warehouse_type.id == id)
          return the_type[0] ? the_type[0].warehouse_type: "N/A"
      }
    }

    // fetching warehouse status
    function fetchWarehouseStatus(){
      axiosInst.get(`${baseURL}/warehouses/warehouse_statuses`, {
    })
    .then((response) => {
        state.value.warehouse_statuses = response.data
    })
    .catch(error => {
      console.log(error)
    });
  }

    // function for getting a warehouse status list
    function getWarehouseStatus(id){
      if(!id || state.value.warehouse_statuses.length<1){
        return 'N/A'
      }else{
        let the_status = state.value.warehouse_statuses.filter(
          warehouse_status => warehouse_status.id == id)
          return the_status[0] ? the_status[0].warehouse_status: "N/A"
      }
    }

    //fetch Supplier Statuses data
    function fetchSupplierStatus(){
        axiosInst.get(`${baseURL}/suppliers/supplier_status`, {
      })
      .then((response) => {
          state.value.supplier_statuses = response.data
      })
      .catch(error => {
          console.log(error)
      });
    }

    // function for getting a supplier status list
    function getSupplierStatus(id){
      if(!id || state.value.supplier_statuses.length<1){
        return 'N/A'
      }else{
        let s_status = state.value.supplier_statuses.filter(
          sup => sup.id == id)
          return s_status[0] ? s_status[0].supplier_status: "N/A"
      }
    }

    //fetch suppliers
    function fetchSuppliers(){
      axiosInst.get(`${baseURL}/suppliers/supplier`, {
    })
    .then((response) => {
        //   suppliers.value = response.data
        state.value.all_suppliers = response.data
     })
    .catch(error => {
      console.log(error)
    });
  }

  //Fetch supplier names
  function getSupplierName(id){
    if(!id || state.value.all_suppliers.length<1){
      return 'N/A'
    }else{
      let s_name = state.value.all_suppliers.filter(
        sup => sup.id == id)
        return s_name[0] ? s_name[0].supplier_name: "N/A"
    }
  }

      // Fetch all Brands

      function fetchAllBrands(){
        axiosInst.get(`${baseURL}/whitelabel/brands`, {
        })
      .then((response) => {
          state.value.all_brands = response.data
      })
      .catch(error => {
        console.log(error)
      });
    }

    //Get Brand Names
    function getBrandName(id){
      if(!id || state.value.all_brands.length<1){
        return 'N/A'
      }else{
        let b_name = state.value.all_brands.filter(
          brand => brand.id == id)
          return b_name[0] ? b_name[0].name: "N/A"
      }
    }




    // Order Status
    function fetchOrderStatus(){
      axiosInst.get(`${baseURL}/orders/order_status`, {
    })
    .then(response => {
      // console.log(response)
      state.value.order = response.data
    })
    .catch(error => {
      console.log(error)
    });
  }

  // Order Status Identity -- Display the name through the id
  function getOrderStatus(id){
    if(!id || state.value.order.length<1){
      return 'N/A'
    }else{
      let order_name = state.value.order.filter(
        ord => ord.id == id)
        return order_name[0] ? order_name[0].status: "N/A"
    }
  }


  //Purchase Order
  function fetchPurchaseOrder(){
    let userData = JSON.parse(localStorage.getItem("userData"));
    axiosInst.get(`${baseURL}/purchase-orders/purchase-orders/${userData.client}`, {
    })
    .then((response) => {
        state.value.purchases = response.data
        // console.log(state.value.purchase_orders)
    })
    .catch(error => {
      console.log(error)
    });
  }


// Get Purchase Order Name
function getPurchaseOrderName(id){
  if(!id || state.value.purchases.length<1){
    return 'N/A'
  }else{
    let p_name = state.value.purchases.filter(
      po => po.id == id)
      return p_name[0] ? p_name[0].name: "N/A"
  }
}





  // Get Purchase Order Status
    function fetchPurchaseOrderStatus(){
        axiosInst.get(`${baseURL}/purchase-orders/po-status`, {
        })
      .then((response) => {
          state.value.purchase_orders = response.data
          // console.log(state.value.purchase_orders)
      })
      .catch(error => {
        console.log(error)
      });
    }

    //Get PO Status Name

    function getPOSName(id){
      if(!id || state.value.purchase_orders.length<1){
        return 'N/A'
      }else{
        let po_name = state.value.purchase_orders.filter(
          pos => pos.id == id)
          return po_name[0] ? po_name[0].status: "N/A"
      }
    }


    // Fetch Assortment Products
    function fetchProducts(){
      let userData = JSON.parse(localStorage.getItem("userData"));
      axiosInst.get(`${baseURL}/product/assortment/get_list_no_pagination/${userData.client}`, {
      })
      .then((response) => {
        state.value.products = response.data
      })
    }



    function getProductName(id) {
      if (!id || !state.value.products || !Array.isArray(state.value.products) || state.value.products.length < 1) {
        return 'Loading...';
      } else {
        const product = state.value.products.filter(prod => prod.id === id);
        return product[0] ? product[0].title : 'N/A';
      }
    }



    function fetchUserClient(id){
      axiosInst.get(`${baseURL}/auth-usr/user/${id}`, {
      })
      .then((response) => {
          state.value.user = response.data.user
          console.log(state.value.user)
      })
      .catch(error => {
        console.log(error)
      });
    }







    // Fetch Profiles -- for permissions
    function fetchProfiles(){
      axiosInst.get(`${baseURL}/whitelabel/profiles`, {
      })
      .then((response) => {
        state.value.profiles = response.data
        // console.log(state.value.profiles);
      }).catch((error)=>{
        console.log(error)
      })
    }

    //Display Profile Name
    function getProfileName(id){
      if(!id || state.value.profiles.length<1){
        return 'N/A'
      }else{
        let profile_name = state.value.profiles.filter(
          ord => ord.id == id)
          return profile_name[0] ? profile_name[0].name: "N/A"
      }
    }


    // get Actions
  //   function fetchAllActions(){
  //       let userData = JSON.parse(localStorage.getItem("userData"));
  //       axiosInst.get(`${baseURL}/whitelabel/myactions/client/${userData.client}`)
  //         .then(response => {
  //           state.value.actions = response.data;
  //           console.log(state.value.actions);
  //         })
  //         .catch(error => {
  //           console.error(error);
  //         });
  //   }

  // fetchAllActions()

    //get action Name
    // function getActionName(id){
    //   if(!id || state.value.actions.length<1){
    //     return 'N/A'
    //   }else{
    //     let profile_name = state.value.actions.filter(
    //       ord => ord.id == id)
    //       return profile_name[0] ? profile_name[0].name: "N/A"
    //   }
    // }




  return {
    state,
    getUserData,
    isSuperAdmin,
    isAdmin,
    showLogoutModal,
    hideLogoutModal,
    fetchClients,
    fetchPlatforms,
    fetchMyPlatforms,
    getClientName,
    getPlatformName,
    getPlatformId,
    getMyPlatformId,
    getMyPlatformName,
    fetchAllMyPlatforms,
    getAllMyPlatformName,
    fetchWarehouses,
    getWarehouseName,
    fetchWarehouseStatus,
    fetchWarehouseType,
    getWarehouseType,
    getWarehouseStatus,
    fetchSupplierStatus,
    getSupplierStatus,
    fetchSuppliers,
    getSupplierName,
    fetchAllBrands,
    getBrandName,
    fetchOrderStatus,
    getOrderStatus,
    fetchPurchaseOrderStatus,
    getPOSName,
    fetchProducts,
    getProductName,
    fetchPurchaseOrder,
    getPurchaseOrderName,
    fetchUserClient,
    fetchProfiles,
    getProfileName,
    fetchColors,
    fetchSizes,
    fetchModels,
    fetchWeights
  };
});
