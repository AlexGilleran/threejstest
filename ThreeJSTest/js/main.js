var environment = new Environment();

$(document).ready(function() {
	
	$("#container")
	.mousedown(function(downEvent) {
		downEvent.preventDefault();
		downEvent.stopPropagation();
		
		var oldPageY = downEvent.pageY;
		var oldPageX = downEvent.pageX;
		
		$(window).mousemove(function(moveEvent) {	        
			switch (downEvent.which) {
				case 1: 
					environment.camera.position.z -= (oldPageY - moveEvent.pageY);
					environment.camera.position.x += (oldPageX - moveEvent.pageX);
					break;
				case 3:
					break;
			}
			
			oldPageY = moveEvent.pageY;
			oldPageX = moveEvent.pageX;
		});
		$(window).mouseup(function() {
			$(window).unbind("mousemove");
		});
	})

	beginStats();
	render();
})

var stats;

//draw!
function render() {
	requestAnimationFrame(render);
	
	environment.renderer.render(environment.scene, environment.camera);
	
	stats.update();
}

function beginStats() {
	stats = new Stats();

	stats.setMode(0); // 0: fps, 1: ms
	
	// Align top-left
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.left = '0px';
	stats.domElement.style.top = '0px';
	
	document.body.appendChild( stats.domElement );
	
};

function Environment() {
	// set the scene size
	var WIDTH = 400,
	    HEIGHT = 300;
	
	// set some camera attributes
	var VIEW_ANGLE = 45,
	    ASPECT = WIDTH / HEIGHT,
	    NEAR = 0.1,
	    FAR = 10000;
	
	// get the DOM element to attach to
	// - assume we've got jQuery to hand
	var $container = $('#container');
	
	// create a WebGL renderer, camera
	// and a scene
	this.renderer = new THREE.WebGLRenderer();
	this.camera = new THREE.PerspectiveCamera(  VIEW_ANGLE,
	                                ASPECT,
	                                NEAR,
	                                FAR  );
	this.scene = new THREE.Scene();
	
	// the camera starts at 0,0,0 so pull it back
	this.camera.position.z = 300;
	
	// start the renderer
	this.renderer.setSize(WIDTH, HEIGHT);
	
	// attach the render-supplied DOM element
	$container.append(this.renderer.domElement);
	
	// create the sphere's material
	var sphereMaterial = new THREE.MeshLambertMaterial(
	{
	    color: 0xCC0000
	});
	
	// set up the sphere vars
	var radius = 50, segments = 16, rings = 16;
	
	// create a new mesh with sphere geometry -
	// we will cover the sphereMaterial next!
	var sphere = new THREE.Mesh(
	   new THREE.SphereGeometry(radius, segments, rings),
	   sphereMaterial);
	
	// add the sphere to the scene
	this.scene.add(sphere);
	
	// and the camera
	this.scene.add(this.camera);
	
	// create a point light
	var pointLight = new THREE.PointLight( 0xFFFFFF );
	
	// set its position
	pointLight.position.x = 10;
	pointLight.position.y = 50;
	pointLight.position.z = 130;
	
	// add to the scene
	this.scene.add(pointLight);
	
	var urlPrefix = "img/skybox/";

	var materialArray = [];
	materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture(urlPrefix + "right62.jpg") }));
	materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture(urlPrefix + "left62.jpg") }));
	materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture(urlPrefix + "top62.jpg") }));
	materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture(urlPrefix + "top62.jpg") }));
	materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture(urlPrefix + "front62.jpg") }));
	materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture(urlPrefix + "back62.jpg") })); 
	var skyBoxMaterial = new THREE.MeshFaceMaterial(materialArray);

	skyBoxMaterial.materials.forEach(function(faceMaterial)  {
		faceMaterial.side = THREE.BackSide;
	});
	
	var skyboxGeom = new THREE.CubeGeometry( 5000, 5000, 5000, 1, 1, 1);
	var skybox = new THREE.Mesh( skyboxGeom,  skyBoxMaterial);
	this.scene.add( skybox ); 
}

