# GriotWP

GriotWP provides a simple and extensible back end for the Minneapolis Institute of Arts' open-source iPad presentation software, [Griot](https://github.com/artsmia/griot).

## Description

GriotWP is a free WordPress plugin that enables any user to load content into the Griot application.

Specifically, GriotWP creates:

*   Two new post types, Objects and Stories.
*   A user-friendly, code-free interface for entering content and setting up relationships.
*   Semantic XHTML templates for extending the editing environment.
*   Endpoints for exposing loaded data in JSON format.

## Installation

If you're not familiar with WordPress, read the [Getting Started documentation.](http://codex.wordpress.org/Getting_Started_with_WordPress)

Install GriotWP as you would any other WordPress plugin. GriotWP can be installed in a fresh installation or on top of an existing WordPress site.

1. Upload the griotwp folder to your WordPress plugins directory (/wp-content/plugins/).
2. Log in to WordPress and activate GriotWP in the Plugins menu.
3. Navigate to Settings > GriotWP and configure your settings.

### Settings

#### Tile Server

The **tile server** is a URL the system can query for [TileJSON](https://github.com/mapbox/tilejson-spec) objects describing the set of tiles for a given image. 

#### Config

The **config** settings represents the location of your config (or 'manifest'), a JSON object linking objects IDs to zoomable images. When not in development, this will probably be the same URL as your tile server, because the tileserver software generates a config automatically. GriotWP uses this information to populate and filter user-facing lists of available objects and zoomable images.

#### Image Source

Static (i.e. non-zoomable) images are currently used for the thumbnails of objects and stories on the front page of the Griot software. This may change in the near future. In the meantime ...

**Image source** tells the system where to look for static images.

If "Insert images from WordPress" is selected, GriotWP will use the standard WordPress Media Manager for uploading and selecting images. In this case, the data object returned by GriotWP will reference the image's location within the WordPress wp-content folder. Note that pulling images from WordPress may have repercussions for performance!

"Add a list of available image URLs" allows the administrator to paste in a list of URLs referring to available static images. These images will be presented to the user as thumbnails when the image field is used.

## Endpoints

Adding /griot/ to the end of your WordPress site URL will return a JSON object encompassing all published objects and stories:

`http://www.example.com/griot/`

This is the object that will be ingested to populate the Griot application. 

Although not required in the default configuration, you can also get JSON for objects or stories only: 

`http://www.example.com/griot/objects/`

Or for a specific record by WordPress ID:

`http://www.example.com/griot/objects/370`

## Extending GriotWP

GriotWP's edit screens are modular to facilitate both small tweaks and major customizations of the application. Form templates (griotwp/templates/) are built from semantic custom tags which can be rearranged, combined with standard HTML, and nested. The system will interpret the nesting of field tags to structure the returned data.

### Repeaters

The `<repeater>` tag allows the user to arbitrarily duplicate the set of fields nested beneath it. 

#### Repeater Attributes

**name** _Required_ The unique key that will refer to the array of repeater items in the data object.

**label** _Optional_ The user-facing label for the repeater.

**label-singular** _Optional_ The user-facing singular label for a single repeater item.

**label-plural** _Optional_ The user-facing plural label for multiple repeater items. 

### Switches (Dynamic Layouts)

`<switch>` and `<switchgroup>` allow the user to create dynamic content layouts. `<switch>` will render a dropdown which the author can use to select which `<switchgroup>` to use as a layout. 

NOTE: Fields in different groups but with the same name refer to the same property in the data object. This makes it easier to flip between groups without needing to retype content.

#### Switch Attributes

**name** _Required_ The unique key that will refer to the selected layout in the data object.

**label** _Optional_ The user-facing label for the layout dropdown.

**default** _Optional_ The type of layout that will load up with the control. 

#### Switchgroup Attributes

**type** _Required_ The unique key for the layout represented by the group.

**label** _Required_ The user-facing (via the `<switch>` dropdown) label for the group.

### Fields

The `<field>` tag renders a field of a given type, along with related UI elements. 

#### Field Attributes

**type** _Required_ The type of field.

**name** _Required_ The unique key that will refer to the field's value in the data object.

**label** _Optional_ The user-facing label for the field.

**protected** _Optional_ Forces the user to unlock the field before editing to prevent accidental changes.

#### Included Field Types

_image_

A static image.

_objectselector_

Formerly a dropdown of available object IDs, the object selector now allows the user to link an object record to an object in the config by dragging a thumbnail over from the media drawer. The object selector field also displays some object metadata included in the config to ensure the correct object is selected.

_relationship_

Multi-select field of currently published stories, used for creating links from one object to many stories.

_text_

Simple text field.

_textarea_

Simple textarea field.

_wysiwyg_

Stripped-down CKEditor text editor.

_zoomer_

An image zoomer with optional annotations. To enable the annotations repeater, simply nest additional fields within the zoomer. 

#### Additional Zoomer Field Attributes

Zoomer fields have some special attributes:

**annotations-name** _Required for annotations_ The unique key that will refer to the array of annotations in the data object.

**annotations-label** _Optional_ The user-facing label for the annotations.

**annotations-label-singular** _Optional_ The user-facing singular label for a single annotation.

**annotations-label-plural** _Optional_ The user-facing plural label for multiple annotations.

### License (MIT)

Copyright (c) 2014 Minneapolis Institute of Arts

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
