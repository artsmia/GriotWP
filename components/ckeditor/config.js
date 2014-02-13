/**
 * @license Copyright (c) 2003-2014, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

CKEDITOR.editorConfig = function( config ) {
	// Define changes to default configuration here.
	// For the complete reference:
	// http://docs.ckeditor.com/#!/api/CKEDITOR.config

	// The toolbar groups arrangement, optimized for a single toolbar row.
	config.toolbarGroups = [
		{ name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ] },
		{ name: 'list', groups: [ 'list', 'indent'] },
		{ name: 'insert' },
		{ name: 'clipboard' },
		{ name: 'undo' },
		{ name: 'document',	   groups: [ 'mode', 'document', 'doctools' ] },
		{ name: 'editing',     groups: [ 'find', 'selection', 'spellchecker' ] },
		{ name: 'forms' },
		{ name: 'paragraph',   groups: [ 'blocks', 'align', 'bidi' ] },
		{ name: 'links' },
		{ name: 'styles' },
		{ name: 'colors' },
		{ name: 'tools' },
		{ name: 'others' },
		{ name: 'about' }
	];

	// The default plugins included in the basic setup define some buttons that
	// we don't want too have in a basic editor. We remove them here.
	config.removeButtons = 'Cut,Copy,Paste,Anchor,Underline,Strike';

	// Let's have it basic on dialogs as well.
	config.removeDialogTabs = 'link:advanced';
};
