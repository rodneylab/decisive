const { JSDOM } = require('jsdom');
const { tick } = require('svelte');

const { window } = new JSDOM('');

function setup() {
	// @ts-ignore
	global.window = window;
	global.document = window.document;
	global.navigator = window.navigator;
	global.getComputedStyle = window.getComputedStyle;
	global.requestAnimationFrame = null;
}

function reset() {
	window.document.title = '';
	window.document.head.innerHTML = '';
	window.document.body.innerHTML = '';
}

/**
 * @typedef RenderOutput
 * @property container {HTMLElement}
 * @property component {import('svelte').SvelteComponent}
 */

/**
 * @return {RenderOutput}
 */
function render(Tag, props = {}) {
	Tag = Tag.default || Tag;
	const container = window.document.body;
	const component = new Tag({ props, target: container });
	return { container, component };
}

/**
 * @param {HTMLElement} elem
 * @param {String} event
 * @param {any} [details]
 * @returns Promise<void>
 */
function fire(elem, event, details) {
	let evt = new window.Event(event, details);
	elem.dispatchEvent(evt);
	return tick();
}

module.exports = { setup, reset, render, fire };
