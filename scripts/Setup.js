'use strict';

// Example script by Kirby@TankAndDozer.com
// 
// https://github.com/TankAndDozer/AmazonSumerian-multiple-scenes
//
// 20190407 - 0.1 First release

// The sumerian object can be used to access Sumerian engine
// types.
//
/* global sumerian */

// Called when play mode starts.
//
function setup(args, ctx) {

	// set world context for debug
	ctx.worldData.debug = args.debug;

	// set world context for the parent entiry of each scene in the project
	ctx.worldData.scenes = [args.scene1, args.scene2, args.scene3];
	ctx.worldData.scenes.forEach(function (scene) {
		scene.hide();
	});

	// perform any other one time setup tasks here
	// e.g. Load stateful information from a database, check browser cookies, etc.	

	// Show the currentScene
	ctx.worldData.currentScene = 0;
	ctx.worldData.scenes[ctx.worldData.currentScene].show();

	// add listener for showNextScene
	sumerian.SystemBus.addListener('showNextScene', ctx.busListener = function (data) {

		if (args.debug === true) {
			console.group();
			console.log('showNextScene');
		}

		// Make sure that the current scene is hidden
		ctx.worldData.scenes[ctx.worldData.currentScene].hide();

		// Increment the currentScene value
		ctx.worldData.currentScene++;

		// Test if currentScene is valid
		if (ctx.worldData.currentScene === ctx.worldData.scenes.length) {
			console.loog('no more scenes!');
		} else {
			// Show the new currentScene
			// NOTE: This could also could be done by the listener for this scene
			ctx.worldData.scenes[ctx.worldData.currentScene].show();

			// Emit startSceneN, where N is the scene number
			// NOTE: This saves a bit of logic on the scene behavior listening for startSceneN
			let channel = 'startScene' + (ctx.worldData.currentScene + 1);

			if (args.debug === true) {
				console.log('emit(' + channel + ')');
				console.groupEnd();
			}

			sumerian.SystemBus.emit(channel);
		}
	}, true);

}

// Called when play mode stops.
//
function cleanup(args, ctx) {
	sumerian.SystemBus.removeListener('showNextScene', ctx.busListener);
}

// Defines script parameters.
//
var parameters = [
	{ type: 'boolean', key: 'debug', 'default': true, description: 'Debug' },
	{ type: 'entity', key: 'scene1', description: 'Scene 1' },
	{ type: 'entity', key: 'scene2', description: 'Scene 2' },
	{ type: 'entity', key: 'scene3', description: 'Scene 3' },
];