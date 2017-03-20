angular.module('app.routes', [])

        .config(function ($stateProvider, $urlRouterProvider) {

            // Ionic uses AngularUI Router which uses the concept of states
            // Learn more here: https://github.com/angular-ui/ui-router
            // Set up the various states which the app can be in.
            // Each state's controller can be found in controllers.js


            $stateProvider

                    .state('tabsController', {
                        url: '/tabs',
                        templateUrl: 'templates/tabsController.html',
                        abstract: true
                    })
                    .state('tabsController.login', {
                        url: '/login',
                        views: {
                            'tab1': {
                                templateUrl: 'templates/login.html',
                                controller: 'loginCtrl'
                            }
                        }
                    })
                    .state('tabsController.signup', {
                        url: '/singnup',
                        views: {
                            'tab3': {
                                templateUrl: 'templates/signup.html',
                                controller: 'signupCtrl'
                            }
                        }
                    })
                    .state('tabsController.forgotPassword', {
                        url: '/forgot',
                        views: {
                            'tab1': {
                                templateUrl: 'templates/forgotPassword.html',
                                controller: 'forgotPasswordCtrl'

                            }
                        }
                    })



                    .state('app', {
                        url: '/app',
                        abstract: true,
                        templateUrl: 'templates/sidemenu.html',
                        controller: 'indexCtrl'
                    })
                    .state('app.menu', {
                        url: '/menu',
                        views: {
                            'menuContent': {
                                templateUrl: 'templates/menu2.html',
                                controller: 'menu2Ctrl'
                            }
                        }
                    })
                    .state('app.categories', {
                        url: '/cat',
                        views: {
                            'menuContent': {
                                templateUrl: 'templates/categories.html',
                                controller: 'categoriasCtrl'
                            }
                        }
                    })
                    .state('app.menucat', {
                        url: '/menucat/:id',
                        views: {
                            'menuContent': {
                                templateUrl: 'templates/menucat.html',
                                params: {'nombre': null},
                                controller: 'menucatCtrl'
                            }
                        }
                    })
                    .state('app.productodet', {
                        url: '/prodet/:id',
                        views: {
                            'menuContent': {
                                templateUrl: 'templates/productodetalle.html',
                                controller: 'productodetCtrl'
                            }
                        }
                    })
                    .state('app.shopingcart', {
                        url: '/shopingcart',
                        views: {
                            'menuContent': {
                                templateUrl: 'templates/shopping_cart.html',
                                controller: 'myCartCtrl'
                            }
                        }
                    })
                
                    .state('app.lastOrders', {
                        url: '/lastorder',
                        views: {
                            'menuContent': {
                                templateUrl: 'templates/lastOrders.html',
                                controller: 'lastOrdersCtrl'
                            }
                        }
                    })
                    .state('app.settings', {
                        url: '/settings',
                        views: {
                            'menuContent': {
                                templateUrl: 'templates/settings.html',
                                controller: 'settingsCtrl'
                            }
                        }
                    })
                    .state('app.support', {
                        url: '/support',
                        views: {
                            'menuContent': {
                                templateUrl: 'templates/support.html',
                                controller: 'supportCtrl'
                            }
                        }
                    })
                    .state('app.checkout', {
                        url: '/checkout',
                        views: {
                            'menuContent': {
                                templateUrl: 'templates/checkout.html',
                                controller: 'checkoutCtrl'
                            }
                        }
                    })








            $urlRouterProvider.otherwise('/app/menu')

//            $stateProvider
//
//
//
//                    .state('tabsController', {
//                        url: '/page1',
//                        templateUrl: 'templates/tabsController.html',
//                        abstract: true
//                    })
//                    .state('tabsController.login', {
//                        url: '/page5',
//                        views: {
//                            'tab1': {
//                                templateUrl: 'templates/login.html',
//                                controller: 'loginCtrl'
//                            }
//                        }
//                    })
//                    .state('tabsController.signup', {
//                        url: '/page6',
//                        views: {
//                            'tab3': {
//                                templateUrl: 'templates/signup.html',
//                                controller: 'signupCtrl'
//                            }
//                        }
//                    })                    
//                    .state('menu2', {
//                        url: '/page7',
//                        templateUrl: 'templates/menu2.html',
//                        controller: 'menu2Ctrl'
//                    })
//                    .state('categorias', {
//                        url: '/page16',
//                        templateUrl: 'templates/categories.html',
//                        controller: 'categoriasCtrl'
//                    })
//
//                    .state('menucat', {
//                        url: '/page17/:id',
//                        templateUrl: 'templates/menucat.html',
//                        params: {'nombre': null},
//                        controller: 'menucatCtrl'
//                    })
//
//                    .state('productodet', {
//                        url: '/page18/:id',
//                        templateUrl: 'templates/productodetalle.html',
//                        controller: 'productodetCtrl'
//                    })
//
//                    .state('shopingcart', {
//                        url: '/page19',
//                        templateUrl: 'templates/shopping_cart.html',
//                        controller: 'myCartCtrl'
//                    })
//
//                    .state('offers', {
//                        url: '/page8',
//                        templateUrl: 'templates/offers.html',
//                        controller: 'offersCtrl'
//                    })
//
////                    .state('myCart', {
////                        url: '/page9',
////                        templateUrl: 'templates/myCart.html',
////                        controller: 'myCartCtrl'
////                    })
//
//                    .state('lastOrders', {
//                        url: '/page10',
//                        templateUrl: 'templates/lastOrders.html',
//                        controller: 'lastOrdersCtrl'
//                    })
//
//                    .state('favourite', {
//                        url: '/page11',
//                        templateUrl: 'templates/favourite.html',
//                        controller: 'favouriteCtrl'
//                    })
//
//                    .state('settings', {
//                        url: '/page12',
//                        templateUrl: 'templates/settings.html',
//                        controller: 'settingsCtrl'
//                    })
//
//                    .state('support', {
//                        url: '/page13',
//                        templateUrl: 'templates/support.html',
//                        controller: 'supportCtrl'
//                    })
//
//                    .state('checkout', {
//                        url: '/page16',
//                        templateUrl: 'templates/checkout.html',
//                        controller: 'checkoutCtrl'
//                    })
//
//                    .state('tabsController.forgotPassword', {
//                        url: '/page15',
//                        views: {
//                            'tab1': {
//                                templateUrl: 'templates/forgotPassword.html',
//                                controller: 'forgotPasswordCtrl'
//                            }
//                        }
//                    })
//
//            $urlRouterProvider.otherwise('/page7')

        });
