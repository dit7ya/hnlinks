<h1 align="center">
<br>
hnlinks
<br>
</h1>

A Firefox extension that adds a sidebar to comment threads on news.ycombinator.com which collects all the external links from comments and allows you to quickly jump to the context from a link.


<br>
<br>

![img](./assets/screencap.gif)


<br>
<br>
<h1 align="center"> Installation </h1>

This is a Firefox extension that could be loaded locally into your browser. The extension files are located inside the `src` folder. Or you could install the extension from Extensions of Firefox using this [link](https://addons.mozilla.org/en-US/firefox/addon/hnlinks/).

Follow the steps below  for local Installation:

* Clone the repository locally into your computer
* Open your Firefox browser and 
    * type `about:debugging` in the Firefox URL bar
    * *Or* go to `Tools > Web Developer` menu, click `Remote Debugging`
    * *Note*: Make sure you use the latest Firefox to avoid any compatibility and security related issues.
* The previous step would take you to Firefox's debugging page. On the left hand side menu, click on `This Firefox` and it would load a `Temporary Extensions` section.
* Click on the `Load Temporary Add-on...` and choose the `manifest.json` file in the `src` folder of the cloned repository to you local system.
* You have successfully loaded the extension in your Firefox browser!

You can visit `news.ycombinator.com` and view the `comments` on any thread to see the `hnlinks` extension working in your browser!

<br>
<br>
<h1 align="center"> Repository Code Structure </h1>

This is a simple extension that follows the [basic structure](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Anatomy_of_a_WebExtension) of any Firefox extension. 
* All of the extension's files are inside the `src` folder. The `manifest.json` is the key component of any browser extension. 
* This extension makes use of [`Background scripts`](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Anatomy_of_a_WebExtension#background_scripts) (`src/background.js`) for handling the long running processes such as interacting with [`Content scripts`](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Anatomy_of_a_WebExtension#content_scripts) (`src/content.js`) and exchanging messages with them to pass information using the message-passing API.
* APIs: [`HN Search API`](https://hn.algolia.com/api) to fetch the required data.

For any issues you might work on, you might have to only make changes inside the `src` folder.

<br>
<br>
<h1 align="center"> Contributing Guidelines </h1>

Please feel free to take a look at the `issues` and make pull requests with meaningful names and description.






