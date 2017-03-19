angular.module('app.directives', [])





/*
 .directive('ionProductImage', function($timeout, $ionicModal, $ionicSlideBoxDelegate) {
 var link = function(scope, element, attr) {
 scope.closeModal = function() {
 scope.modal.hide();
 scope.modal.remove();
 };
 element.on('click', function(){
 $ionicModal.fromTemplateUrl('templates/partials/cart-image-modal.html', {
 animation: 'slide-left-right',
 scope: scope
 })
 .then(function(modal){
 scope.modal = modal;
 scope.modal.show();
 $timeout( function() {
 $ionicSlideBoxDelegate.update();
 });
 });
 });
 };
 return {
 restrict: 'A',
 link: link,
 scope: '='
 };
 })
 */


