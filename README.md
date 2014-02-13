# GriotWP

GriotWP provides a simple and extensible back end for the Minneapolis Institute of Arts' open-source iPad presentation software, Griot.

## Description

### About Griot for iPad

Griot is an open-source iPad application that facilitates engagement with a collection of **objects** (artifacts, artwork, graphs, or anything else that can be represented visually) through **annotations** (points of interest on the object itself) and **stories** (related text-based and multimedia content, presented as a series of pages).

The Griot framework requires three components:

1. The Griot software itself;
2. A server for creating and serving tiled images; and
3. An interface (such as GriotWP) for loading content and bundling it in JSON format.

### About GriotWP

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
3. Navigate to Settings > GriotWP and configure your **image settings.**

### Image Settings

#### TileJSON Base URL

In order to use annotated images, you must define a **base URL** the system can query for a [TileJSON](https://github.com/mapbox/tilejson-spec) object describing the set of tiles for that image. The system expects to be able to retrieve your TileJSON object at **base_url/id.tif**, where **id** is the image ID entered on an given edit screen to specify an image to annotate.

#### Image Source

You can also attach regular static images to your content. By default, the system will use the WordPress Media Manager to upload and select images. However, this means that the Griot application will request those images from WordPress, which may have consequences for performance. As an alternative, you can enter a list of external image URLs which the system will load and make available to the author.

## Endpoints

Adding /griot/ to the end of your WordPress root URL will return a JSON object encompassing all published objects and stories:

`http://www.example.com/griot/`

This is the object Griot will ingest to populate the application. You can also get JSON for objects or stories only: 

`http://www.example.com/griot/objects/`

Or for a specific record by WordPress ID:

`http://www.example.com/griot/objects/370`

## Extending GriotWP

GriotWP's edit screens are modular to facilitate both small tweaks and major customizations of the application. Form templates (griotwp/templates/) are built from semantic custom tags which can be rearranged, recombined, and nested while maintaining the integrity of the returned data.

### `<field>`

The `<field>` tag renders a field of various types, along with related UI elements. 

#### Attributes

**type** _Required_ The type of field. One of: 'text', 'textarea', 'wysiwyg', 'image', or 'custom'.

**name** _Required_ The unique key that will refer to the field's value in the data object.

**label** _Optional_ The user-facing label for the field.

**protected** _Optional_ Add an extra step to unlock the field before editing.

### `<annotatedimage>`

The `<annotatedimage>` tag renders a zoomable, annotatable image. Fields and control elements nested beneath the `<annotatedimage>` tag will appear in a special annotations repeater beneath the image. 

#### Attributes

**name** _Required_ The unique key that will refer to the user-entered image ID in the data object. (Note: the annotations repeater always has the name 'annotations'.)

**label** _Optional_ The user-facing label for the image.

### `<repeater>`

The `<repeater>` tag allows the author to arbitrarily duplicate the set of fields nested beneath it. 

#### Attributes

**name** _Required_ The unique key that will refer to the array of repeater items in the data object.

**label** _Optional_ The user-facing label for the repeater.

**label-singular** _Optional_ The user-facing singular label for a single repeater item.

**label-plural** _Optional_ The user-facing plural label for multiple repeater items. 

### `<switch>` and `<switchgroup>`

`<switch>` and `<switchgroup>` allow the user to create dynamic content layouts. `<switch>` will render a dropdown which the author can use to select which `<switchgroup>` to use as a layout. Fields in different groups with the same name refer to the same property in the data object.

#### Switch Attributes

**name** _Required_ The unique key that will refer to the selected layout in the data object.

**label** _Optional_ The user-facing label preceding the layout dropdown.

**default** _Optional_ The type of layout that will load up with the control. 

#### Switchgroup Attributes

**type** _Required_ The unique key for the layout represented by the group.

**label** _Required_ The user-facing (via the `<switch>` dropdown) label for the group.

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