angular.module('app.controllers', [])

        .controller('loginCtrl', function ($scope, $rootScope, $ionicHistory, sharedUtils, $state, $ionicSideMenuDelegate, auth, restApi) {
            $rootScope.extras = false;

            // For hiding the side bar and nav icon


            // When the user logs out and reaches login page,
            // we clear all the history and cache to prevent back link
            $scope.$on('$ionicView.enter', function (ev) {
                if (ev.targetScope !== $scope) {
                    $ionicHistory.clearHistory();
                    $ionicHistory.clearCache();
                }
            });

            if (auth.hasToken()) {
                $ionicHistory.nextViewOptions({
                    historyRoot: true
                });
                $ionicSideMenuDelegate.canDragContent(true);  // Sets up the sideMenu dragable
                $rootScope.extras = true;
                sharedUtils.hideLoading();
                $state.go('app.menu', {}, {location: "replace"});

            }



            //chekear si ya esta logeado

            $scope.login = function (formName, cred) {

                auth.getToken();

                if (formName.$valid)
                
                {  // Check if the form data is valid or not

                    sharedUtils.showLoading();

                    restApi.call(
                            {
                        method: 'post',
                        url: 'auth/autenticar',
                        data: {
                            Correo: cred.email,
                            Password: cred.password
                        },
                        response: function (r) 
                        {

                            if (r.response) 
                            {

                                auth.setToken(r.result);
                                $ionicHistory.nextViewOptions({
                                    historyRoot: true
                                });
                                $ionicSideMenuDelegate.canDragContent(true);  // Sets up the sideMenu dragable
                                $rootScope.extras = true;
                                sharedUtils.hideLoading();
                                $state.go('app.menu', {}, {location: "replace"});
                            } else 
                            
                            {
                                sharedUtils.hideLoading();
                                sharedUtils.showAlert("Please note", "Authentication Error");
                                alert(r.message);

                            }
                        },
                        error: function (r) {

                        },
                        validationError: function (r) {

                        }
                    });



                } else {
                    sharedUtils.showAlert("Please note", "Entered data is not valid");
                }



            }




            $scope.loginFb = function () {
                //Facebook Login
            };

            $scope.loginGmail = function () {
                //Gmail Login
            };


        })

        .controller('signupCtrl', function ($scope, $rootScope, sharedUtils, $ionicSideMenuDelegate,
                $state, $ionicHistory, restApi, auth) {

            $rootScope.extras = false; // For hiding the side bar and nav icon


            $scope.registrar = function (formName, cred) {
                if (formName.$valid)
                {

                    data2 = {}
                    data2.per_nombre = cred.name;
                    data2.per_email = cred.email;
                    data2.per_password = md5(cred.password);
                    data2.per_celular = cred.phone;


                    restApi.call({
                        method: 'post',
                        url: 'persona/insertar',
                        data: data2,
                        response: function (r) {


                            if (r.response) {
                                //Registered OK
                                $ionicHistory.nextViewOptions({
                                    historyRoot: true
                                });
                                $ionicSideMenuDelegate.canDragContent(true);  // Sets up the sideMenu dragable
                                $rootScope.extras = true;
                                sharedUtils.hideLoading();
                                $state.go('app.menu', {}, {location: "replace"});

                            } else {
                                alert(r.message);

                            }
                        },
                        error: function (r) {

                        },
                        validationError: function (r) {

                        }
                    });
                } else {
                    sharedUtils.showAlert("Please note", "Alguno de los datos no es valido");
                }


            }



        })

        .controller('menu2Ctrl', function ($scope, $rootScope, $ionicSideMenuDelegate, $state,
                $ionicHistory, sharedCartService, sharedUtils, restApi, auth) {

            if (auth.hasToken())
            
            {
                $scope.user_info = auth.getUserData(); 
                $ionicHistory.clearHistory();//Saves data to user_info

            } else {
                $ionicSideMenuDelegate.toggleLeft(); //To close the side bar
                $ionicSideMenuDelegate.canDragContent(false);  // To remove the sidemenu white space
                $ionicHistory.nextViewOptions({
                    historyRoot: true
                });
                $rootScope.extras = false;
                sharedUtils.hideLoading();
                $state.go('tabsController.login', {}, {location: "replace"});

            }
            $scope.categorias = [];


            loadPromos = function () {

                restApi.call({
                    method: 'get',
                    url: 'promo/listar',
                    response: function (r) {

                        $scope.promos = r.data;
                    },
                    error: function (r) {

                    },
                    validationError: function (r) {

                    }
                });
//    $scope.categorias=cate.get();  
            }
            loadCategorias = function () {
                sharedUtils.showLoading();
                restApi.call({
                    method: 'get',
                    url: 'categoria/listar/5/0',
                    response: function (r) {

                        $scope.categorias = r.data;


                    },
                    error: function (r) {

                    },
                    validationError: function (r) {

                    }
                });


//    $scope.categorias=cate.get();  
                sharedUtils.hideLoading();
            }
            loadproUrl = function () {

                restApi.call({
                    method: 'get',
                    url: 'promo/url',
                    response: function (r) {

                        $scope.urlpro = decodeURIComponent(r);
                    },
                    error: function (r) {

                    },
                    validationError: function (r) {

                    }
                });
//    $scope.categorias=cate.get();  
            }
            loadUrl = function () {

                restApi.call({
                    method: 'get',
                    url: 'producto/url',
                    response: function (r) {

                        $scope.url = decodeURIComponent(r);
                    },
                    error: function (r) {

                    },
                    validationError: function (r) {

                    }
                });
//    $scope.categorias=cate.get();  
            }
            loadcatUrl = function () {

                restApi.call({
                    method: 'get',
                    url: 'categoria/url',
                    response: function (r) {

                        $scope.urlcat = decodeURIComponent(r);
                    },
                    error: function (r) {

                    },
                    validationError: function (r) {

                    }
                });
//    $scope.categorias=cate.get();  
            }
            loadUrl();
            loadcatUrl();
            loadPromos();
            loadCategorias();

            $scope.loadProductos = function (itemcat) {
                restApi.call({
                    method: 'get',
                    url: 'producto/listarCat/' + itemcat.cat_id,
                    response: function (r) {
                        itemcat.productos = r.data;
                    },
                    error: function (r) {

                    },
                    validationError: function (r) {

                    }
                });


//    $scope.categorias=cate.get();  

            }
            
            


           
            // On Loggin in to menu page, the sideMenu drag state is set to true
            $ionicSideMenuDelegate.canDragContent(true);
            $rootScope.extras = true;

            // When user visits A-> B -> C -> A and clicks back, he will close the app instead of back linking
            $scope.$on('$ionicView.enter', function (ev) {
                if (ev.targetScope !== $scope) {
                    $ionicHistory.clearHistory();
                    $ionicHistory.clearCache();
                }
            });





            $scope.showProductInfo = function (id) {



            };

            $scope.addToCart = function (item) {

                $state.go("app.productodet", {"id": item.prod_id}, {location: "replace"});

            };

        })
        .controller('categoriasCtrl', function ($scope, $rootScope, $ionicSideMenuDelegate, restApi, $state,
                $ionicHistory, sharedCartService, sharedUtils, auth) {

            if (auth.hasToken()) {
                $scope.user_info = auth.getUserData(); 
                 $ionicHistory.clearHistory();//Saves data to user_info

            } else {
                $ionicSideMenuDelegate.toggleLeft(); //To close the side bar
                $ionicSideMenuDelegate.canDragContent(false);  // To remove the sidemenu white space
                $ionicHistory.nextViewOptions({
                    historyRoot: true
                });
                $rootScope.extras = false;
                sharedUtils.hideLoading();
                $state.go('tabsController.login', {}, {location: "replace"});

            }

            $scope.url = '';

            // On Loggin in to menu page, the sideMenu drag state is set to true
            $ionicSideMenuDelegate.canDragContent(true);
            $rootScope.extras = true;

            // When user visits A-> B -> C -> A and clicks back, he will close the app instead of back linking
            $scope.$on('$ionicView.enter', function (ev) {
                if (ev.targetScope !== $scope) {
                    $ionicHistory.clearHistory();
                    $ionicHistory.clearCache();
                }
            });



            loadUrl = function () {

                restApi.call({
                    method: 'get',
                    url: 'categoria/url',
                    response: function (r) {

                        $scope.url = decodeURIComponent(r);
                    },
                    error: function (r) {

                    },
                    validationError: function (r) {

                    }
                });
//    $scope.categorias=cate.get();  
            }

            loadPromos = function () {

                restApi.call({
                    method: 'get',
                    url: 'promo/listar',
                    response: function (r) {

                        $scope.promos = r.data;
                    },
                    error: function (r) {

                    },
                    validationError: function (r) {

                    }
                });
//    $scope.categorias=cate.get();  
            }

            loadUrl();
            loadPromos();

            $scope.loadCategorias = function () {
                sharedUtils.showLoading();
                restApi.call({
                    method: 'get',
                    url: 'categoria/listar/5/0',
                    response: function (r) {

                        $scope.categorias = r.data;
                    },
                    error: function (r) {

                    },
                    validationError: function (r) {

                    }
                });


//    $scope.categorias=cate.get();  
                sharedUtils.hideLoading();
            }

            $scope.showProductInfo = function (item) {

                $state.go("app.menucat", {"id": item.cat_id, "nombre": item.cat_nombre});

            };


        })
        .controller('menucatCtrl', function ($scope, $rootScope, $ionicSideMenuDelegate, $state,
                $ionicHistory, sharedCartService, sharedUtils, $stateParams, restApi,auth) {


            //Check if user already logged in

            if (auth.hasToken()) 
            {
                // On Loggin in to menu page, the sideMenu drag state is set to true
//                $ionicHistory.clearHistory();
                $scope.user_info = auth.getUserData();
                //Saves data to user_info

            } else {
                $ionicSideMenuDelegate.toggleLeft(); //To close the side bar
                $ionicSideMenuDelegate.canDragContent(false);  // To remove the sidemenu white space
                $ionicHistory.nextViewOptions({
                    historyRoot: true
                });
                $rootScope.extras = false;
                sharedUtils.hideLoading();
                $state.go('tabsController.login', {}, {location: "replace"});

            }
            
            $ionicSideMenuDelegate.canDragContent(true);
            $rootScope.extras = true;
             $ionicHistory.clearHistory();

            // When user visits A-> B -> C -> A and clicks back, he will close the app instead of back linking
//            $scope.$on('$ionicView.enter', function (ev) {
//                if (ev.targetScope !== $scope) {
//                    $ionicHistory.clearHistory();
//                    $ionicHistory.clearCache();
//                }
//            });
            $scope.titulo = $stateParams.nombre;

            $scope.url = '';
            loadUrl = function () {

                restApi.call({
                    method: 'get',
                    url: 'producto/url',
                    response: function (r) {

                        $scope.url = decodeURIComponent(r);
                    },
                    error: function (r) {

                    },
                    validationError: function (r) {

                    }
                });
//    $scope.categorias=cate.get();  
            }

            loadUrl();

            $scope.loadProductos = function () {
                sharedUtils.showLoading();



                restApi.call({
                    method: 'get',
                    url: 'producto/listarCat/' + $stateParams.id,
                    response: function (r) {

                        $scope.menu = r.data;
                    },
                    error: function (r) {

                    },
                    validationError: function (r) {

                    }
                });
//    $scope.categorias=cate.get();  
                sharedUtils.hideLoading();
            }

           

            $scope.addToCart = function (item) {
                
//                $ionicHistory.clearCache().then(function(){ $state.go("app.productodet", {"id": item.prod_id});});
                 
                
                 $state.go("app.productodet", {"id": item.prod_id});

                  
               

            };

        })

        .controller('productodetCtrl', function ($scope, $rootScope, $ionicSideMenuDelegate, restApi, $state,
                $ionicHistory, sharedCartService, $ionicPopup, sharedUtils, $stateParams, auth) {

// $scope.titulo = $stateParams.nombre;

//valida si esta logeado

            
            if (auth.hasToken())

            {
                $scope.user_info = auth.getUserData(); //Saves data to user_info


            } else
            {

                $ionicSideMenuDelegate.toggleLeft(); //To close the side bar
                $ionicSideMenuDelegate.canDragContent(false);  // To remove the sidemenu white space
                $ionicHistory.nextViewOptions({
                    historyRoot: true
                });
                $rootScope.extras = false;
                sharedUtils.hideLoading();
                $state.go('tabsController.login', {}, {location: "replace"});

            }
            // On Loggin in to menu page, the sideMenu drag state is set to true
            $ionicSideMenuDelegate.canDragContent(true);
            $rootScope.extras = true;

            // When user visits A-> B -> C -> A and clicks back, he will close the app instead of back linking
            $scope.$on('$ionicView.enter', function (ev) {
                if (ev.targetScope !== $scope) {
                    $ionicHistory.clearHistory();
                    $ionicHistory.clearCache();
                }


            });
//



            var cart = sharedCartService.cart;
            var cartComponent = sharedCartService.cartComponent;
            var item = {};

            $scope.selectedVariedad = {};
            $scope.producto = {};

            $scope.urlpro = '';
            $scope.componentes = [];
            $scope.variedades = [];
            $scope.componentesSelected = [];
            $scope.isvar = false;
            $scope.iscomp = false;




            loadUrlpro = function () {

                restApi.call({
                    method: 'get',
                    url: 'producto/url',
                    response: function (r) {

                        $scope.urlpro = decodeURIComponent(r);
                    },
                    error: function (r) {

                    },
                    validationError: function (r) {

                    }
                });
//    $scope.categorias=cate.get();  
            }

            loadProducto = function () {
                restApi.call({
                    method: 'get',
                    url: 'producto/obtener/' + $stateParams.id,
                    response: function (r) {
                        $scope.producto = r;


                    },
                    error: function (r) {

                    },
                    validationError: function (r) {

                    }
                });

            }

            loadComponentes = function () {

                restApi.call({
                    method: 'get',
                    url: 'producto/listarComp/' + $stateParams.id,
                    response: function (r) {
                        $scope.componentes = r;
                        $scope.iscomp = ($scope.componentes.length > 0);

                    },
                    error: function (r) {

                    },
                    validationError: function (r) {

                    }
                });
//    $scope.categorias=cate.get();  
            }

            loadVariedades = function () {

                restApi.call({
                    method: 'get',
                    url: 'producto/listarVar/' + $stateParams.id,
                    response: function (r) {
                        $scope.variedades = r;
                        $scope.isvar = ($scope.variedades.length > 0);
                    },
                    error: function (r) {

                    },
                    validationError: function (r) {

                    }
                });
//    $scope.categorias=cate.get();  
            }

            getSelectedComponentes = function (componentes) {

                var salida = {};
                salida.items = []
                salida.totalcom = 0;
                salida.totalqty;


                angular.forEach(componentes, function (componente) {
                    if (componente.selected) {
                        itemcom = {};
                        itemcom.componente = componente;
                        itemcom.qty = 1;
                        itemcom.id_comp = componente.com_id;
                        salida.items.push(itemcom);
                        salida.totalcom += parseFloat(componente.com_precio);
                        salida.totalqty += 1;
                    }
                })
                return salida;
            }
            loadUrlpro();
            loadProducto();
            loadComponentes();
            loadVariedades();


            // estaria bueno que los que tenga precio los amrque como extras y los que no como opciones

            //Check if user already logged in



            $scope.showProductInfo = function (id) {



            };

            $scope.addToCart = function () {


                $scope.componentesSelected = getSelectedComponentes($scope.componentes);
                item.producto = $scope.producto;
                item.variedad = $scope.selectedVariedad;
                item.componentes = $scope.componentesSelected.items;
                item.compAmount = $scope.componentesSelected.totalcom;
                item.comqty = $scope.componentesSelected.totalqty;
                var preciov = 0;

                if (item.variedad.var_precio)
                    preciov = (item.variedad.var_precio === "undefined") ? 0 : item.variedad.var_precio;

//     item.qty = 1;

                item.price = parseFloat(parseFloat(preciov) + parseFloat($scope.producto.prod_precioBase));
                item.precioVar = preciov;
                // revisar como se va a palntear variada si como lista de precios o adicionar al precio base
                $scope.data = {};
                $scope.data.cantidad = 1;

                var cantPopup = $ionicPopup.show({
                    template: '<input type="number" pattern="[0-9]*" step="1" style="padding-left: 10px;" ng-model="data.cantidad" class="ng-pristine ng-untouched ng-valid ng-not-empty ng-valid-pattern"> ' +
                            '<a class="button button-light" style="margin-top: 5px; width: 45%" ng-click="data.cantidad = data.cantidad > 2 ? data.cantidad - 1 : 1"> ' +
                            '<i class="icon ion-minus"></i></a> ' +
                            '<a class="button button-light" style="margin-top: 5px; width: 45%; float: right" ng-click="data.cantidad  = data.cantidad + 1"> ' +
                            '<i class="icon ion-plus"></i></a> ' +
                            '<textarea style="padding-left: 10px; margin-top: 5px;" ng-model="data.comentario" placeholder="Add your comments" class="ng-pristine ng-untouched ng-valid ng-empty"></textarea></div>',
                    title: '',
                    subTitle: '',
                    scope: $scope,
                    buttons: [
                        {text: 'Cancelar'},
                        {
                            text: '<b>Confirmar</b>',
                            type: 'button-positive',
                            onTap: function (e) {

                                if ($scope.cantidad < 1) {
                                    e.preventDefault(); //don't allow the user to close unless he enters full details
                                } else {
                                    return $scope.data;
                                }
                            }
                        }
                    ]
                });



                cantPopup.then(function (res) {
                    item.qty = parseInt(res.cantidad);
                    item.comentario = res.comentario;
                    cart.add(item);
//                    cartComponent.addAll(item.componentes.items); se comento por que por ahora no vamos a separa los comp de los productos
                    $rootScope.totalCart = sharedCartService.total_qty + sharedCartService.total_compqty;
//                    $ionicHistory.clearHistory();
                 
         
                    $ionicHistory.nextViewOptions({
                        historyRoot: true,
                        disableBack: true
                      
                    });


                    $state.go('app.menu', {}, {location: "replace"});

                });






//     cart.add(item);
//     
//     $rootScope.totalCart = sharedCartService.getQty();
//     
//     $state.go('categorias');

            };

            $scope.SelectedVariedadChange = function (variedad) {

                $scope.selectedVariedad = variedad;

            };




        })

        .controller('offersCtrl', function ($scope, $rootScope) {

            //We initialise it on all the Main Controllers because, $rootScope.extra has default value false
            // So if you happen to refresh the Offer page, you will get $rootScope.extra = false
            //We need $ionicSideMenuDelegate.canDragContent(true) only on the menu, ie after login page
            $rootScope.extras = true;
        })

        .controller('indexCtrl', function ($scope, $rootScope, sharedUtils, $ionicHistory, $state, $ionicSideMenuDelegate, sharedCartService, auth) {

            $rootScope.totalCart = sharedCartService.getQty();


            if (auth.hasToken()) {
                $scope.user_info = auth.getUserData();
                 $rootScope.extras = true;//Saves data to user_info

            } else {
                $ionicSideMenuDelegate.toggleLeft(); //To close the side bar
                $ionicSideMenuDelegate.canDragContent(false);  // To remove the sidemenu white space
                $ionicHistory.nextViewOptions({
                    historyRoot: true
                });
                $rootScope.extras = false;
                sharedUtils.hideLoading();
                $state.go('tabsController.login', {}, {location: "replace"});

            }

            $scope.logout = function () {

                sharedUtils.showLoading();
                auth.logout();
                $ionicSideMenuDelegate.toggleLeft(); //To close the side bar
                $ionicSideMenuDelegate.canDragContent(false);  // To remove the sidemenu white space

                $ionicHistory.nextViewOptions({
                    historyRoot: true
                });


                $rootScope.extras = false;
                sharedUtils.hideLoading();
                $state.go('tabsController.login', {}, {location: "replace"});




            }

        })

        .controller('myCartCtrl', function ($scope, $rootScope, $state, sharedCartService, auth, restApi) {

            if (auth.hasToken())
            
            {
              
                $scope.user_info = auth.getUserData();
                $scope.vacio = !(sharedCartService.total_qty > 0);
                //Saves data to user_info

            } else {
                $ionicSideMenuDelegate.toggleLeft(); //To close the side bar
                $ionicSideMenuDelegate.canDragContent(false);  // To remove the sidemenu white space
                $ionicHistory.nextViewOptions({
                    historyRoot: true
                });
                $rootScope.extras = false;
                sharedUtils.hideLoading();
                $state.go('tabsController.login', {}, {location: "replace"});
            }
            $rootScope.extras = true;
            $scope.subtotal = 0;
            $scope.total = $scope.subtotal + 10;
            $scope.urlpro = '';
            $scope.urlcom = '';
            loadUrlpro = function () {

                restApi.call({
                    method: 'get',
                    url: 'producto/url',
                    response: function (r) {

                        $scope.urlpro = decodeURIComponent(r);
                    },
                    error: function (r) {

                    },
                    validationError: function (r) {

                    }
                });
//    $scope.categorias=cate.get();  
            }
            calcularSubtotal = function () {

                var totalprod = sharedCartService.total_amount;
                var totalcom = sharedCartService.total_compAmount;
                $scope.subtotal = totalprod + totalcom;


            };
            loadUrlpro();
            calcularSubtotal();
            $scope.cart = sharedCartService.cart;
            $scope.cartComp = sharedCartService.cartComponent;
            /// Loads users cart


            $scope.removeFromCart = function (p_id) {
                $scope.cart.drop(p_id);
                calcularSubtotal();
                $rootScope.totalCart = sharedCartService.total_qty + sharedCartService.total_compqty;


            };

            $scope.inc = function (p_id) {
                $scope.cart.increment(p_id);
                calcularSubtotal();
                $rootScope.totalCart = sharedCartService.total_qty + sharedCartService.total_compqty;
            };

            $scope.dec = function (p_id) {//avisa
                $scope.cart.decrement(p_id);
                calcularSubtotal();
                $rootScope.totalCart = sharedCartService.total_qty + sharedCartService.total_compqty;
            };
            $scope.checkout = function () {
//                var data = {};
//                data.idCliente = 1;
//                sharedCartService.cargarComentarios();
//                sharedCartService.generarPedido(data);
//                sharedCartService.generarDetalle();


                $state.go('app.checkout', {}, {location: "replace"});
            };



        })


        .controller('lastOrdersCtrl', function ($scope, $rootScope, sharedUtils, auth) {


            $rootScope.extras = true;
            sharedUtils.showLoading();

            //Check if user already logged in

            if (auth.hasToken())
            {
                $scope.user_info = auth.getUserData();
                sharedUtils.hideLoading();//Saves data to user_info

            } else {
                $ionicSideMenuDelegate.toggleLeft(); //To close the side bar
                $ionicSideMenuDelegate.canDragContent(false);  // To remove the sidemenu white space
                $ionicHistory.nextViewOptions({
                    historyRoot: true
                });
                $rootScope.extras = false;
                sharedUtils.hideLoading();
                
                $state.go('tabsController.login', {}, {location: "replace"});

            }





        })

        .controller('favouriteCtrl', function ($scope, $rootScope) {

            $rootScope.extras = true;
        })



        .controller('settingsCtrl', function ($scope, $rootScope,
                $ionicPopup, $state, $window, sharedUtils, auth, restApi) {
            //Bugs are most prevailing here
            $rootScope.extras = true;
            $scope.usuario = {};
            $scope.addresses = [];


            //Shows loading bar
//            sharedUtils.showLoading();




            datosUsuario = function () {

                $scope.usuario.id = auth.getUserData().id;
                $scope.usuario.nombre = auth.getUserData().nombre;
                $scope.usuario.celular = auth.getUserData().Celular;
                $scope.usuario.email = auth.getUserData().email;
                //You have to create a local variable for storing emails
                $scope.data_editable = {};
                $scope.data_editable.email = $scope.usuario.email;  // For editing store it in local variable
                $scope.data_editable.password = "";

            }
            getDirecciones = function (id) {

                restApi.call({
                    method: 'get',
                    url: 'persona/listardir/' + id,
                    response: function (r) {

                        $scope.addresses = r;
                    },
                    error: function (r) {

                    },
                    validationError: function (r) {

                    }
                });


            }


            if (auth.hasToken())

            {
                $scope.user_info = auth.getUserData();
                datosUsuario();
                getDirecciones($scope.usuario.id);
//                sharedUtils.hideLoading();//Saves data to user_info

            } else {
                $ionicSideMenuDelegate.toggleLeft(); //To close the side bar
                $ionicSideMenuDelegate.canDragContent(false);  // To remove the sidemenu white space
                $ionicHistory.nextViewOptions({
                    historyRoot: true
                });
                $rootScope.extras = false;
                sharedUtils.hideLoading();
                $state.go('tabsController.login', {}, {location: "replace"});

            }

            $scope.addManipulation = function (edit_val) {  // Takes care of address add and edit ie Address Manipulator


                if (edit_val != null) {

                    $scope.data = edit_val; // For editing address 
                    // poner al telefono como un numero.
                    var title = "Editar Direccion";
                    var sub_title = "Editar su Domicilio";
                } else {
                    $scope.data = {};    // For adding new address
                    var title = "Agregar Domicilio";
                    var sub_title = "Agregar un nuevo Domicilio";
                }
                // An elaborate, custom popup
                var addressPopup = $ionicPopup.show({
                    template: '<input type="text"   placeholder="Nombre Lugar"  ng-model="data.dir_nombre"> <br/> ' +
                            '<input type="text"   placeholder="Direccion" ng-model="data.dir_direccion"> <br/> ' +
//                             '<input type="number" placeholder="Cod. Area" ng-model="data.pin"> <br/> ' +
                            '<input type="number" placeholder="Telefono Fijo" ng-model="data.dir_telefonoFijo">',
                    title: title,
                    subTitle: sub_title,
                    scope: $scope,
                    buttons: [
                        {text: 'Close'},
                        {
                            text: '<b>Save</b>',
                            type: 'button-positive',
                            onTap: function (e) {

                                if (!$scope.data.dir_nombre || !$scope.data.dir_direccion || !$scope.data.dir_telefonoFijo) {
                                    e.preventDefault(); //don't allow the user to close unless he enters full details
                                } else {
                                    return $scope.data;
                                }
                            }
                        }
                    ]
                });

                addressPopup.then(function (res) {


                    var direccion = {};

                    if (edit_val != null)

                    {
                        //Update  address
                        if (res != null)
                        {

                            direccion.dir_nombre = res.dir_nombre;
                            direccion.dir_telefonoFijo = res.dir_direccion;
                            direccion.dir_direccion = res.dir_telefonoFijo;
                            restApi.call(
                                    {
                                        method: 'put',
                                        url: 'direccion/actualizar',
                                        data: direccion,
                                        response: function (r) {
                                            if (r.response) {
                                                $window.location.reload(true);
                                            }


                                        },
                                        error: function (r) {

                                        },
                                        validationError: function (r) {

                                        }
                                    });

                            // res ==null  => close 
                            //editar una direccion del cliente

                        }
                    } else {

                        if (res != null) {

                            direccion.dir_nombre = res.dir_nombre;
                            direccion.dir_telefonoFijo = res.dir_direccion;
                            direccion.dir_direccion = res.dir_telefonoFijo;
                            direccion.dir_idPersona = $scope.usuario.id;

                            restApi.call({
                                method: 'post',
                                url: 'direccion/insertar',
                                data: direccion,
                                response: function (r) {

                                    if (r.response) {
                                        $window.location.reload(true);
                                    }


                                },
                                error: function (r) {

                                },
                                validationError: function (r) {

                                }
                            });


                            // res ==null  => close 
                            //editar una direccion del cliente

                        }
                        //Add new address

                        //agregar nueva direccion al cliente

                    }

                });

            };

            // A confirm dialog for deleting address
            $scope.deleteAddress = function (del_id) {
                var confirmPopup = $ionicPopup.confirm({
                    title: 'Eliminar Domicilio',
                    template: 'Are you sure you want to delete this address',
                    buttons: [
                        {text: 'No', type: 'button-stable'},
                        {text: 'Si', type: 'button-assertive', onTap: function () {
                                return del_id;
                            }}
                    ]
                });

                confirmPopup.then(function (res) {
                    if (res) {

                        restApi.call({
                            method: 'delete',
                            url: 'direccion/eliminar/' + res,

                            response: function (r) {

                                if (r.response) {

                                    $window.location.reload(true);
                                }


                            },
                            error: function (r) {

                            },
                            validationError: function (r) {

                            }
                        });


                        //eliminar direccion de la base

                    }
                });
            };

            $scope.save = function (extras, editable) {
                //1. Edit Telephone doesnt show popup 2. Using extras and editable  // Bugs
                if (extras.telephone != "" && extras.telephone != null) {
                    //Update  Telephone

                }

                //Edit Password
                if (editable.password != "" && editable.password != null) {
                    //Update Password in UserAuthentication Table

                }

                //Edit Email
                if (editable.email != "" && editable.email != null && editable.email != $scope.user_info.email) {

                    //Update Email/Username in UserAuthentication Table

                }

            };

            $scope.cancel = function () {
                // Simple Reload
                $window.location.reload(true);
                console.log("CANCEL");
            }

        })

        .controller('supportCtrl', function ($scope, $rootScope) {

            $rootScope.extras = true;

        })

        .controller('forgotPasswordCtrl', function ($scope, $rootScope) {
            $rootScope.extras = false;
        })

        .controller('checkoutCtrl', function ($scope, $rootScope, sharedUtils, $state,
                $ionicHistory, $ionicPopup, auth, restApi, sharedCartService) {

            $rootScope.extras = true;
            $scope.usuario = {};
            $scope.addresses = [];

            datosUsuario = function () {

                $scope.usuario.id = auth.getUserData().id;
                $scope.usuario.nombre = auth.getUserData().nombre;
                $scope.usuario.celular = auth.getUserData().Celular;
                $scope.usuario.email = auth.getUserData().email;



            }
            getDirecciones = function (id) {

                restApi.call({
                    method: 'get',
                    url: 'persona/listardir/' + id,
                    response: function (r) {

                        $scope.addresses = r;
                    },
                    error: function (r) {

                    },
                    validationError: function (r) {

                    }
                });


            }


            if (auth.hasToken())

            {
                $scope.user_info = auth.getUserData();
                datosUsuario();
                getDirecciones($scope.usuario.id);
//                sharedUtils.hideLoading();//Saves data to user_info

            } else {
                $ionicSideMenuDelegate.toggleLeft(); //To close the side bar
                $ionicSideMenuDelegate.canDragContent(false);  // To remove the sidemenu white space
                $ionicHistory.nextViewOptions({
                    historyRoot: true
                });
                $rootScope.extras = false;
                sharedUtils.hideLoading();
                $state.go('tabsController.login', {}, {location: "replace"});

            }

            $scope.loggedin = function () {
                return false;
            };

            //Check if user already logged in


            $scope.payments = [
                {id: 'CREDIT', name: 'Tarjeta Debito'},
                {id: 'COD', name: 'Efectivo '}
            ];

            $scope.pay = function (address, payment) {

                if (address == null || payment == null)
                {
                    //Check if the checkboxes are selected ?
                    sharedUtils.showAlert("Error", "Eliga una Direccion y un Modo de Pago.")
                } else
                {


                    var data = {};
                    data.idCliente = $scope.usuario.id;
                    data.tel = $scope.usuario.celular;
                    data.idDireccion = address;
                    data.medioPago = payment;
                    sharedCartService.cargarComentarios();
                    sharedCartService.generarPedido(data);
                    sharedCartService.generarDetalle();
                    sharedCartService.vaciarCarro();
                    $rootScope.totalCart = 0;

                    //preguntar como ahcer las llamadas asincronicas
//                  sharedUtils.showAlert("Info", "El Pedido se realizo con Exito");
                    $state.go('app.lastOrders', {}, {location: "replace", reload: true});


                    //                    // Go to past order page
//                    $ionicHistory.nextViewOptions({
//                        historyRoot: true
//                    });
//                    
                    //cargar item al carrito

//
//                    //Remove users cart

                }
            }

            $scope.addManipulation = function (edit_val) {  // Takes care of address add and edit ie Address Manipulator


                if (edit_val != null) {

                    $scope.data = edit_val; // For editing address 
                    // poner al telefono como un numero.
                    var title = "Editar Direccion";
                    var sub_title = "Editar su Domicilio";
                } else {
                    $scope.data = {};    // For adding new address
                    var title = "Agregar Domicilio";
                    var sub_title = "Agregar un nuevo Domicilio";
                }
                // An elaborate, custom popup
                var addressPopup = $ionicPopup.show({
                    template: '<input type="text"   placeholder="Nombre Lugar"  ng-model="data.dir_nombre"> <br/> ' +
                            '<input type="text"   placeholder="Direccion" ng-model="data.dir_direccion"> <br/> ' +
//                             '<input type="number" placeholder="Cod. Area" ng-model="data.pin"> <br/> ' +
                            '<input type="number" placeholder="Telefono Fijo" ng-model="data.dir_telefonoFijo">',
                    title: title,
                    subTitle: sub_title,
                    scope: $scope,
                    buttons: [
                        {text: 'Close'},
                        {
                            text: '<b>Save</b>',
                            type: 'button-positive',
                            onTap: function (e) {

                                if (!$scope.data.dir_nombre || !$scope.data.dir_direccion || !$scope.data.dir_telefonoFijo) {
                                    e.preventDefault(); //don't allow the user to close unless he enters full details
                                } else {
                                    return $scope.data;
                                }
                            }
                        }
                    ]
                });

                addressPopup.then(function (res) {


                    var direccion = {};

                    if (edit_val != null)

                    {
                        //Update  address
                        if (res != null)
                        {

                            direccion.dir_nombre = res.dir_nombre;
                            direccion.dir_telefonoFijo = res.dir_direccion;
                            direccion.dir_direccion = res.dir_telefonoFijo;
                            restApi.call(
                                    {
                                        method: 'put',
                                        url: 'direccion/actualizar',
                                        data: direccion,
                                        response: function (r) {
                                            if (r.response) {
                                                $window.location.reload(true);
                                            }


                                        },
                                        error: function (r) {

                                        },
                                        validationError: function (r) {

                                        }
                                    });

                            // res ==null  => close 
                            //editar una direccion del cliente

                        }
                    } else {

                        if (res != null) {

                            direccion.dir_nombre = res.dir_nombre;
                            direccion.dir_telefonoFijo = res.dir_direccion;
                            direccion.dir_direccion = res.dir_telefonoFijo;
                            direccion.dir_idPersona = $scope.usuario.id;

                            restApi.call({
                                method: 'post',
                                url: 'direccion/insertar',
                                data: direccion,
                                response: function (r) {

                                    if (r.response) {
                                        $window.location.reload(true);
                                    }


                                },
                                error: function (r) {

                                },
                                validationError: function (r) {

                                }
                            });


                            // res ==null  => close 
                            //editar una direccion del cliente

                        }
                        //Add new address

                        //agregar nueva direccion al cliente

                    }

                });

            };

//         

        })



