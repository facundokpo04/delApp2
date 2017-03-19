angular.module('app.services', [])



        .factory('sharedUtils', ['$ionicLoading', '$ionicPopup', function ($ionicLoading, $ionicPopup) {


                var functionObj = {};
                functionObj.showLoading = function () {
                    $ionicLoading.show({
                        content: '<i class=" ion-loading-c"></i> ', // The text to display in the loading indicator
                        animation: 'fade-in', // The animation to use
                        showBackdrop: true, // Will a dark overlay or backdrop cover the entire view
                        maxWidth: 200, // The maximum width of the loading indicator. Text will be wrapped if longer than maxWidth
                        showDelay: 0 // The delay in showing the indicator
                    });
                };
                functionObj.hideLoading = function () {
                    $ionicLoading.hide();
                };
                functionObj.showAlert = function (title, message) {
                    var alertPopup = $ionicPopup.alert({
                        title: title,
                        template: message
                    });
                };
                return functionObj;
            }])





        .factory('sharedCartService', ['$ionicPopup', 'restApi', function ($ionicPopup, restApi) {


                var cartObj = {};
                cartObj.cart = []; //lista de productos  (producto, cantidad)         
                cartObj.total_amount = 0; // total de productos
                cartObj.total_compAmount = 0; // total de componentes
                cartObj.total_qty = 0; // cant producto
                cartObj.total_compqty = 0; // cantidad de componente
                cartObj.idPE = -1;
                cartObj.comentariosP = '';
                cartObj.generarPedido = function (data) {

                    var data2 = {};
                    data2.pe_idCliente = data.idCliente;
                    data2.pe_idDireccion = data.idDireccion;
                    data2.pe_medioPago = data.medioPago;
                    data2.pe_comentarios = cartObj.comentariosP;
                    data2.pe_idPersona = data.idCliente;
                    data2.pe_cli_tel = data.tel;
                    data2.pe_idEstado = 1;
                    restApi.call({
                        method: 'post',
                        url: 'pedidoencabezado/insertar',
                        data: data2,
                        response: function (r) {
                            cartObj.idPE = r.result;
                        },
                        error: function (r) {

                        },
                        validationError: function (r) {

                        }
                    });
                }

                cartObj.generarDetalle = function () {

                    angular.forEach(cartObj.cart, function (value, key) {
                        var prodPedido = {};
                        prodPedido.precioBase = value.producto.prod_precioBase;
                        prodPedido.idProducto = value.producto.prod_id;
                        prodPedido.idVariedad = value.variedad.var_id;
                        prodPedido.precioCalc = value.price + value.compAmount;
                        prodPedido.componentes = value.componentes;
                        restApi.call({
                            method: 'post',
                            url: 'productopedido/insertar',
                            data: prodPedido,
                            response: function (r) {
                                debugger;
                                cartObj.registrarDetalle(value, r.result);
                            },
                            error: function (r) {

                            },
                            validationError: function (r) {

                            }
                        });
                    });
                }

                cartObj.registrarDetalle = function (value, idpp) {
                    debugger;
                    var detallePedido = {};
                    detallePedido.dp_Cantidad = parseInt(value.qty);
                    detallePedido.dp_PrecioUnitario = value.price + value.compAmount;
                    detallePedido.dp_idProductoPedido = idpp;
                    detallePedido.dp_idPedidoEncabezado = cartObj.idPE;
                    restApi.call({
                        method: 'post',
                        url: 'detallepedido/insertar',
                        data: detallePedido,
                        response: function (r) {
                            debugger;
                        },
                        error: function (r) {
                            debugger;
                            //abria que limpiar el carro si guardo

                        },
                        validationError: function (r) {

                        }
                    });
                }

                cartObj.vaciarCarro = function () {
                    cartObj.cart = []; //lista de productos  (producto, cantidad)         
                    cartObj.total_amount = 0; // total de productos
                    cartObj.total_compAmount = 0; // total de componentes
                    cartObj.total_qty = 0; // cant producto
                    cartObj.total_compqty = 0; // cantidad de componente
                    cartObj.idPE = -1;
                    cartObj.comentariosP = '';
                };
                cartObj.cargarComentarios = function () {

                    angular.forEach(cartObj.cart, function (value, key) {

                        cartObj.comentariosP = cartObj.comentariosP + ' Producto = ' + value.producto.prod_nombre + ' comentario =' + value.comentario + '\n';
                    });
                }
                cartObj.cart.add = function (item) {

                    if (cartObj.cart.find(item.producto.prod_id) != -1) {
                        var alertPopup = $ionicPopup.alert({
                            title: 'El Producto ya fue agregado',
                            template: 'Incremente la cantidad en el pedido'
                        });
                    } else {

                        cartObj.cart.push(item);
                        cartObj.total_qty += item.qty;
                        cartObj.total_comqty += item.comqty;
                        cartObj.total_amount += parseFloat(parseInt(item.qty) * parseFloat(item.price));
                        cartObj.total_compAmount += item.compAmount;
                    }
                };
                cartObj.cart.find = function (id) {
                    var result = -1;
                    for (var i = 0, len = cartObj.cart.length; i < len; i++) {
                        if (cartObj.cart[i].producto.prod_id === id) {
                            result = i;
                            break;
                        }
                    }
                    return result;
                    //revisar hacerlo con each
                };
                cartObj.cart.drop = function (id) {

                    var ind = cartObj.cart.find(id);
                    var temp = cartObj.cart[ind];
                    cartObj.total_qty -= parseInt(temp.qty);
                    cartObj.total_compqty -= parseInt(temp.comqty);
                    cartObj.total_amount -= (parseInt(temp.qty) * parseInt(temp.price));
                    cartObj.total_compAmount -= parseFloat(temp.compAmount);
                    cartObj.cart.splice(ind, 1);
                };
                cartObj.cart.increment = function (id) {

                    var ind = cartObj.cart.find(id);
                    var temp = cartObj.cart[ind];
                    temp.qty += 1;
                    cartObj.total_compqty += parseInt(temp.comqty); //preguntar si aumenta la cant del prooducto aumenta los componentes tambien
                    cartObj.total_qty += 1;
                    cartObj.total_amount += (parseInt(cartObj.cart[ind].price));
                    cartObj.total_compAmount += parseFloat(temp.compAmount);
                };
                cartObj.cart.decrement = function (id) {
                    var ind = cartObj.cart.find(id);
                    var temp = cartObj.cart[ind];
                    cartObj.total_qty -= 1;
                    cartObj.total_amount -= parseInt(temp.price);
                    cartObj.total_compqty -= parseInt(temp.comqty);
                    cartObj.total_compAmount -= parseFloat(temp.compAmount);
                    if (cartObj.cart[cartObj.cart.find(id)].qty == 1) {  // if the cart item was only 1 in qty
                        cartObj.cart.splice(cartObj.cart.find(id), 1); //edited
                    } else {
                        cartObj.cart[cartObj.cart.find(id)].qty -= 1;
                    }

                };
//                cartObj.cartComponent.incrementComp = function (idcomp) {
//                    debugger;
//                    var ind = cartObj.cartComponent.find(idcomp);
//                    cartObj.cartComponent[ind].qty += 1;
//                    cartObj.total_compqty += 1;
//                    cartObj.total_compAmount += (parseInt(cartObj.cartComponent[ind].componente.com_precio));
//
//                };
//
//                cartObj.cartComponent.decrementComp = function (idcomp) {
//                    debugger;
//                    cartObj.total_qty -= 1;
//                    var ind = cartObj.cartComponent.find(idcomp);
//
//                    cartObj.total_amount -= parseInt(cartObj.cartComponent[ind].componente.com_precio);
//                    if (cartObj.cartComponent[ind].qty == 1) {  // if the cart item was only 1 in qty
//                        cartObj.cartComponent.splice(ind, 1);  //edited
//                    } else {
//                        cartObj.cartComponent[ind].qty -= 1;
//                    }
//                };
//                
//                cartObj.cartComponent.addAll = function (componentes) {
//
//                    angular.forEach(componentes, function (value, key) {
//                        cartObj.cartComponent.add(value);
//                    });
//
//
//                };
//                cartObj.cartComponent.add = function (itemcomp) {
//
//                    if (cartObj.cartComponent.find(itemcomp.componente.com_id) != -1) {
//                        var alertPopup = $ionicPopup.alert({
//                            title: 'Este Opcional ya fue agregado',
//                            template: 'Incremente la cantidad en el pedido'
//                        });
//                    } else {
//
//                        cartObj.cartComponent.push(itemcomp);
//                        cartObj.total_compqty += itemcomp.qty;
//                        cartObj.total_compAmount += parseFloat(itemcomp.componente.com_precio);
//
//                    }
//
//
//                };
//                cartObj.cartComponent.find = function (idcomp) {
//
//
//                    var result = -1
//
//                    for (var i = 0, len = cartObj.cartComponent.length; i < len; i++) {
//
//                        if (cartObj.cartComponent[i].componente.com_id === idcomp) {
//                            result = i;
//                            break;
//                        }
//                    }
//
//                    return result;
//
//
//
//                };
//                cartObj.cartComponent.dropCom = function (id) {
//
//                    ind = cartObj.cartComponent.find(id);
//                    var temp = cartObj.cartComponent[ind];
//                    cartObj.total_compqty -= parseInt(temp.qty);
//                    cartObj.total_compAmount -= (parseInt(temp.qty) * parseInt(temp.componente.com_precio));
//                    cartObj.cartComponent.splice(ind, 1);
//
//                };

                cartObj.getQty = function () {
                    return  cartObj.total_qty;
                };
                return cartObj;
            }])


        .factory('auth', ['$location', '$state', function ($location, $state) {
                var auth = {
                    setToken: function (token) {
                        localStorage[API.token_name] = token;
                    },
                    getToken: function () {
                        return localStorage[API.token_name];
                    },
                    getUserData: function () {
                        try
                        {
                            var token = localStorage[API.token_name];
                            if (token === '')
                                return;
                            var base64Url = token.split('.')[1];
                            var base64 = base64Url.replace('-', '+').replace('_', '/');
                            return JSON.parse(window.atob(base64)).data;
                        } catch (err) {
                            $location.path('/');
                        }
                    },
                    logout: function () {
                        localStorage[API.token_name] = '';
                        //                                                                        $state.go('login');
                    },
                    hasToken: function () {
                        return (localStorage[API.token_name] !== '');
                    },
                    redirectIfNotExists: function () {
                        if (!auth.hasToken()) {
                            $state.go('login');
                        }
                    }
                };
                return auth;
            }])
        .factory('BlankFactory', [function () {

            }])
        .service('restApi', ['$http', 'auth', function ($http, auth) {

            }])

        .factory('BlankFactory', [function () {

            }])
        .service('restApi', ['$http', 'auth', function ($http, auth) {


                this.call = function (config) {
                    var headers = {};
                    headers[API.token_name] = auth.getToken();
//                                                                  headers['Content-Type'] = 'application/x-www-form-urlencoded';




                    var http_config = {
                        method: config.method,
                        url: API.base_url + config.url,
                        data: typeof (config.data) === 'undefined' ? null : config.data,
                        headers: headers
                    };
                    $http(http_config).then(function successCallback(response) {

                        config.response(response.data);
                    }, function errorCallback(response) {
                        switch (response.status) {
                            case 401: // No autorizado
                                auth.logout();
                                break;
                            case 422: // Validación
                                config.validationError(response.data);
                                break;
                            default:
                                config.error(response);
                                console.log(response.statusText);
                                break;
                        }
                    });
                };
            }]);





